"use client";
import Image from "next/image";
import {useState} from "react";

export default function Component() {
  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap p-5">
        <div className="flex-1">
          {/* 이미지 경로는 실제 프로젝트에 맞게 변경해주세요. */}
          <img src="https://via.placeholder.com/300?text=TEMP" alt="이미지 설명" className="w-full" />
        </div>
        <div className="flex-1 ml-0 md:ml-5">
          <div className="mb-5">
            <h2 className="text-2xl font-bold mb-2">이미지 제목</h2>
            <p>이미지에 대한 설명을 여기에 작성합니다. 해당 이미지가 어떤 의미를 담고 있는지, 어떤 상황에서 촬영되었는지 등의 배경 정보를 포함할 수 있습니다.</p>
          </div>
          <div className="flex flex-col w-full justify-between">
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">버튼 1</button>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">버튼 2</button>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">버튼 3</button>
          </div>
        </div>
      </div>
    </>
  );
}
