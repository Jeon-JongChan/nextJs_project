"use client";
import {useState, useEffect, useCallback, useRef} from "react";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정
import {getImageUrl} from "@/_custom/scripts/client";
import {devLog, sleep} from "/_custom/scripts/common";
import Image from "next/image";
import SocketClient from "./SocketClient";
import RaidProcessButton from "@/public/images/raid/05_raid_03_gobutton.png";
import NextIndicator from "@/public/images/next.webp";
import LogViewer from "@/_custom/components/LogViewer";
import SpriteAnimation from "@/_custom/components/SpriteAnimation";
import ImageOverlay from "./ImageOverlay";

export default function Home({params}) {
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isGameClear, setIsGameClear] = useState(true);
  const [hpCurrent, setHpCurrent] = useState(0);
  const bossImage = "/images/raid/boss_example.webp"; // 보스 이미지 경로
  const MemberPosCss = ["top-[0px] left-[0px]", "top-[145px] left-[0px]", "top-[290px] left-[0px]", "top-[0px] right-[0px]", "top-[145px] right-[0px]", "top-[290px] right-[0px]"];
  const raidTargetUsers = useRef();

  const {tokenRef} = useAuth() || {};
  const socketDataRef = useRef(null);
  const socketClient = SocketClient({roomId: params.raidname, username: tokenRef?.current?.user?.name, onChat: onChat, onData: onData});
  const [socketState, setSocketState] = useState(false);
  const [order, setOrder] = useState([]);
  const [users, setUsers] = useState([]);
  const [boss, setBoss] = useState({});
  const [log, setLog] = useState([]);
  const [clickedSkill, setClickedSkill] = useState("");

  const fetchData = useCallback(async () => {
    let response = await fetch(`/api/page/raid?apitype=raid_data&raid_name=${params.raidname}`);
    const newData = await response.json();
    if (newData?.data?.users?.length) {
      setOrder([]);
      raidTargetUsers.current = [];
      newData.data.users.forEach((user, index) => {
        raidTargetUsers.current.push(user.userid);
        user.maxHP = user.user_hp;
        user.hp = user.user_hp;
        user.wis = user.user_wis;
        user.agi = user.user_agi;
        user.luk = user.user_luk;
        user.def = user.user_def;
        user.atk = user.user_atk;
        if (!user?.skillImages) user.skillImages = [];
        if (!user?.effectImages) user.effectImages = [];
        user.skills.forEach((skill) => {
          user.skillImages.push(skill.skill_img_0);
          user.effectImages.push(skill.skill_img_1);
        });
        setOrder((prevOrder) => [...prevOrder, {userid: user.userid, order: index, active: index === 0}]);
      });
      setUsers(newData.data.users);
      devLog("유저데이터 가져오기 완료 ::::", newData.data.users, raidTargetUsers);
    }
    if (newData?.data?.boss) {
      devLog("보스데이터 가져오기 완료 ::::", newData.data.boss);
      let boss = newData.data.boss[0];
      boss.maxHP = boss.monster_hp;
      boss.hp = boss.monster_hp;
      boss.wis = boss.monster_wis;
      boss.agi = boss.monster_agi;
      boss.luk = boss.monster_luk;
      boss.def = boss.monster_def;
      boss.atk = boss.monster_atk;
      setBoss(boss);
      setHpCurrent(newData.data.boss[0].monster_hp);
      setOrder((prevOrder) => [...prevOrder, {userid: "boss", order: order.length, active: false}]);
    }
  }, []);

  /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 소켓 수신 이벤트 처리 함수 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  function onChat(data) {
    devLog("채팅 수신:", data);
    let chat = data.chat;
    socketDataRef.current.type = "chat";
    socketDataRef.current.data = chat;
    setSocketState(true);
  }

  function onData(data) {
    devLog("onData 데이터 수신:", data, socketDataRef);
    socketDataRef.current.type = "data";
    socketDataRef.current.data = data;
    setSocketState(true);
  }

  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
  const clickedIcon = (e) => {
    if (!raidTargetUsers.current.includes(tokenRef?.current?.user?.name)) {
      alert("관전자는 클릭할 수 없습니다.");
      devLog("관전자는 클릭할 수 없습니다.", raidTargetUsers.current, raidTargetUsers.current.includes(tokenRef?.current?.user?.name), tokenRef?.current?.user?.name);
      return;
    }
    e.stopPropagation();
    let name = e.currentTarget.dataset.name;
    // devLog("아이콘 클릭됨", e.target, e.currentTarget, name);
    setClickedSkill(name);
    // 클릭된 객체에 clicked-button 클래스 추가 및 다른 객체에서 제거
    document.querySelectorAll(".clicked-button").forEach((button) => button.classList.remove("clicked-button"));
    e.target.classList.add("clicked-button");
  };

  const clickedProcess = (e) => {
    if (!raidTargetUsers.current.includes(tokenRef?.current?.user?.name)) {
      alert("관전자는 클릭할 수 없습니다.");
      return;
    }
    if (e) e.stopPropagation();
    // devLog("진행하기 버튼 클릭됨", clickedSkill);
    if (!clickedSkill) return;

    let transformData = {};
    let orderIndex = order.findIndex((item) => item.active === true);
    transformData.nextIndex = orderIndex + 1 >= order.length ? 0 : orderIndex + 1;
    transformData.clickedSkill = clickedSkill;
    transformData.clickUser = order[orderIndex].userid;

    socketClient.sendData(transformData);
    setClickedSkill(null);
    let buttons = document.querySelectorAll(".clicked-button");
    buttons.forEach((button) => button.classList.remove("clicked-button"));
  };

  const handleKeyDown = (e) => {
    if (!raidTargetUsers.current.includes(tokenRef?.current?.user?.name)) {
      alert("관전자는 채팅할 수 없습니다.");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      let message = e.target.value;
      socketClient.sendChat(message);
      e.target.value = "";
    }
  };

  function RaidMember({bgImage, hpCurrent, hpMax, icons = [], css = "", next = false, effect = null}) {
    return (
      /* prettier-ignore */
      <div className={"absolute w-[245px] h-[125px] bg-cover bg-center rounded-lg " + css} style={{backgroundImage: `url(${getImageUrl(bgImage)})`}}>
        {/* 진행하기 버튼 */}
        <button onClick={(e)=>clickedProcess(e)} className="absolute w-[80px] h-[25px]" style={{top: "10px", right: "12px"}}> <Image src={RaidProcessButton} alt="raid-process-button" width={80} height={25} /> </button>
        {/* HP 텍스트 */}
        <div className="absolute text-white" style={{top: "40px", right: "15px"}}>HP</div>
  
        {/* 잔여 HP */}
        <div className="absolute text-white" style={{top: "55px", right: "15px"}}>{hpCurrent}/{hpMax}</div>
  
        {/* 아이콘들 */}
        <div className="absolute bottom-2 left-2 flex space-x-3">
          {icons.map((icon, index) => icon && (
            <button key={index} onClick={(e)=>clickedIcon(e)} data-name={icon.skill_name} className="relative flex justify-center items-center w-[35px] h-[35px] img-raid-icon-frame">
              <img src={getImageUrl(icon.skill_img_0)} alt={`icon-${index}`} className="max-w-[30px] max-h-[30px]" width={30} height={30} />
            </button>
          ))}
        </div>
         <SpriteAnimation spriteImage={getImageUrl(effect)} frameWidth={100} frameHeight={100} cols={5} rows={1} playCount={1} css="left-[70px] bottom-[10px]"/>
        {next && <Image src={NextIndicator} alt="next-indicator" width={128} height={128} className="absolute bottom-[2px] left-[-150px]" />}
      </div>
    );
  }

  return isGameEnded ? (
    <Ended isClear={isGameClear} item={"사람얼굴"} image={"/images/04_member_box.webp"} />
  ) : (
    <>
      {/* <button className="fixed text-[40px] top-0" onClick={() => {setIsGameEnded(true); setIsGameClear(false);}}>게임 실패</button>
      <button className="fixed text-[40px] top-0 left-[40px]" onClick={() => { setIsGameEnded(true); setIsGameClear(true);}}>게임 성공</button>
      {/* <ImageOverlay image={"/images/ultimate.webp"} onClose={() => devLog("Overlay Closed")} /> */}
      {/* <input type="number" max={parseInt(boss?.monster_hp) || 100} onChange={(e) => setHpCurrent(e.target.value > parseInt(boss?.monster_hp) ? parseInt(boss.monster_hp) : e.target.value)} className="fixed text-[40px] top-0 right-[40px]" /> */}
      <div className="absolute flex flex-col items-center" style={{width: "760px", height: "600px", top: "-30px"}}>
        {order?.[order.length - 1]?.active && <Image src={NextIndicator} alt="next-indicator" width={64} height={64} className="absolute top-[-50px] rotate-90" />}
        <div className="relative block text-white text-[24px]">{boss?.monster_name || "보스 이름"}</div>
        <div className="relative flex w-full h-full mt-1">
          <HPBar maxHP={boss?.monster_hp} currentHP={hpCurrent} />
        </div>
        <div className="relative flex" style={{width: "760px", height: "535px"}}>
          <img src={boss?.monster_img_0 ? getImageUrl(boss.monster_img_0) : getImageUrl(bossImage)} alt="raid-bg" className="w-full h-full" />
        </div>
      </div>
      <div className="relative flex w-full h-full">
        {users.map((user, index) => (
          <RaidMember
            key={index}
            bgImage={getImageUrl(user.user_img_3)}
            hpCurrent={user.user_hp}
            hpMax={user.maxHP}
            icons={user.userSkill}
            css={MemberPosCss[index]}
            next={order?.[index]?.active || false}
            effect={order?.[index]?.effect || false}
          />
        ))}
      </div>
      <div className="absolute flex flex-col items-center" style={{width: "1000px", height: "300px", bottom: "-300px"}}>
        {log && <LogViewer height="126px" logs={log} css={"w-full rounded-lg mt-2"} opacity={0.8} />}
        <input onKeyDown={handleKeyDown} type="text" className="w-full px-2" />
      </div>
    </>
  );
}

