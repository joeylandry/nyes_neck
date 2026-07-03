export function collectionPageLabel(label: string) {
  return /\bcollection$/i.test(label.trim()) ? label.trim() : `${label.trim()} Collection`;
}

export function collectionTileLabel(label: string) {
  return label.trim().replace(/\s+collection$/i, "");
}
