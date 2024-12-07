"use client";
import {useState, useEffect, useRef} from "react";
import ItemSelectorModal from "@/_custom/components/ItemSelectorModal";
import ChangeSpellModal from "./ChangeSpellModal";
import {devLog} from "@/_custom/scripts/common";
import Tooltip from "@/_custom/components/_common/Tooltip";
import NotificationModal from "@/_custom/components/NotificationModal";
import {getImageUrl} from "@/_custom/scripts/client";

export default function Component(props) {
  const tabTextBg = " bg-[#0f113f] max-h-[30px] px-4";
  const tabTextCorol = " text-[#c493ff] text-[16px]";
  const [maindata, setMainData] = useState({});
  const [status, setStatus] = useState({user_hp: 0, user_wis: 0, user_atk: 0, user_agi: 0, user_def: 0, user_luk: 0});
  const [oncetext, setOnceText] = useState("");
  const [spell, setSpell] = useState([]);
  const [noti, setNoti] = useState(null);

  /*<<<<<<<<<<<< 스킬 변경 모달 부분 변수 및 함수 <<<<<<<<<<<<*/
  const modalRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // 아이템 선택 시 호출될 함수
  const handleSelect = (item) => {
    const selectedItemIdx = selectedItem.idx;
    if (item) {
      const skillname = item.skill_name;
      const skillimg = item.skill_img_0;
      let skilldesc = null;
      if (maindata?.skills) {
        skilldesc = maindata.skills.find((skill) => skill.name === skillname)?.desc;
      }
      devLog("TabStatus - handleSelect 초오ㅗㅗㅗㅗㅗㅗㅗㅗㅗㅗㅗ기:", skillname, skillimg, skilldesc);
      const newSpell = [...spell];
      newSpell[selectedItemIdx] = {name: skillname, img: skillimg, desc: skilldesc};
      setSpell(newSpell);

      if (`user_skill${selectedItemIdx + 1}` in maindata) {
        devLog("TabStatus - handleSelect update user :", maindata?.[`user_skill${selectedItemIdx + 1}`], skillname);
        maindata[`user_skill${selectedItemIdx + 1}`] = skillname;

        // 서버에 변경사항 저장
        const formData = new FormData();
        formData.append("apitype", "member_update_skill");
        formData.append("userid", maindata.userid);
        const updateSkillData = {};
        updateSkillData[`user_skill${selectedItemIdx + 1}`] = skillname;
        formData.append("updated_skill", JSON.stringify(updateSkillData));
        fetch("/api/page", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            devLog(data);
            setNoti(`${selectedItemIdx + 1} 번째 스킬이 변경되었습니다.`);
          })
          .catch((error) => console.error("TabStatus - handleSelect update skill Error:", error));
      }
    }
    setSelectedItem(null);
  };

  // 모달 열기 및 데이터 전달
  const openModalWithData = async (event, idx) => {
    devLog("openModalWithData", idx, props.currentUser, props.user, props.skill, props?.skill?.length);
    if (!(props?.user && props?.currentUser && props.user.userid === props.currentUser)) return;
    // 스펠의 이미지가 있을경우 선택지를 제공
    if (spell[idx]?.img) {
      handleChoice(event, idx);
    } else {
      // 스펠 이미지가 없을 경우 모달을 열어서 선택하도록 함
      openModal(idx); // openModal 호출
    }
  };

  const openModal = (idx) => {
    setSelectedItem({idx: idx});
    if (props?.skill?.length) modalRef.current.openModal(props.skill); // openModal 호출
  };
  /*>>>>>>>>>>>>> 스킬 모달 변수 및 함수 끝 >>>>>>>>>>>>>*/
  /*<<<<<<<<<<<< 설명 변경 모달 부분 변수 및 함수 <<<<<<<<<<<<*/
  const descModalRef = useRef(null);
  const submitSpellDesc = (spellIdx, spellDesc) => {
    devLog("submitSpellDesc", spell[spellIdx], spellIdx, spellDesc);
    // 스펠 인덱스에 해당하는 부분만 바꿔서 스테이트 새로 저장
    const newSpell = [...spell];
    newSpell[spellIdx] = {...newSpell[spellIdx], desc: spellDesc};
    setSpell(newSpell);
    // 서버에 변경사항 저장
    const formData = new FormData();
    formData.append("apitype", "member_update_skill_desc");
    formData.append("userid", props.currentUser);
    formData.append("skill_name", spell[spellIdx].name);
    formData.append("skill_desc", spellDesc);
    fetch("/api/page", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        devLog(data);
        setNoti("스킬 설명이 변경되었습니다.");
      })
      .catch((error) => console.error("TabStatus(handleChoiceAction) change spell Error:", error));

    setSelectedItem(null);
  };
  /*>>>>>>>>>>>>> 설명 모달 변수 및 함수 끝 >>>>>>>>>>>>>*/

  /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 선택 버튼 및 설명 교체 띄우기 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  const handleChoice = (event, index) => {
    event.stopPropagation();
    devLog("스펠 선택:", event, event.target, event.clientX, event.clientY, spell[index]);
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedItem({
      idx: index,
      spell: spell[index].name,
      desc: spell[index].desc,
      position: {x: rect.right, y: rect.bottom}, // 아이템의 오른쪽 아래 위치
    });
  };

  const handleChoiceAction = () => {
    devLog(`${selectedItem.spell} 스펠 변경 창`);
    // 서버에 변경사항 저장
    descModalRef.current.openModal(selectedItem);
    setSelectedItem(null);
  };

  const handleBlur = (event) => {
    if (event.relatedTarget) return;
    if (selectedItem && selectedItem.spell) {
      devLog("아이템 선택 해제:", event, event.relatedTarget);
      setSelectedItem(null);
    }
  };
  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 선택 버튼 띄우기 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  const getSpellImage = (spellname) => {
    if (props?.skill) {
      let spell = props.skill.find((item) => item.skill_name === spellname);
      // devLog("TabStatus getSpellImage", spellname, spell);
      return spell?.skill_img_0 || null;
    }
  };

  useEffect(() => {
    if (props?.user) {
      setMainData(props.user);
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
        let spellDesc = props.user?.skills?.find((skill) => skill.name === props.user[`user_skill${i}`])?.desc;
        spellArr.push({name: props.user[`user_skill${i}`], img: getSpellImage(props.user[`user_skill${i}`]), desc: spellDesc});
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
            <Tooltip
              key={index}
              content={
                spell?.[index]?.img ? (
                  <span>
                    {spell[index].name}
                    <br />
                    {spell[index]?.desc || ""}
                  </span>
                ) : null
              }
            >
              <div
                tabIndex={0} // 포커스 가능하도록 설정
                onBlur={handleBlur} // 외부 클릭 시 선택 해제
                onClick={(e) => openModalWithData(e, index)}
                className="img-member-init img-member-tab-imagebox flex justify-center items-center font-nexon text-white text-[45px]"
              >
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
      <ChangeSpellModal ref={descModalRef} onButtonClick={submitSpellDesc} title={"스킬 선택"} dataNameKey={"skill_name"} dataImageKey={"skill_img_0"} />
      {noti && <NotificationModal message={noti} onClose={() => setNoti(null)} />}
      {/* 선택된 아이템의 액션 버튼 */}
      {selectedItem && selectedItem?.spell && (
        <div
          className={`fixed bg-white p-2 rounded shadow-lg flex flex-col space-y-2 z-50`}
          style={{
            top: `${selectedItem.position.y + window.scrollY - 10}px`, // 아이템의 오른쪽 아래로 위치
            left: `${selectedItem.position.x + window.scrollX - 10}px`,
          }}
        >
          <button className="text-blue-500" onClick={() => handleChoiceAction()}>
            스킬설명수정
          </button>
          <button className="text-red-500" onClick={() => openModal(selectedItem.idx)}>
            스킬교체
          </button>
        </div>
      )}
    </>
  );
}
