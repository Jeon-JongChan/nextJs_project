"use client";
import Link from "next/link";
import {useState} from "react";

export default function Component() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <Link href="/battle/patrol">
            <div className="text-lg font-bold text-center">패트롤</div>
            <img src="https://via.placeholder.com/300?text=patrol" alt="이미지" className="mb-4" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <Link href="/battle/raid">
            <div className="text-lg font-bold text-center">레이드</div>
            <img src="https://via.placeholder.com/300?text=RAID" alt="이미지" className="mb-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
