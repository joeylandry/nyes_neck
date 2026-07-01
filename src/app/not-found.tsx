import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";

export default function NotFound() {
  return (
    <main className="site-main flex min-h-screen items-center justify-center px-5 text-center">
      <div>
        <Wordmark className="text-xl" />
        <p className="font-heading mt-8 text-7xl font-bold tracking-[-0.07em]">404</p>
        <h1 className="mt-3 text-2xl font-semibold">This page has drifted out of view.</h1>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#161616] px-7 font-semibold text-white">Return home</Link>
      </div>
    </main>
  );
}
