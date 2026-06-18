"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 md:p-16 pt-32 min-h-screen grid grid-cols-12 gap-xl">
      <section className="col-span-5 flex justify-center flex-col gap-4">
        <span className="w-fit text-primary-fixed-dim bg-on-tertiary/90 px-3 py-1 rounded-xl border border-[rgba(255,255,255,0.08)]">
          {" "}
          <span className="inline-block w-3 h-3 bg-primary-fixed-dim rounded-full"></span>{" "}
          Version 1.0 Now Live
        </span>
        <h1 className="text-[72px] leading-none py-2 font-bold">
          Precision Meets{" "}
          <div className="inline bg-linear-to-r from-primary-fixed-dim to-cyan-500 bg-clip-text text-transparent">
            Creativity.
          </div>
        </h1>
        <p className="text-[18px] text-primary/60">
          The ultimate digital workspace for high-performance designers.
          Experience lightning-fast vector rendering and real-time 2D synthesis.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={"/dashboard"} className="bg-primary-fixed-dim/80 hover:-translate-y-1 px-6 py-3 text-on-tertiary font-bold text-[24px] rounded-lg transition-all duration-300">
            Start Creating
          </Link>
          <Link href={"/dashboard"} className="border-2 border-on-tertiary-container hover:-translate-y-1 px-6 py-3 text-on-tertiary-fixed-variant font-bold text-[24px] rounded-lg transition-all duration-300">
            Watch Demo
          </Link>
        </div>
      </section>
      <section></section>
    </main>
  );
}
