"use client";
import {useState} from "react";
import Image from "next/image";

export default function Component() {
  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md grid grid-cols-3">
        <div className="col-span-1">
          <img src="https://via.placeholder.com/300x300?text=login" alt="로고" width={100} height={80} />
        </div>
        <form className="col-span-2">
          <div className="mb-1 flex border-2 rounded-md">
            <input type="text" placeholder="ID" id="username" name="username" className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:outline-none" />
          </div>
          <div className="mb-1 border-2 rounded-md">
            <input type="password" placeholder="PW" id="password" name="password" className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:outline-none" />
          </div>
        </form>
        {/* <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          로그인
        </button> */}
      </div>
    </>
  );
}
