"use client";

import Image from "next/image";

export default function SectionHeader() {
  return (
    <div className="flex flex-col justify-center items-center w-20 h-10 md:w-16 md:h-8 bg-transparent relative mb-3 mt-3">
      <Image fill={true} src="/ramo.png" alt="Ramo pq a vivi é mimada" />
    </div>
  );
}
