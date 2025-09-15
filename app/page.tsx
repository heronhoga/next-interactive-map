"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/map"), { ssr: false });

export default function Home() {
  return (
    <div className="bg-amber-100 mx-auto my-5 w-[98%] h-[480px]">
      <Map posix={[12.995218768575647, 77.5548894807005]} />
    </div>
  );
}