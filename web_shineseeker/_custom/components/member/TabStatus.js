"use client";
import {useState} from "react";
import Image from "next/image";

export default function Component() {
  return (
    <>
      <div key="1">
        <div className="member-stat-line1">
          <span>Basic Stats</span>
        </div>
        <div className="member-stat-line2 grid grid-cols-2">
          <div className="col-span-1 border border-double border-black pl-2">
            <span>HP</span> <span>100</span>
          </div>
          <div className="col-span-1 border border-double border-black pl-2">
            <span>공격력</span> <span>100</span>
          </div>
          <div className="col-span-1 border border-double border-black pl-2">
            <span>방어력</span> <span>100</span>
          </div>
          <div className="col-span-1 border border-double border-black pl-2">
            <span>종합능력치</span> <span>300</span>
          </div>
        </div>
        <div className="member-stat-line3 grid grid-cols-12 gap-2">
          <div className="stat-line3-item flex flex-col col-span-3">
            <div className="text-center">디커?</div>
            <div className="text-center bg-blue-800 text-white">MIDDLE</div>
          </div>
          <div className="stat-line3-item flex flex-col col-span-3">
            <div className="text-center">디커?</div>
            <div className="text-center bg-red-800 text-white">MIDDLE</div>
          </div>
          <div className="stat-line3-item flex flex-col col-span-3">
            <div className="text-center">디커?</div>
            <div className="text-center bg-red-800 text-white">MIDDLE</div>
          </div>
        </div>
        <div className="member-stat-line4 grid grid-cols-5 gap-2">
          <div className="stat-line4-item flex flex-col justify-center items-center">
            <span className="text-center">텍스트</span>
            <div className="relative w-full h-10">
              <Image src="https://via.placeholder.com/100" alt="이미지" fill={true} />
            </div>
            <span className="text-center">텍스트</span>
          </div>
        </div>
        <div className="member-stat-line5 grid grid-cols-2 gap-2">
          <div className="flex flex-row">
            <div className="relative w-full h-10">
              <Image src="https://via.placeholder.com/100" alt="이미지" fill={true} />
            </div>
            <span>0</span>/<span>120</span>
          </div>
        </div>
      </div>
    </>
  );
}
