"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import {devLog} from "@/_custom/scripts/common";

export default function Component(props) {
  const clickTab = (e) => {
    // 기존 active tab 정상화
    cancleActiveTab();
    e.target.classList.add("nav-active");
    e.target.style.color = "#806faf";
  };

  const cancleActiveTab = () => {
    const activeTab = document.querySelector(".nav-active");
    if (activeTab) {
      activeTab.classList.remove("nav-active");
      activeTab.style.color = "white";
    }
  };
  const linkStyle = "text-white hover:text-gray-300 px-3 pb-2 pt-8 top-1 col-span-1 text-center relative img-nav-btn-init hover:text-[#806FAF] focus:text-[#806FAF]";
  const navSize = " ";

  return (
    <>
      <div className="relative grid grid-cols-5 items-center gap-x-4 img-nav-bg" style={{minWidth: "687px"}}>
        <div className="relative col-span-5 grid grid-cols-5 items-center gap-x-1" style={{top: "-18px", fontSize: "18px"}}>
          <Link href="/world" className={linkStyle + navSize} onClick={clickTab}>
            세계관
          </Link>
          <Link href="/read" className={linkStyle + navSize} onClick={clickTab}>
            필독
          </Link>
          <Link href="/member" className={linkStyle + navSize} onClick={clickTab}>
            멤버란
          </Link>
          <Link href="/battle" className={linkStyle + navSize} onClick={clickTab}>
            샤인시커
          </Link>
          <Link href="/market" className={linkStyle + navSize} onClick={clickTab}>
            교환소
          </Link>
        </div>
      </div>
    </>
  );
}
