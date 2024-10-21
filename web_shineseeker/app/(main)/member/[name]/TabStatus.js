"use client";
import {useState, useEffect} from "react";
import Image from "next/image";

export default function Component(props) {
  const tabTextBg = " bg-[#0f113f]";
  const tabTextCorol = " text-[#c493ff]";
  const [status, setStatus] = useState({user_hp: 0, user_wis: 0, user_atk: 0, user_agi: 0, user_def: 0, user_luk: 0});
  const [oncetext, setOnceText] = useState("");

  const [spell, setSpell] = useState([]);

  const getSpellImage = (spellname) => {
    if (props?.skill) {
      let spell = props.skill.find((item) => item.skill_name === spellname);
      console.log("getSpellImage", spellname, spell);
      return spell?.skill_img_0 || null;
    }
  };

  useEffect(() => {
    if (props?.user) {
      setStatus({
        user_hp: props.user?.user_hp || 0,
        user_wis: props.user?.user_wis || 0,
        user_atk: props.user?.user_atk || 0,
        user_agi: props.user?.user_agi || 0,
        user_def: props.user?.user_def || 0,
        user_luk: props.user?.user_luk || 0,
      });

      let spellArr = [];
      for (let i = 0; i < 5; i++) {
        spellArr.push(getSpellImage(props.user[`user_skill${i}`]));
      }
      setSpell(spellArr);
      console.log("TabStatus useEffect", props, spellArr);

      if (props.user?.usertab_second_word) setOnceText(props.user.usertab_second_word);
    }
  }, [props]);
  return (
    <>
      <div className="flex flex-col w-full px-12 py-2">
        <h1 className="text-white text-[24px] mt-4">시커 스테이터스</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>HP</span>
            <span id="user_hp" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              {status.user_hp}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>WIS</span>
            <span id="user_wis" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              {status.user_wis}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>ATK</span>
            <span id="user_atk" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              {status.user_atk}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>AGI</span>
            <span id="user_agi" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              {status.user_agi}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>DEF</span>
            <span id="user_def" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              {status.user_def}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={"text-[24px]" + tabTextCorol}>LUK</span>
            <span id="user_luk" className={"text-[24px] w-full text-right font-nexon" + tabTextCorol}>
              {status.user_luk}
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
      <h1 className="member_once_text absolute text-white text-[36px]" style={{bottom: "20px", left: "25px"}}>
        &quot;{oncetext}&quot;
      </h1>
    </>
  );
}
