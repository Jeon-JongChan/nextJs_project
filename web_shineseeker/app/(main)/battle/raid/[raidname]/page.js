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
import UserModal from "./UserModal";

export default function Home({params}) {
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isGameClear, setIsGameClear] = useState(true);
  const [bossHp, setBossHp] = useState(0);
  const bossImage = "/images/raid/boss_example.webp"; // 보스 이미지 경로
  const MemberPosCss = ["top-[0px] left-[0px]", "top-[145px] left-[0px]", "top-[290px] left-[0px]", "top-[0px] right-[0px]", "top-[145px] right-[0px]", "top-[290px] right-[0px]"];
  const raidTargetUsers = useRef();

  const {tokenRef} = useAuth() || {};
  const socketDataRef = useRef(null);
  const syncRef = useRef(null);
  const socketClient = SocketClient({roomId: params.raidname, username: tokenRef?.current?.user?.name, onInitSync: onInitSync, onChat: onChat, onData: onData});
  const compensationRef = useRef();
  const [players, setPlayers] = useState([]);
  const [diedPlayers, setDiedPlayers] = useState([]);
  const [users, setUsers] = useState([]);
  const [boss, setBoss] = useState({});
  const [log, setLog] = useState([]);
  const [clickedSkill, setClickedSkill] = useState({});
  const [modalData, setModalData] = useState(null); // 유저 모달 사용 여부
  const modalRef = useRef();
  const bossEventRef = useRef(); // 보스 이벤트 표시 상태
  const tempDataRef = useRef(null);
  const [dataSocketState, setDataSocketState] = useState(false); // 소켓 데이터 수신 상태
  const [calcSocketState, setCalcSocketState] = useState(false); // 소켓 데이터 수신 상태
  const [specialEffect, setSpecialEffect] = useState(null); // 특수 이펙트 표시 상태
  const [bossSpecialEffect, setBossSpecialEffect] = useState(null); // 보스 특수 이펙트 표시 상태
  const [buttonLock, setButtonLock] = useState(false); // 소켓 데이터 수신 후 이벤트 진행 중 버튼 잠금 상태

  // 동기화에 사용될 값들
  const [syncData, setSyncData] = useState(false);
  const [lastClickedUser, setLastClickedUser] = useState(null);

  const fetchData = useCallback(async () => {
    let response = await fetch(`/api/page/raid?apitype=raid_data&raid_name=${params.raidname}`);
    const newData = await response.json();
    if (newData?.data?.users?.length) {
      setPlayers([]);
      raidTargetUsers.current = [];
      newData.data.users.forEach((user, index) => {
        raidTargetUsers.current.push(user.userid);
        let player = {};
        user.maxHP = user.user_hp;
        player.userid = user.userid;
        player.maxHP = user.user_hp;
        player.hp = user.user_hp;
        player.wis = user.user_wis;
        player.agi = user.user_agi;
        player.luk = user.user_luk;
        player.def = user.user_def;
        player.atk = user.user_atk;
        player.userSkill = user.userSkill;
        player.skip = 0;
        if (user?.skills) player.skillImages = [];
        if (user?.skills) player.effectImages = [];
        user.userSkill.forEach((skill) => {
          player.skillImages.push(skill?.skill_img_0 || null);
          player.effectImages.push(skill?.skill_img_1 || null);
        });
        player.order = index;
        player.active = index === 0;
        setPlayers((prevOrder) => [...prevOrder, player]);
      });
      setUsers(newData.data.users);
      devLog("유저데이터 가져오기 완료 ::::", newData.data.users, raidTargetUsers);
    }
    if (newData?.data?.boss) {
      devLog("보스데이터 가져오기 완료 ::::", newData.data.boss);
      // let boss = newData.data.boss;
      let player = newData.data.boss;
      // player변수에도 넣고 boss변수에도 넣어야함
      player.userid = "boss";
      player.maxHP = player.monster_hp;
      player.hp = player.monster_hp;
      player.wis = player.monster_wis;
      player.agi = player.monster_agi;
      player.luk = player.monster_luk;
      player.def = player.monster_def;
      player.atk = player.monster_atk;
      player.skip = 0;
      player.order = newData.data.users.length; //players.length;
      player.active = false;
      setBoss(player);
      setBossHp(newData.data.boss.monster_hp);
      setPlayers((prevOrder) => [...prevOrder, player]);
    }
  }, []);

  /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 소켓 수신 이벤트 처리 함수 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  function onChat(data) {
    // devLog("채팅 수신:", data, socketClient.responseRef);
    let chat = data.chat;
    socketDataRef.current.type = "chat";
    socketDataRef.current.data = chat;
    if (chat?.chat.startsWith("System :")) {
      // setLog((prevLog) => [...prevLog, {log: `송신자 : ${chat?.username} ${chat?.chat}`, time: new Date().toLocaleTimeString()}]);
      setLog((prevLog) => [...prevLog, {log: `${chat?.chat}`, level: "system", time: new Date().toLocaleTimeString()}]);
    } else {
      setLog((prevLog) => [...prevLog, {log: `${chat?.username} : ${chat?.chat}`, time: new Date().toLocaleTimeString()}]);
    }
    // setChatSocketState(true);
  }

  function onData(data, type = "data") {
    // devLog("onData 데이터 수신:", data, socketDataRef);
    tempDataRef.current.type = type;
    tempDataRef.current.data = data;
    if (type === "calc") setCalcSocketState(true);
    else if (type === "data") setDataSocketState(true);
  }

  function onInitSync(data) {
    let initPlayers = data.data.players;
    let initDiedPlayers = data.data.diedPlayers;
    let initSync = data.data.sync;
    let initGameEnded = data.data.gameEnded;
    devLog("onInitSync 데이터 수신. 데이터 동기화를 시작합니다", data.data, initPlayers, initDiedPlayers, initSync);

    if (initPlayers) {
      setPlayers(initPlayers);
      setBoss(initPlayers[initPlayers.length - 1]);
      setBossHp(initPlayers[initPlayers.length - 1].hp);
    }
    if (initDiedPlayers) setDiedPlayers(initDiedPlayers);
    if (initSync) syncRef.current = initSync;
    setIsGameEnded(initGameEnded || false);
  }

  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
  const clickedIcon = (e, buttonUser) => {
    e.stopPropagation();
    if (buttonLock) return;
    setClickedSkill(null);
    setModalData(null);
    let clickUser = tokenRef?.current?.user?.name;
    if (!raidTargetUsers.current.includes(clickUser)) {
      alert("관전자는 클릭할 수 없습니다.");
      devLog("관전자는 클릭할 수 없습니다.", raidTargetUsers.current, raidTargetUsers.current.includes(clickUser), clickUser);
      return;
    }
    if (buttonUser !== clickUser) {
      socketClient.sendChat(`System : ${clickUser} 가 ${buttonUser}님의 버튼을 클릭했습니다. 주의해주세요`);
      return;
    }
    let currentPlayer = players.find((player) => player.active);
    if (currentPlayer.userid !== clickUser) {
      alert("아직 당신의 턴이 아닙니다.");
      socketClient.sendChat(`System : ${clickUser}의 턴이 아닙니다. 주의해주세요`);
      return;
    }
    // 클릭된 객체에 clicked-button 클래스 추가 및 다른 객체에서 제거
    document.querySelectorAll(".clicked-button").forEach((button) => button.classList.remove("clicked-button"));
    e.target.classList.add("clicked-button");

    let currentClickedSkill = {};
    let name = e.currentTarget.dataset.name;
    currentClickedSkill.name = name;
    // devLog("아이콘 클릭됨", e.target, e.currentTarget, name);
    // skill_range: ["자신", "아군전체", "아군(자신제외1체)", "아군전체(자신제외)", "적(1체)", "적전체", "전체"],
    let skill = users.find((user) => user.userid === buttonUser)?.skills?.find((skill) => skill.skill_name === name);
    if (!skill) {
      alert("스킬이 없습니다.");
      return;
    }
    if (skill.skill_range === "아군(자신제외1체)") {
      let targets = users.filter((user) => user.userid !== buttonUser);
      modalRef.current.openModal(targets);
    }
    setClickedSkill(name);
  };

  const clickedProcess = async (e, buttonUser) => {
    if (buttonLock) return;
    let user = tokenRef?.current?.user?.name;
    // devLog("진행하기 버튼 클릭됨", modalData);
    if (!user) {
      alert("잠시만 기다려주세요");
      return;
    }
    if (!raidTargetUsers.current.includes(user)) {
      alert("관전자는 클릭할 수 없습니다.");
      return;
    }
    if (buttonUser !== user) {
      socketClient.sendChat(`System : ${user} 가 ${buttonUser}님의 버튼을 클릭했습니다. 주의해주세요`);
      return;
    }
    if (e) e.stopPropagation();
    // devLog("진행하기 버튼 클릭됨", clickedSkill);
    if (!clickedSkill) return;
    let currentPlayer = players.find((player) => player.active);
    if (currentPlayer.userid !== user) {
      alert("아직 당신의 턴이 아닙니다.");
      socketClient.sendChat(`System : ${user}의 턴이 아닙니다. 주의해주세요`);
      return;
    }

    let transformData = {};
    let orderIndex = players.findIndex((item) => item.active === true);
    if (orderIndex >= 0) {
      // transformData.nextIndex = 0; //orderIndex + 1 >= order.length ? 0 : orderIndex + 1;
      transformData.clickedSkill = {name: clickedSkill, fixedTarget: modalData};
      transformData.clickUser = players[orderIndex].userid;

      let buttons = document.querySelectorAll(".clicked-button");
      buttons.forEach((button) => button.classList.remove("clicked-button"));

      socketClient.sendData(transformData);
    }
    setClickedSkill(null);
    setModalData(null);
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

  const handleEventChat = useCallback((text, user = null) => {
    if (user !== null && user === tokenRef?.current?.user?.name) {
      socketClient.sendChat(text);
      // devLog("*** 유저 체크 후 채팅 전송", user, tokenRef?.current?.user?.name, user === tokenRef?.current?.user?.name, text);
    }
    return;
  });
  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
  useEffect(() => {
    async function fetchEssentialData() {
      const response = await fetch("/api/select?apitype=raid&getcount=1");
      const newData = await response.json();

      if (newData?.data?.length) {
        let raid = newData.data.filter((item) => item.raid_name === params.raidname)[0];
        if (raid && raid?.items) {
          let randomIndex = makeRandomNumber(0, raid.items.length - 1);
          compensationRef.current = raid.items[randomIndex];
        } else {
          compensationRef.current = {item_name: "에코", item_img: "/images/04_member_box.webp"};
        }
        devLog("레이드 기본 데이터 가져오기 완료 ::::", raid, compensationRef);
      }
    }
    socketDataRef.current = {type: "", data: null};
    tempDataRef.current = {type: "", data: null};
    fetchData();
    fetchEssentialData();
  }, []);

  useEffect(() => {
    socketClient.joinRoom();
  }, [tokenRef?.current?.user?.name, socketClient.socketRef]);

  // useEffect(() => {
  //   devLog("받은 메세지 확인", socketClient.responseRef);
  // }, [chatSocketState.dataSocketState, calcSocketState]);

  // 죽은 플레이어가 늘어날 때마다 게임 종료 여부 체크 / 보스 체력이 0이하일 때 게임 종료 / 버튼이 활성화 될때 확인
  useEffect(() => {
    // devLog("게임 종료 여부 체크", players, diedPlayers, bossHp);
    if (buttonLock && tokenRef?.current?.user?.name) {
      // 적어도 로그인 데이터가 있을 때만 실행
      if (players.length && players.length - 1 === diedPlayers.length) {
        // 보스를 제외한 플레이어 수와 죽은 플레이어 수가 같을 때
        devLog("******* 게임 failed *******", players, diedPlayers);
        setIsGameEnded(true);
        setIsGameClear(false);
      }
      if (bossHp <= 0) {
        devLog("******* 게임 success *******");
        socketClient.clearData();
        socketClient.disconnect();
        setIsGameEnded(true);
        setIsGameClear(true);
      }
    }
  }, [players, diedPlayers, bossHp]);
  useEffect(() => {
    async function asyncEffect() {
      if (dataSocketState && tempDataRef.current.type === "data") {
        setDataSocketState(false);
        let data = tempDataRef.current.data;
        tempDataRef.current = {type: "", data: null};
        // devLog("changeState 데이터 수신:", dataSocketState, socketDataRef, data);
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 버튼에 의한 데이터 수신 및 계산 처리
        if (!buttonLock) {
          setButtonLock(true);
          // 속도에 의해 턴 스킵했는지 체크
          // 스킬 계산 및 적용
          let targetUser = players.find((user) => user.userid === data.clickUser);
          let targetSkill = targetUser ? targetUser.userSkill.find((skill) => skill?.skill_name === data.clickedSkill.name) : null;
          // devLog("====================================================================================데이터 수신:", targetUser, targetSkill);
          if (targetUser && targetSkill && tokenRef.current.user.name === data.clickUser) {
            // 클릭한 유저가 자신일 경우만 계산
            // setLog((prevLog) => [...prevLog, {log: `${targetUser.userid} : ${targetSkill.skill_name} 을 사용했습니다`, time: new Date().toLocaleTimeString()}]);
            // 적용할 대상 계산 ( 반환값 : target / Consumption / damage / turnModify
            let calc = battleCalculation(targetSkill, data.clickUser, players, diedPlayers);
            calc.clickedSkill = data.clickedSkill;
            calc.clickUser = data.clickUser;
            socketClient.sendCalc(calc);
          }
        }
      }
    }
    asyncEffect();
  }, [dataSocketState]);
  useEffect(() => {
    async function asyncEffect() {
      function syncSave(key, data, innerTarget = "Array") {
        if (!syncRef.current) syncRef.current = {};
        const fixedKey = ["skip", "defence", "keep", "forceTarget"];
        if (!fixedKey.includes(key)) return;
        if (innerTarget !== "Array") {
          if (syncRef.current?.[key]) {
            if (syncRef.current[key]?.[innerTarget]) syncRef.current[key][innerTarget] += data;
            else syncRef.current[key][innerTarget] = data;
          } else {
            syncRef.current[key] = {[innerTarget]: data};
          }
        } else {
          if (syncRef.current?.[key]) {
            syncRef.current[key].push(data);
          } else {
            // devLog("syncRef.current[key] : ", syncRef.current, key, data);
            syncRef.current[key] = [data];
          }
        }
      }

      function calculateNextIndex(currentUser) {
        let alivePlayers = players.filter((player) => player.hp > 0); // && player.userid !== "boss");
        let currentIndex = alivePlayers.findIndex((player) => player.userid === currentUser);
        let nextOrder = currentIndex + 1 >= alivePlayers.length ? alivePlayers[0].order : alivePlayers[currentIndex + 1].order;
        let nextIndex = players.findIndex((player) => player.order === nextOrder);
        // devLog("다음 턴 계산", currentUser, currentIndex, nextOrder, nextIndex, alivePlayers.length, alivePlayers);

        return nextIndex >= 0 ? nextIndex : null;
      }

      async function battleTypeApply(type, calc, lastOrder = false) {
        // 갱신할 사용자 목록
        let calUsers = players;
        let effectDamage = calc.damage;
        // devLog("배틀타입 적용 : ", calc.clickUser, type, lastOrder);
        if (type === "공격" || type === "궁-공격") {
          if (!calc.isBossEvent && calc.clickUser === "boss" && syncRef.current?.forceTarget?.length) {
            // 공격자가 boss일때 고정타겟이 있을경우 해당 인원만 지정. 보스 체력 이벤트는 해당안됨
            let targetUserId = syncRef.current.forceTarget.shift();
            if (lastOrder) {
              // 마지막 작업이 현재 추가된 작업
              handleEventChat(`System : 도발한 유저 ${targetUserId} 가 존재합니다. 보스는 해당 대상에게만 공격합니다`, calc?.lastedUser || calc.clickUser);
            }
            calc.target = [targetUserId];
          }
          // devLog("공격 시작 : ", calc, "대상 : ", calc.target, "대상숫자", calc.target.length, "데미지 : ", calc.damage);
          if (calc.target) {
            let targetLength = calc.target.length;
            let chatIndex = 0;
            for (let i = 0; i < targetLength; i++) {
              let target = calc.target[i];
              if (target === "boss") {
                // ( 방어가 있을경우 데미지 감소 후 적용 - 사용된 방어는 제거 )
                if (syncRef.current?.defence?.boss) {
                  let defence = syncRef.current.defence.boss;
                  calc.damage = calc.damage - defence > 0 ? calc.damage - defence : 0; // 방어가 데미지보다 클경우 0으로 설정
                  delete syncRef.current.defence.boss;
                }
                let bossEvent = boss.event?.[0];
                let bossHP = Math.round(bossHp - calc.damage);
                let bossTemp = boss;
                if (bossEvent && Number.isFinite(Number(bossEvent.monster_event_rate))) {
                  let bossEventRate = parseFloat(bossEvent.monster_event_rate);
                  let bossLimit = Math.round(boss.maxHP * (bossEventRate / 100));
                  // devLog("보스 이벤트 체크 : ", bossEvent, bossEventRate, bossLimit, boss.maxHP, bossHP, bossLimit > bossHP);
                  if (bossLimit > bossHP) {
                    // devLog("보스 이벤트가 적용되었습니다 : ", bossEvent);
                    bossTemp.hp = bossLimit;
                    bossHP = bossLimit;
                    bossEventRef.current = bossEvent;
                    boss.event.shift();
                  } else bossTemp.hp = bossHP;
                }
                effectDamage = calc.damage;

                // devLog("보스 데미지 적용 : ", bossHP, "입힌 데미지 : ", calc.damage, "남은 HP : ", bossTemp.hp);
                if (lastOrder && chatIndex === 0) {
                  // 마지막 작업이 현재 추가된 작업
                  handleEventChat(`System : ${calc.clickUser} 가 boss에게 ${Math.floor(calc.damage)} 데미지를 입혔습니다.`, calc?.lastedUser || calc.clickUser);
                }
                setBossHp(bossHP);
                setBoss(bossTemp);
                calUsers[calUsers.length - 1] = bossTemp;
              } else {
                // 일반 유저에 대한 공격 ( 방어가 있을경우 데미지 감소 후 적용 - 사용된 방어는 제거 )
                let targetIndex = calUsers.findIndex((user) => user.userid === target);
                let targetUserId = calUsers[targetIndex].userid;
                if (syncRef.current?.defence?.[targetUserId]) {
                  let defence = syncRef.current.defence[targetUserId];
                  calc.damage = calc.damage - defence > 0 ? calc.damage - defence : 0; // 방어가 데미지보다 클경우 0으로 설정
                  delete syncRef.current.defence[targetUserId];
                  handleEventChat(`System : ${targetUserId} 에 걸려있는 방어 ${defence} 로 ${Math.floor(calc.damage)} 데미지를 방어하였습니다`, calc?.lastedUser || calc.clickUser);
                }

                calUsers[targetIndex].hp -= calc.damage;
                effectDamage = calc.damage;
                if (lastOrder && chatIndex === 0) {
                  // 마지막 작업이 현재 추가된 작업
                  // devLog("유저 데미지 적용 : ", calUsers[targetIndex].userid, calUsers[targetIndex].hp, "입힌 데미지 : ", calc.damage, calc?.lastedUser || calc.clickUser);
                  handleEventChat(`System : boss 가 ${JSON.stringify(calc.target)}에게 ${Math.floor(calc.damage)} 데미지를 입혔습니다.`, calc?.lastedUser || calc.clickUser);
                }
              }
              chatIndex += 1;
            }
          }
        }
        // 대상에게 회복 적용
        else if (type === "회복" || type === "궁-회복") {
          devLog("회복 시작 : ", calc.target, calc.damage);
          calc.target?.forEach((target) => {
            let targetIndex = calUsers.findIndex((user) => user.userid === target);
            calUsers[targetIndex].hp += calc.damage;
          });
        }
        // 대상에게 부활 적용
        else if (type === "부활" || type === "궁-부활") {
          let resurrections = [];
          calc.target?.forEach((target) => {
            let diedPlayer = diedPlayers.find((user) => user === target);
            calUsers.forEach((user) => {
              if (user.userid === diedPlayer) {
                user.hp = user.maxHP;
                resurrections.push(user.userid);
                return;
              }
            });
            setDiedPlayers((prev) => prev.filter((user) => user !== target));
          });
          handleEventChat(`System : ${JSON.stringify(resurrections)} 부활하였습니다.`, calc?.lastedUser || calc.clickUser);
        }
        // 대상에게 속도 적용
        else if (type === "속도" || type === "궁-속도") {
          calc.target?.forEach((target) => {
            let targetIndex = calUsers.findIndex((user) => user.userid === target);
            syncSave("skip", calc.turnModify, calUsers[targetIndex].userid);
            handleEventChat(`System : ${calUsers[targetIndex].userid} 는 ${calc.turnModify} 만큼 휴식합니다`, calc?.lastedUser || calc.clickUser);
          });
        }
        // 대상에게 방어 적용
        else if (type === "방어" || type === "궁-방어") {
          calc.target?.forEach((target) => {
            let targetIndex = calUsers.findIndex((user) => user.userid === target);
            syncSave("defence", calc.damage, calUsers[targetIndex].userid);
          });
          handleEventChat(`System : ${JSON.stringify(calc.target)}에게 ${calc.damage} 방어를 입혔습니다.`, calc?.lastedUser || calc.clickUser);
        }
        // 대상에게 도발 적용
        else if (type === "도발" || type === "궁-도발") {
          syncSave("forceTarget", calc?.lastedUser || calc.clickUser);
          handleEventChat(`System : 보스가 ${JSON.stringify(calc?.lastedUser || calc.clickUser)}에게 도발당했습니다.`, calc?.lastedUser || calc.clickUser);
        }
        // 대상에게 조정 적용
        else if (type === "조정" || type === "궁-조정") {
          calc.target?.forEach((target) => {
            let targetIndex = calUsers.findIndex((user) => user.userid === target);
            // devLog("조정 : ", calUsers[targetIndex], calc.controlType, calUsers[targetIndex]?.[calc.controlType], calc.damage);
            if (calUsers[targetIndex]?.[calc.controlType]) {
              let temp = calUsers[targetIndex]?.[calc.controlType] || 0;
              temp += calc.damage;
              calUsers[targetIndex][calc.controlType] = temp;
              handleEventChat(`System : ${calUsers[targetIndex].userid}의 ${calc.controlType}이 ${calc.damage} 만큼 변경되어 ${temp} 가 되었습니다`, calc?.lastedUser || calc.clickUser);
            }
            // devLog("<============ 조정 : ", calUsers[targetIndex], calc.controlType, calUsers[targetIndex]?.[calc.controlType]);
          });
        }

        if (type && type?.startsWith("궁-")) {
          if (calc.clickUser === "boss") {
            // devLog("보스 스페셜 이벤트 시작", calc);
            setBossSpecialEffect({image: calc?.bossSpecialEffect || "/images/ultimate.webp", text: calc?.bossSpecialEffectText || "궁극기 발동"});
          } else {
            let clickUser = calUsers.find((user) => user.userid === calc.clickUser);
            setSpecialEffect(clickUser.user_img_4 || "/images/ultimate.webp");
          }
          await sleep(4000);
        }

        // 대상들에게 이펙트 부여
        calUsers.forEach((player, index) => {
          if (calc.target?.includes(player.userid)) {
            if (type === "공격" || type === "궁-공격") {
              player.damage = Math.floor(effectDamage);
            }
            player.effect = calc.effectImg;
            if (player.userid === "boss") {
              setBoss(player);
            }
            // devLog("=================================================================================== 이펙트 대상자", player, calc);
          }
        });

        setPlayers(calUsers);
      }

      if (calcSocketState && tempDataRef.current.type === "calc") {
        setCalcSocketState(false);
        let calc = tempDataRef.current.data;
        tempDataRef.current = {type: "", data: null};
        let targetSkill = null;
        let targetUser = null;
        // devLog("====================================================================================계산결과:", calc, players, calc.clickUser !== "boss", calc.clickUser !== "bossEvent");
        if (calc.clickUser !== "boss") {
          targetUser = players.find((user) => user.userid === calc.clickUser);
          targetSkill = targetUser ? targetUser.userSkill.find((skill) => skill?.skill_name === calc.clickedSkill.name) : null;
        } else {
          targetUser = boss;
        }
        targetSkill = calc?.targetSkill || targetSkill; // 전달된 스킬정보가 있을경우 해당 정보로 대체
        calc.durationTurn = targetSkill?.skill_duration_turn || 0;
        calc.startTurn = targetSkill?.skill_start_turn || 0;
        if (!calc?.effectImg) calc.effectImg = targetSkill?.skill_img_1 || "/images/raid/Slash.webp"; // 특별히 이미지가 없을때
        if (!calc?.targetSkill) calc.targetSkill = targetSkill;

        // 사용한 스킬에 대한 정보
        // handleEventChat(`System : ${calc.clickUser} 가 ${targetSkill.skill_type}의 ${targetSkill.skill_name} 스킬을 사용했습니다. 시작 턴 : ${calc.startTurn || 0}, 지속 턴 : ${calc.durationTurn || 0}`, calc.clickUser);
        // devLog("사용한 스킬 : ", calc.clickUser, calc.targetSkill);

        // 고정대상이 있으면 고정대상에게만 적용
        if (calc?.clickedSkill?.fixedTarget) {
          calc.target = [calc.clickedSkill.fixedTarget];
        }
        // 소모량 계산
        if (calc.Consumption?.type) {
          // devLog("소모량 계산 : ", targetUser, calc.Consumption);
          calc.Consumption.type = calc.Consumption.type.toLowerCase();
          targetUser[calc.Consumption.type] += Math.round(calc.Consumption.value);
          if (calc.clickUser === "boss") {
            setBoss(targetUser);
            setBossHp(targetUser.hp);
            setPlayers((prev) => {
              return prev.map((player) => {
                if (player.userid === "boss") return targetUser;
                else return {...player};
              });
            });
          }
        }
        // 스킬 리스트 keep에 저장 ( 설령 지속 스킬이 아니더라도 keep에 저장 )
        calc.startTurn += 1; // 최초 시작턴 1 감소 고려
        syncSave("keep", calc);

        // 리스트 keep 스킬들 계산 (계산 대상이 보스일 경우는 기존 지속 스킬 계산 x)
        if (calc.clickUser === "boss") {
          let item = syncRef.current.keep.pop();
          if (item) {
            item.startTurn = item.startTurn > 0 ? item.startTurn - 1 : 0;
            handleEventChat(`System : ${calc.clickUser} 가 ${targetSkill.skill_type}의 ${targetSkill.skill_name} 스킬을 사용했습니다. 시작 턴 : ${item.startTurn || 0}, 지속 턴 : ${item.durationTurn || 0}`, item.clickUser);
            if (item.startTurn <= 0 && item.durationTurn >= 0) {
              let targetSkill = item.targetSkill;
              let type = targetSkill.skill_type;
              // 데미지 적용
              item.durationTurn = item.durationTurn > 0 ? item.durationTurn - 1 : 0;
              await battleTypeApply(type, item, true);
              await sleep(2000);
              // devLog("keep 스킬 적용 : ", calc.clickUser, item.clickUser, item, targetSkill);
              // 이펙트 즉시 초기화
              setPlayers((prev) => {
                return prev.map((player) => {
                  return {...player, effect: null, damage: null};
                });
              });
              setBoss((prev) => ({...prev, effect: null, damage: null}));
            }
          }
        } else if (syncRef.current?.keep) {
          let keepLength = syncRef.current.keep.length;
          for (let i = 0; i < keepLength; i++) {
            let item = syncRef.current.keep[i];
            devLog(`keep 스킬 계산 ${i} 번째 : `, item, syncRef.current.keep[i], syncRef.current.keep);
            if (item) {
              item.startTurn = item.startTurn > 0 ? item.startTurn - 1 : 0;
              handleEventChat(`System : ${item.clickUser} 가 ${item.targetSkill.skill_type}의 ${item.targetSkill.skill_name} 스킬을 사용했습니다. 시작 턴 : ${item.startTurn || 0}, 지속 턴 : ${item.durationTurn || 0}`, item.clickUser);
              if (item.startTurn <= 0 && item.durationTurn >= 0) {
                let targetSkill = item.targetSkill;
                let type = targetSkill.skill_type;
                // 데미지 적용
                item.durationTurn = item.durationTurn > 0 ? item.durationTurn - 1 : 0;
                await battleTypeApply(type, item, true);
                await sleep(2000);
                // devLog("keep 스킬 적용 : ", calc.clickUser, item.clickUser, item, targetSkill);
                // 이펙트 즉시 초기화
                setPlayers((prev) => {
                  return prev.map((player) => {
                    return {...player, effect: null, damage: null};
                  });
                });
                setBoss((prev) => ({...prev, effect: null, damage: null}));
                await sleep(1000);
              }
            }
            item = null;
          }
          // startTurn과 durationTurn이 모두 0이 되면 삭제
          syncRef.current.keep = syncRef.current.keep.filter((item) => item.durationTurn > 0 || item.startTurn > 0);
        }
        // skip이 전부 0이면 삭제
        if (syncRef.current?.skip) {
          for (let key in syncRef.current.skip) {
            if (syncRef.current.skip[key] <= 0) delete syncRef.current.skip[key];
          }
        }

        // 죽은자가 있는 경우 처리 및 hp 소수점일경우 반올림처리
        players.forEach((player) => {
          if (player.hp <= 0 && !diedPlayers.includes(player.userid)) {
            devLog("죽은자 발생 : ", player.hp, player.userid);
            handleEventChat(`System : ${player.userid} 가 사망하셨습니다. x를 눌러 조의를 표하세요.`, calc?.lastedUser || calc.clickUser);
            setDiedPlayers((prev) => [...prev, player.userid]);
          }
        });

        // 다음 작업자를 계산 (죽은자를 제외하기)
        let errorBlockCnt = 0;
        let nextIndex = calc.nextIndex || null; // nextIndex가 있는 경우는 보스 이벤트로 인한 진행
        if (nextIndex === null) {
          // devLog("다음 턴 계산 시작", syncRef.current?.skip);
          while (errorBlockCnt < 12) {
            // 플레이어 최대 수 * 2 이상 반복하면 이상한거임
            if (nextIndex != null) break;
            nextIndex = calculateNextIndex(calc.clickUser);
            let nextPlayerId = players[nextIndex].userid;
            // devLog("다음 턴 계산 중 : ", nextPlayerId, syncRef.current?.skip?.[nextPlayerId]);
            if (syncRef.current?.skip?.[nextPlayerId]) {
              syncRef.current.skip[nextPlayerId] -= 1; // 스킵이 있을경우 -1 해주고 반복
              calc.clickUser = nextPlayerId;
              nextIndex = null;
            }
            errorBlockCnt += 1;
          }
        }

        // 보스에 대한 이벤트 진행 (체력 이벤트 & 턴 이벤트)
        // devLog("보스 이벤트 상태 : ", bossEventRef.current, " 다음 대상자 : ", players[nextIndex]?.userid, " 이전 대상자 : ", calc?.lastedUser);
        if (bossEventRef.current) {
          // 보스 체력 기준에 따른 특별 이벤트 진행
          let bossEvent = bossEventRef.current;
          bossEventRef.current = null;
          if (tokenRef.current.user.name === calc.clickUser || tokenRef.current.user.name === calc?.lastedUser) {
            let tempCalc = battleCalculation(bossEvent.skill, "boss", players, diedPlayers);
            tempCalc.nextIndex = nextIndex;
            tempCalc.targetSkill = bossEvent.skill;
            tempCalc.lastedUser = calc?.lastedUser || calc.clickUser;
            tempCalc.clickUser = "boss";
            tempCalc.isBossEvent = true;
            tempCalc.bossSpecialEffect = bossEvent.monster_event_img;
            tempCalc.bossSpecialEffectText = bossEvent.monster_event_msg;
            handleEventChat(`System : ${tempCalc.clickUser} 가 체력 ${bossEvent.monster_event_rate}% 에 매칭되는 특수 이벤트 ${tempCalc.targetSkill.skill_name} 스킬을 사용했습니다.`, tempCalc.lastedUser);
            await sleep(1000);
            socketClient.sendCalc(tempCalc);
          }
          return;
          // devLog("보스 이벤트 진행 : ", bossEvent, calc);
        }
        if (!bossEventRef.current && players[nextIndex]?.userid === "boss") {
          // 보스 작업자 활성화
          setPlayers((prevOrder) => {
            return prevOrder.map((item, index) => ({
              ...item,
              active: index === nextIndex,
            }));
          });
          if (tokenRef.current.user.name === calc?.clickUser || tokenRef.current.user.name === calc?.lastedUser) {
            // 보스 공격 랜덤계산
            let tempLength = boss.rateArr.length;
            let randomIndex = makeRandomNumber(0, tempLength - 1);
            let bossSkill = boss.skills[boss.rateArr[randomIndex]];
            let tempCalc = battleCalculation(bossSkill, "boss", players, diedPlayers);
            tempCalc.clickedSkill = null;
            tempCalc.clickUser = "boss";
            tempCalc.lastedUser = calc?.lastedUser || calc.clickUser;
            tempCalc.targetSkill = bossSkill;
            handleEventChat(`System : ${tempCalc.clickUser} 가 ${tempCalc.targetSkill.skill_type}의 ${tempCalc.targetSkill.skill_name} 스킬을 사용했습니다.`, tempCalc.lastedUser);
            await sleep(2000);
            socketClient.sendCalc(tempCalc);
          } else await sleep(2000);
          return;
        }

        // 다음 작업자 활성화
        setPlayers((prevOrder) => {
          return prevOrder.map((item, index) => ({
            ...item,
            active: index === nextIndex,
          }));
        });
        setButtonLock(false);
        // 계산이 완료되면 혹시나 모를 동기화를 위해 데이터 서버 임시 저장. (마지막 작업자만 보내기)
        setSyncData(true);
        setLastClickedUser(calc?.lastedUser || calc.clickUser);
        devLog("<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 계산 완료 : ", calc?.lastedUser || calc.clickUser, (calc?.lastedUser || calc.clickUser) === tokenRef.current.user.name);
      }
    }
    asyncEffect();
  }, [calcSocketState]);

  useEffect(() => {
    if (syncData && lastClickedUser === tokenRef.current.user.name) {
      devLog("동기화 데이터 저장 - 저장할 유저 :", lastClickedUser);
      setSyncData(false);
      setLastClickedUser(null);
      let savePlayers = players;
      let saveDiedPlayers = diedPlayers;
      let saveSync = syncRef.current;
      socketClient.saveData({user: tokenRef.current.user.name, players: savePlayers, diedPlayers: saveDiedPlayers, sync: saveSync, gameEnded: isGameEnded});
    }
  }, [syncData, lastClickedUser]);

  return isGameEnded ? (
    <Ended isClear={isGameClear} raid={params.raidname} user={tokenRef.current.user.name} item={compensationRef.current?.item_name} image={compensationRef.current?.item_img_0 || "/images/04_member_box.webp"} />
  ) : (
    <>
      {/* <button className="fixed text-[40px] top-0" onClick={() => {setIsGameEnded(true); setIsGameClear(false);}}>게임 실패</button>
      <button className="fixed text-[40px] top-0 left-[40px]" onClick={() => { setIsGameEnded(true); setIsGameClear(true);}}>게임 성공</button>
      
      {/* <input type="number" max={parseInt(boss?.monster_hp) || 100} onChange={(e) => setHpCurrent(e.target.value > parseInt(boss?.monster_hp) ? parseInt(boss.monster_hp) : e.target.value)} className="fixed text-[40px] top-0 right-[40px]" /> */}
      <div className="absolute flex flex-col items-center" style={{width: "760px", height: "600px", top: "-30px"}}>
        {players?.[players.length - 1]?.active && <Image src={NextIndicator} alt="next-indicator" width={64} height={64} className="absolute top-[-50px] rotate-90" />}
        <div className="relative block text-white text-[24px]">{boss?.monster_name || "보스 이름"}</div>
        <div className="relative flex w-full h-full mt-1">
          <div className="absolute right-0 top-[-20px]">
            {boss?.monster_hp} / {bossHp}
          </div>
          <HPBar maxHP={boss?.monster_hp} currentHP={bossHp} />
        </div>
        <div className="relative flex" style={{width: "760px", height: "535px"}}>
          <img src={boss?.monster_img_0 ? getImageUrl(boss.monster_img_0) : getImageUrl(bossImage)} alt="raid-bg" className={`w-full h-full transition-all duration-200 ${boss?.effect ? "filter brightness-0 invert" : ""}`} />
          {boss?.effect && (
            <SpriteAnimation spriteImage={getImageUrl(boss?.effect)} floatingNumber={-boss?.damage} floatingNumberSize={80} frameWidth={500} frameHeight={500} cols={5} rows={1} playCount={1} css="left-[70px] bottom-[10px]" />
          )}
        </div>
      </div>
      <div className="relative flex w-full h-full">
        {users.map((user, index) => (
          <div
            key={index}
            className={`absolute w-[245px] h-[125px] bg-cover bg-center rounded-lg transition-all duration-100 ` + MemberPosCss[index] + `${players?.[index]?.damage ? " filter brightness-50 invert" : ""}`}
            style={{backgroundImage: `url(${getImageUrl(user.user_img_3)})`}}
          >
            {/* 진행하기 버튼 */}
            <button onClick={(e) => clickedProcess(e, user.userid)} className="absolute w-[80px] h-[25px]" style={{top: "10px", right: "12px"}}>
              <Image src={RaidProcessButton} alt="raid-process-button" width={80} height={25} />
            </button>
            {/* HP 텍스트 */}
            <div className="absolute text-white" style={{top: "40px", right: "15px"}}>
              HP
            </div>
            {/* 잔여 HP */}
            <div className="absolute text-white" style={{top: "55px", right: "15px"}}>
              {players?.[index]?.hp}/{user.maxHP}
            </div>
            {/* 아이콘들 */}
            {/* prettier-ignore */}
            <div className="absolute bottom-2 left-2 flex space-x-3">
              {user.userSkill.map((icon, index) => icon && (
                <button key={index} onClick={(e)=>{ e.stopPropagation(); clickedIcon(e, user.userid); }} data-name={icon.skill_name} className={`relative flex justify-center items-center img-raid-icon-frame`}>
                  <img src={getImageUrl(icon.skill_img_0)} alt={`icon-${index}`} className={`max-w-[30px] max-h-[30px]`} width={30} height={30} />
                </button>
              ))}
            </div>
            {(players?.[index]?.effect || false) && (
              <SpriteAnimation spriteImage={getImageUrl(players?.[index]?.effect)} floatingNumber={-players?.[index]?.damage} frameWidth={100} frameHeight={100} cols={5} rows={1} playCount={1} css="left-[70px] bottom-[10px]" />
            )}
            {(players?.[index]?.active || false) && <Image src={NextIndicator} alt="next-indicator" width={128} height={128} className="absolute bottom-[2px] left-[-150px]" />}
            <div className={`relative w-full h-full bg-black opacity-50 ${diedPlayers.find((item) => item === user.userid) ? "z-30" : "invisible"}`}></div>
          </div>
        ))}
      </div>
      {specialEffect && <ImageOverlay image={specialEffect} onClose={() => setSpecialEffect(null)} />}
      {bossSpecialEffect && <ImageOverlay image={bossSpecialEffect.image} text={bossSpecialEffect.text} onClose={() => setBossSpecialEffect(null)} />}
      <div className="absolute flex flex-col items-center" style={{width: "1000px", height: "300px", bottom: "-300px"}}>
        {log && <LogViewer height="126px" logs={log} css={"w-full rounded-lg mt-2"} opacity={0.8} />}
        <input onKeyDown={handleKeyDown} type="text" className="w-full px-2" />
      </div>
      <UserModal ref={modalRef} users={modalData} onButtonClick={(data) => setModalData(data)} />
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

function Ended({isClear = true, raid = "", user = "", image = "", item = ""}) {
  const endRef = useRef(0);

  useEffect(() => {
    devLog("레이드 클리어 데이터 저장 시작 : ", isClear, endRef.current);
    if (isClear && endRef.current === 0) {
      const formData = new FormData();
      formData.append("apitype", "raid_clear");
      formData.append("raidname", raid);
      formData.append("userid", user);
      formData.append("itemname", item);

      try {
        fetch("/api/page/raid", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            devLog("레이드 클리어 데이터 저장 결과 : ", data);
          })
          .catch((error) => console.error("Error:", error));
      } catch (e) {
        console.error(`관리자에게 문의하세요. raid clear error : `, e.message);
      }
    }
    endRef.current += 1;
    const handleBack = () => {
      history.pushState(null, "", window.location.href);
    };
    const handleBeforeUnload = (event) => {
      window.location.href = "/";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBack);
    history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handleBack);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
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
      <button
        className="relative text-[24px] text-white"
        style={{top: "-445px", right: "-260px"}}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        홈으로 돌아가기▶
      </button>
    </div>
  );
}

function makeRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function battleCalculation(skill, my, players, diedPlayers) {
  devLog("battleCalculation", skill);
  let range = skill.skill_range;
  let operator = skill.operator;
  let myData = my === "boss" ? players[players.length - 1] : players.find((user) => user.userid === my);

  let returnData = {};
  let targetName = [];
  let Consumption = {};
  let controlType = "";
  let damage = 0;
  let prevOperator = null;
  let turnModify = 0;
  // skill_type: ["공격", "방어", "속도", "도발", "회복", "부활", "조정", "궁-공격", "궁-방어", "궁-속도", "궁-도발", "궁-회복", "궁-부활", "궁-조정"],
  // skill_range: ["자신", "아군전체", "아군(자신제외1체)", "아군전체(자신제외)", "적(1체)", "적전체", "전체"],
  // skill_operator_option: ["본인소모", "HPx", "ATKx", "DEFx", "WISx", "AGIx", "LUKx", "랜덤값", "랜덤값+랜덤보정값", "더하기", "곱하기", "사이곱", "사이더하기", "턴조정"],
  /******************************************** 범위 계산 */
  if (range === "자신") {
    targetName.push(my);
  } else if (range === "아군전체") {
    targetName = players.filter((item) => item.userid !== "boss").map((item) => item.userid);
  } else if (range === "아군(자신제외1체)") {
    // ["boss", my] 를 제외한 USER만 필터링
    let temp = players.filter((item) => !["boss", my].includes(item.userid)).map((item) => item.userid);
    // 랜덤한 정수 ( temp 배열 길이 이내 ) 생성 ( 최소값 1 )
    let random = makeRandomNumber(0, temp.length - 1);
    targetName.push(temp[random]);
  } else if (range === "아군전체(자신제외)") {
    targetName = players.filter((item) => !["boss", my].includes(item.userid)).map((item) => item.userid);
  } else if (range === "적(1체)") {
    if (my === "boss") {
      let temp = players.filter((item) => item.userid !== "boss").map((item) => item.userid);
      let random = makeRandomNumber(0, temp.length - 1);
      targetName.push(temp[random]);
    } else targetName.push("boss");
  } else if (range === "적전체") {
    if (my === "boss") targetName = players.filter((item) => item.userid !== "boss").map((item) => item.userid);
    else targetName.push("boss");
  } else if (range === "전체") {
    targetName = players.map((item) => item.userid);
  }
  // 죽은자는 타겟에서 제외
  targetName = targetName.filter((item) => !diedPlayers.includes(item));
  /******************************************** 소모량 및 데미지 계산 */
  operator.forEach((op) => {
    let type = op.skill_operator_type;
    let value = parseFloat(op.skill_operator_value);
    let etc = op.skill_operator_etc;
    // let damage = 0;
    // 사이값 연산 후 초기화
    if (prevOperator) {
      if (prevOperator === "*") {
        damage *= value;
      } else if (prevOperator === "+") {
        damage += value;
      }
      prevOperator = null;
    } else {
      if (type === "본인소모") {
        if (["HP", "LUK"].includes(etc)) {
          Consumption.value = -value;
          Consumption.type = etc;
        }
      } else if (type === "HPx") {
        damage += myData.hp * value;
      } else if (type === "ATKx") {
        damage += myData.atk * value;
      } else if (type === "DEFx") {
        damage += myData.def * value;
      } else if (type === "WISx") {
        damage += myData.wis * value;
      } else if (type === "AGIx") {
        damage += myData.agi * value;
      } else if (type === "LUKx") {
        damage += myData.luk * value;
      } else if (type === "랜덤값") {
        let random = makeRandomNumber(-value, value + 1);
        damage += random;
      } else if (type === "랜덤값+랜덤보정값") {
        let random = makeRandomNumber(-value, value + 1);
        let Adjustment = parseFloat(etc) || 0;
        damage += random + Adjustment;
      } else if (type === "더하기") {
        damage += value;
      } else if (type === "곱하기") {
        damage = damage * value;
      } else if (type === "사이곱") {
        prevOperator = "*";
      } else if (type === "사이더하기") {
        prevOperator = "+";
      } else if (type === "턴조정") {
        // 턴 조정
        turnModify = value;
      }
    }

    if (etc) controlType = etc;
  });

  returnData.target = targetName;
  returnData.Consumption = Consumption;
  returnData.damage = damage;
  returnData.turnModify = turnModify;
  returnData.controlType = controlType.toLowerCase();
  return returnData;
}