function HPBar({maxHP, currentHP}) {
  // HP 비율 계산
  const hpPercentage = (currentHP / maxHP) * 1.0 * 100;
  // console.log("HP 비율:", maxHP, currentHP, currentHP / maxHP, hpPercentage);
  return (
    <div className="relative w-full bg-white rounded-full" style={{height: "8px"}}>
      {/* 초록색 바 (HP가 남아있는 부분) */}
      <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-300" style={{width: `${hpPercentage}%`}} />
      {/* 흰색 바 (HP가 부족한 부분, 오른쪽에만 표시) */}
      {/* <div className="absolute top-0 right-0 h-full bg-white rounded-full transition-all duration-300" style={{width: `${100 - hpPercentage}%`}} /> */}
    </div>
  );
}

function Ended({isClear = true, image = "", item = ""}) {
  return (
    <div className={"fixed flex flex-col items-center justify-center w-screen h-screen z-50 top-0 left-0 " + (isClear ? "img-home-bg" : "bg-black")}>
      <div className={"relative flex flex-col items-center justify-center text-white " + (isClear ? "img-raid-success-frame" : "bg-black")} style={{width: "670px", height: "420px"}}>
        {isClear ? (
          <>
            <h6 className="relative text-[60px] font-bold">VICTORY!</h6>
            <div className="relative flex items-center justify-center img-raid-icon-frame" style={{width: "145px", height: "145px"}}>
              <img src={getImageUrl(image)} alt="raid-item" style={{width: "130px", height: "130px"}} />
            </div>
            <span className="relative text-[24px]">레이드를 성공했습니다.</span>
            <span className="relative text-[24px]">{item} 을(를) 획득했습니다.</span>
          </>
        ) : (
          <>
            <h6 className="relative text-[60px] font-bold">DEFEAT!</h6>
            <span className="relative text-[24px]">레이드에 실패했습니다....</span>
          </>
        )}
      </div>
      <button className="relative text-[24px] text-white" style={{top: "-445px", right: "-260px"}} onClick={() => setIsGameEnded(false)}>
        홈으로 돌아가기▶
      </button>
    </div>
  );
}
