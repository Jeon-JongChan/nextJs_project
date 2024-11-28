"use client";
import {useState, useEffect, useRef} from "react";
import Image from "next/image";
import ItemSelectorModal from "@/_custom/components/ItemSelectorModal";
import {devLog} from "@/_custom/scripts/common";
import Tooltip from "@/_custom/components/_common/Tooltip";
import {getImageUrl} from "@/_custom/scripts/client";

export default function Component(props) {
  const tabTextBg = " bg-[#0f113f] max-h-[30px] px-4";
  const tabTextCorol = " text-[#c493ff] text-[16px]";
  const [status, setStatus] = useState({user_hp: 0, user_wis: 0, user_atk: 0, user_agi: 0, user_def: 0, user_luk: 0});
  const [oncetext, setOnceText] = useState("");
  const [spell, setSpell] = useState([]);

  /*<<<<<<<<<<<< 모달 부분 변수 및 함수 <<<<<<<<<<<<*/
  const modalRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // 아이템 선택 시 호출될 함수
  const handleSelect = (item) => {
    devLog("TabStatus - handleSelect :", item, selectedItem, `user_skill${selectedItem + 1}` in props.user, props.user);
    if (item) {
      const skillname = item.skill_name;
      const skillimg = item.skill_img_0;
      const newSpell = [...spell];
      newSpell[selectedItem] = {name: skillname, img: skillimg};
      setSpell(newSpell);

      if (`user_skill${selectedItem + 1}` in props.user) {
        devLog("TabStatus - handleSelect update user :", props.user?.[`user_skill${selectedItem + 1}`], skillname);
        props.user[`user_skill${selectedItem + 1}`] = skillname;

        // 서버에 변경사항 저장
        const formData = new FormData();
        formData.append("apitype", "member_update_skill");
        formData.append("userid", props.user.userid);
        const updateSkillData = {};
        updateSkillData[`user_skill${selectedItem + 1}`] = skillname;
        formData.append("updated_skill", JSON.stringify(updateSkillData));
        fetch("/api/page", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => devLog(data))
          .catch((error) => console.error("TabStatus - handleSelect update skill Error:", error));
      }
    }
  };

  // 모달 열기 및 데이터 전달
  const openModalWithData = async (idx) => {
    devLog("openModalWithData", idx, props.currentUser, props.user, props.skill, props?.skill?.length);
    if (!(props?.user && props?.currentUser && props.user.userid === props.currentUser)) return;
    if (props?.skill?.length) modalRef.current.openModal(props.skill); // openModal 호출
    setSelectedItem(idx);
  };
  /*>>>>>>>>>>>>>  모달 변수 및 함수 끝 >>>>>>>>>>>>>*/

  const getSpellImage = (spellname) => {
    if (props?.skill) {
      let spell = props.skill.find((item) => item.skill_name === spellname);
      // devLog("TabStatus getSpellImage", spellname, spell);
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
      for (let i = 1; i <= 5; i++) {
        spellArr.push({name: props.user[`user_skill${i}`], img: getSpellImage(props.user[`user_skill${i}`])});
      }
      setSpell(spellArr);
      devLog("TabStatus useEffect", props, spellArr);

      if (props.user?.usertab_second_word) setOnceText(props.user.usertab_second_word);
    }
  }, [props]);
  return (
    <>
      <div className="flex flex-col w-full px-6 py-2">
        <h1 className="text-white text-[16px] mt-4">시커 스테이터스</h1>
        <div className="grid grid-cols-2 gap-2">
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={tabTextCorol}>HP</span>
            <span id="user_hp" className={"w-full text-right font-nexon" + tabTextCorol}>
              {status.user_hp}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={tabTextCorol}>WIS</span>
            <span id="user_wis" className={"w-full text-right font-nexon" + tabTextCorol}>
              {status.user_wis}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={tabTextCorol}>ATK</span>
            <span id="user_atk" className={"w-full text-right font-nexon" + tabTextCorol}>
              {status.user_atk}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={tabTextCorol}>AGI</span>
            <span id="user_agi" className={"w-full text-right font-nexon" + tabTextCorol}>
              {status.user_agi}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={tabTextCorol}>DEF</span>
            <span id="user_def" className={"w-full text-right font-nexon" + tabTextCorol}>
              {status.user_def}
            </span>
          </div>
          <div className={"col-span-1 flex flex-row" + tabTextBg}>
            <span className={tabTextCorol}>LUK</span>
            <span id="user_luk" className={"w-full text-right font-nexon" + tabTextCorol}>
              {status.user_luk}
            </span>
          </div>
        </div>
        <h1 className="text-white text-[16px] mt-4">스펠</h1>
        <div className="grid grid-cols-5 gap-12">
          {[0, 1, 2, 3, 4].map((index) => (
            <Tooltip key={index} content={spell?.[index]?.img ? <span>{spell?.[index].name}</span> : null}>
              <div onClick={() => openModalWithData(index)} className="img-member-init img-member-tab-imagebox flex justify-center items-center font-nexon text-white text-[45px]">
                {spell?.[index]?.img ? <img src={getImageUrl(spell[index].img)} className="w-[45px] h-[45px]" /> : <span style={{position: "relative", top: "3px"}}>+</span>}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
      <h1 className="member_once_text absolute text-white text-[16px]" style={{bottom: "20px", left: "25px"}}>
        &quot;{oncetext}&quot;
      </h1>
      <ItemSelectorModal ref={modalRef} onSelect={handleSelect} title={"스킬 선택"} dataNameKey={"skill_name"} dataImageKey={"skill_img_0"} />
    </>
  );
}
