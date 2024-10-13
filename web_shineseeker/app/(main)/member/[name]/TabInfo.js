"use client";
import {useState} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

export default function Home(props) {
  return (
    <>
      <div className="flex flex-col w-full px-5 py-2">
        <div className="memeter-tab">
          <h2 className="text-white text-[24px]">기본정보</h2>
          <textarea className="memeter_tab_baseinfo w-[800px] min-h-[150px]"></textarea>
        </div>
        <div className="memeter-tab">
          <h2 className="text-white text-[24px]">상세정보</h2>
          <textarea className="memeter_tab_detailinfo w-[800px] min-h-[150px]"></textarea>
        </div>
      </div>
    </>
  );
}
