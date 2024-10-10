"use client";
import {useState} from "react";
import Image from "next/image";

export default function Component() {
  return (
    <>
      <div className="max-w-md mx-auto p-6 rounded-lg grid grid-cols-3" style={{width: "320px"}}>
        <button className="col-span-1 relative" style={{margin: "4px 4px"}}>
          <Image src="/images/home/01_home_login_box_button.png" alt="Shineseeker" fill={true} />
        </button>
        <form className="col-span-2">
          <input type="text" placeholder="ID" id="username" name="username" className="mt-1 p-2 block w-full border-gray-300 rounded-full focus:outline-none" />
          <input type="password" placeholder="PW" id="password" name="password" className="mt-1 p-2 block w-full border-gray-300 rounded-full focus:outline-none" />
        </form>
        {/* <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          로그인
        </button> */}
      </div>
    </>
  );
}
