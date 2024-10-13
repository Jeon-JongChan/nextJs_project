"use client";
import {useState, useEffect} from "react";
import Image from "next/image";

export default function Component(props) {
  const tabTextBg = " bg-[#0f113f]";
  const tabTextCorol = " text-[#c493ff]";

  const [spell, setSpell] = useState([]);
  useEffect(() => {
    if (props?.spell?.length) {
      setSpell(props.spell);
    }
  }, []);
  return (
    <>
      <div className="flex flex-col w-full px-12 py-2">
        <h1 className="text-white text-[24px] mt-4">시커 스테이터스</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>HP</span>
            <span id="user_hp" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              100
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>WIS</span>
            <span id="user_wis" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              100
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>ATK</span>
            <span id="user_atk" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              100
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>AGI</span>
            <span id="user_agi" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              100
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>DEF</span>
            <span id="user_def" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              100
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>LUK</span>
            <span id="user_luk" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              100
            </span>
          </div>
        </div>
        <h1 className="text-white text-[24px] mt-4">스펠</h1>
        <div className="grid grid-cols-5 gap-12">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="img-member-init img-member-tab-imagebox flex justify-center items-center font-nexon text-white text-[60px]">
              {spell?.[index] ? <img src={spell[index]} className="w-full h-full" /> : "+"}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
