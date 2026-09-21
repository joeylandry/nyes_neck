"use client";

import { useSyncExternalStore } from "react";

/**
 * A localStorage-backed external store.
 *
 * Reading persisted state inside `useEffect` forces a second render pass on
 * every mount and makes the first paint disagree with the stored value. These
 * stores are read through `useSyncExternalStore` instead, so the value is
 * available on the hydration render and changes made in another tab are picked
 * up automatically.
 */
export type PersistentStore<T> = {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
};

export function createPersistentStore<T>({
  key,
  fallback,
  parse,
}: {
  key: string;
  /** Value used on the server and whenever storage is empty or unreadable. */
  fallback: T;
  /** Validates the persisted JSON. Return `undefined` to fall back. */
  parse: (value: unknown) => T | undefined;
}): PersistentStore<T> {
  const listeners = new Set<() => void>();
  // Snapshots must be referentially stable or useSyncExternalStore loops.
  let snapshot: T = fallback;
  let hydrated = false;

  function read(): T {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return parse(JSON.parse(raw) as unknown) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  // `event.key` is null when storage is cleared wholesale, which also affects us.
  function onStorage(event: StorageEvent) {
    if (event.key !== null && event.key !== key) return;
    snapshot = read();
    emit();
  }

  return {
    subscribe(onStoreChange) {
      if (!listeners.size) window.addEventListener("storage", onStorage);
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
        if (!listeners.size) window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot() {
      if (!hydrated) {
        snapshot = read();
        hydrated = true;
      }
      return snapshot;
    },
    getServerSnapshot() {
      return fallback;
    },
    set(value) {
      snapshot = value;
      hydrated = true;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage is unavailable in private browsing and locked-down contexts.
        // The in-memory snapshot still drives the UI for this session.
      }
      emit();
    },
  };
}

export function usePersistentStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
