"use client";
import Link from "next/link";
import {useState} from "react";
import Image from "next/image";

export default function Component() {
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-2 gap-48">
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <Link href="/battle/patrol" className="mt-10">
            <Image src="/images/patrol/05_patrol_enter_button.png" alt="이미지" className="mb-4" width={444} height={529} />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <Link href="/battle/raid">
            <Image src="/images/patrol/05_raid_enter_button.png" alt="이미지" className="mb-4" width={376} height={529} />
          </Link>
        </div>
      </div>
    </div>
  );
}
