"use client";
import {useState, useCallback, useEffect, useRef} from "react";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정
import {devLog} from "/_custom/scripts/common";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import Link from "next/link";
import Image from "next/image";
import GridInputSelectBox from "/_custom/components/_common/grid/GridInputSelectBox";
import ImageMakeButton from "@/public/images/raid/05_raid_button1.png";
import NotificationModal from "@/_custom/components/NotificationModal";

const menuName = "lobby";
export default function Home() {
  let fetchIndex = 0;
  const {tokenRef} = useAuth() || {}; // handleLogin 가져오기
  const [user, setUser] = useState(tokenRef.current?.user?.name);
  const [noti, setNoti] = useState(null);
  const [mainData, setMainData] = useState([]);
  const [raids, setRaids] = useState([]);
  // const [clickedRaid, setClickedRaid] = useState(null);
  const [raidTeamMember, setRaidTeamMember] = useState([]);
  const clickedRaidRef = useRef(null);
  const setClickedRaid = (value) => (clickedRaidRef.current = value);

  // ++++++++++++++++++++++++++++  버튼 클릭 이벤트  ++++++++++++++++++++++++++++
  const createRaid = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("apitype", "create_raid");
    formData.append("userid", tokenRef.current?.user?.name);
    formData.append("raid_name", document.querySelector("#raid-namelist").value);
    formData.append("raid_headcount", document.querySelector("#raid-headcount").value);

    fetch("/api/page/raid", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setNoti("레이드 방 : " + data?.message);
      })
      .catch((error) => {
        setNoti("레이드 방 생성 실패했습니다. 관리자에게 문의하세요.");
      });
  };

  const clickRaid = (e) => {
    e.preventDefault();
    const targetRaid = e.target.parentElement.querySelector(".raid-title")?.innerText;
    const raid = mainData.find((raid) => raid.raid_name === targetRaid);
    devLog("clickRaid", raid, targetRaid);
    if (raid) {
      setClickedRaid(raid);
      if (raid?.userlist?.length) setRaidTeamMember(raid.userlist.map((user, index) => ({id: index, name: user.raid_user, raid_order: user.raid_order})));
    }
  };

  const modifyRaid = (e) => {
    e.preventDefault();
    if (clickedRaidRef.current.raid_reader !== user || !user) return;

    const elements = document.querySelectorAll(".raid-team-member");
    let raidOrders = [];
    elements.forEach((element) => {
      const name = element.querySelector("div").innerText;
      const order = element.querySelector("input").value;
      raidOrders.push({raid_user: name, raid_order: order});
    });
    const formData = new FormData();
    formData.append("apitype", "modify_raid");
    formData.append("userid", user);
    formData.append("raid_name", clickedRaidRef.current.raid_name);
    formData.append("raid_orders", JSON.stringify(raidOrders));

    fetch("/api/page/raid", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setNoti("레이드 방 수정 : " + data?.message);
      })
      .catch((error) => {
        setNoti("레이드 방 수정 실패했습니다. 관리자에게 문의하세요.");
      });
  };

  const handleJoin = (e) => {
    e.stopPropagation();
    const targetRaid = e.target.parentElement.parentElement.querySelector(".raid-title")?.innerText;
    if (!targetRaid || !user) {
      alert("에러가 발생했습니다. 잠시후 다시 시작하세요");
      return;
    }
    const formData = new FormData();
    formData.append("apitype", "join_raid");
    formData.append("userid", user);
    formData.append("raid_name", targetRaid);

    fetch("/api/page/raid", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setNoti("레이드 참가 : " + data?.message);
      })
      .catch((error) => {
        setNoti("레이드 참가 실패했습니다. 관리자에게 문의하세요.");
      });
  };
  const exitRaid = (e) => {
    e.preventDefault();
    if (!user) {
      alert("에러가 발생했습니다. 잠시후 다시 시작하세요");
      return;
    }
    const formData = new FormData();
    formData.append("apitype", "exit_raid");
    formData.append("userid", user);
    formData.append("raid_name", clickedRaidRef.current.raid_name);

    fetch("/api/page/raid", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (clickedRaidRef.current.raid_reader === user) setRaidTeamMember(null); // 방장이 나가면 클릭된 레이드 초기화
        setNoti("레이드 탈퇴 : " + data?.message);
      })
      .catch((error) => {
        setNoti("레이드 참가 실패했습니다. 관리자에게 문의하세요.");
      });
  };
  const handleSpectate = (e, raid_name) => {
    e.stopPropagation();
    const targetRaid = e.target.parentElement.parentElement.querySelector(".raid-title")?.innerText;
    if (!targetRaid || !user) {
      alert("에러가 발생했습니다. 잠시후 다시 시작하세요");
      return;
    }
    const raid = mainData.find((raid) => raid.raid_name === targetRaid);
    const isRaidUser = raid?.userlist.find((raid) => raid.raid_user === user);
    if (isRaidUser) {
      alert("이미 레이드에 참가한 유저입니다.");
      return;
    }

    if (raid?.userlist.length < raid.total_user) {
      alert("레이드 인원이 부족합니다.");
      return;
    }
    if (raid_name) window.location.href = "/battle/raid/" + raid_name;
  };
  const handleStart = (e) => {
    e.preventDefault();
    console.log("handleStart", clickedRaidRef.current, clickedRaidRef.current.userlist, user);
    if (!user) {
      alert("에러가 발생했습니다. 잠시후 다시 시작하세요");
      return;
    }
    if (clickedRaidRef.current.raid_reader !== user) {
      // alert("레이드 방장만 시작할 수 있습니다.");
      // return;
    }
    if (clickedRaidRef.current.userlist.length < clickedRaidRef.current.total_user) {
      alert("레이드 인원이 부족합니다.");
      return;
    }
    // battle/raid 페이지로 이동
    window.location.href = "/battle/raid/" + clickedRaidRef.current.raid_name;
  };
  // ++++++++++++++++++++++++++++  버튼 클릭 이벤트 완료  ++++++++++++++++++++++++++++
  const fetchData = useCallback(async () => {
    let response;
    if (fetchIndex++ == 0) response = await fetch(`/api/select?apitype=raid&getcount=1`);
    else response = await fetch(`/api/select?apitype=raid`);
    const newData = await response.json();
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다(${fetchIndex}): `, newData, clickedRaidRef.current);
      setMainData([...newData.data]);
      setRaids([]); // 중복을 방지하기 위해 초기화
      newData.data.forEach((raid) => {
        setRaids((prev) => [...prev, raid.raid_name]);
      });
      if (clickedRaidRef.current) {
        // 클릭된 레이드가 있을 경우 해당 레이드 정보 갱신
        const raid = newData.data.find((raid) => raid.raid_name === clickedRaidRef.current.raid_name);
        setClickedRaid(raid);
        devLog("fetchData clickedRaidRef", raid, clickedRaidRef.current);
        if (raid?.userlist?.length) setRaidTeamMember(raid.userlist.map((raid, index) => ({id: index, name: raid.raid_user, raid_order: raid.raid_order})));
        else {
          // 레이드가 삭제되었을 경우 초기화
          setRaidTeamMember([]);
          setClickedRaid(null);
        }
      }
    }
  }, [clickedRaidRef]);

  useEffect(() => {
    devLog(`admin *** ${menuName} *** page useEffect`, tokenRef);
    fetchData();
    const intervalId = setInterval(fetchData, 3 * 1000);
    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setUser(tokenRef.current?.user?.name);
  }, [tokenRef.current]);
  return (
    <>
      <div className="relative flex" style={{width: "900px", height: "350px", top: "-20px"}}>
        <div className="flex flex-col h-full" style={{width: "560px"}}>
          <div id="raid-teamlist" className="border border-[#806FAF]">
            {/* 헤더 영역 */}
            <div className="bg-[#806FAF] text-black text-center flex">
              <div className="flex-1 border-r border-gray-300 px-4 py-2">레이드명</div>
              <div className="flex-1 border-r border-gray-300 px-4 py-2">방장</div>
              <div className="flex-1 border-r border-gray-300 px-4 py-2">인원</div>
              <div className="flex-1 px-4 py-2">상태</div>
            </div>

            {/* 데이터 영역 (스크롤 가능) */}
            <div className="overflow-y-scroll max-h-[200px]" style={{height: "200px"}}>
              {mainData.map(
                (raid, index) =>
                  raid?.userlist && (
                    <div
                      key={`${raid.raid_name}-${index}`}
                      onClick={(e) => {
                        clickRaid(e);
                      }}
                      className={`flex text-white text-center ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}`}
                      style={{height: "35px"}}
                    >
                      <div className="raid-title flex-1 border-r border-gray-300 px-4 py-2 text-line-wrap" style={{width: "139px"}}>
                        {raid.raid_name}
                      </div>
                      <div className="flex-1 border-r border-gray-300 px-4 py-2 text-line-wrap" style={{width: "140px", minWidth: "140px"}}>
                        {raid.raid_reader}
                      </div>
                      <div className="flex-1 border-r border-gray-300 px-4 py-2" style={{width: "140px", minWidth: "139px"}}>
                        {raid.userlist.length}/{raid.total_user}
                      </div>
                      <div className="flex-1 px-[7px] py-[6px]" style={{maxWidth: "118px", width: "118px"}}>
                        {raid.userlist.length >= (raid?.total_user || 6) ? (
                          <button onClick={(e) => handleSpectate(e, raid.raid_name)} className="bg-gray-500 text-white px-2 rounded hover:bg-gray-600">
                            관전하기
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleJoin(e)}
                            className={"text-white px-2 rounded " + (raid.userlist.find((raid) => raid.raid_user === user) === undefined ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500")}
                            disabled={raid.userlist.find((raid) => raid.raid_user === user) !== undefined || raid.userlist.length >= raid.total_user}
                          >
                            참가하기
                          </button>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
          <div data-apitype="update_user" id="raid-teammaker" className="relative flex flex-row" style={{height: "85px", marginTop: "20px"}}>
            <div className="border border-[#806FAF]" style={{width: "345px"}}>
              <div className="bg-[#806FAF] text-black text-center flex">
                <div className="flex-1 border-r border-gray-300 px-4 py-2">레이드명</div>
                <div className="flex-1 border-r border-gray-300 px-4 py-2">참가인원</div>
              </div>
              <div className={`flex text-black text-center`}>
                <div className="flex-1 border-r border-gray-300 px-4">
                  <GridInputSelectBox id={"raid-namelist"} type={"text"} colSpan={12} options={[...raids]} />
                </div>
                <div className="flex-1 border-r border-gray-300 px-4 py-2">
                  <input type="number" min={0} max={6} default={6} id={"raid-headcount"} className="w-full h-full rounded-md text-center pl-[20px]" />
                </div>
              </div>
            </div>
            <button onClick={(e) => createRaid(e)} className="relative" style={{width: "180px", height: "90px", marginLeft: "30px"}}>
              <Image src={ImageMakeButton} alt="레이드생성버튼" widht={180} height={90} className="hover:opacity-80" />
            </button>
          </div>
        </div>
        <div className="flex flex-col h-full" style={{width: "260px", marginLeft: "80px"}}>
          <div id="raid-memberlist" className="border border-[#806FAF]">
            {/* 헤더 영역 */}
            <div className="bg-[#806FAF] text-black text-center flex">
              <div className="flex-1 border-r border-gray-300 px-4 py-2" style={{width: "180px", minWidth: "180px"}}>
                참가인원 리스트
              </div>
              <div className="flex-1 border-r border-gray-300 px-4 py-2" style={{width: "77px", minWidth: "77px"}}>
                순서
              </div>
            </div>

            {/* 데이터 영역 (스크롤 가능) */}
            <div className="max-h-[235px]" style={{height: "235px"}}>
              {raidTeamMember &&
                raidTeamMember.map((member, index) => (
                  <div key={`${member.id}-${index}`} className={`raid-team-member flex text-white text-center ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}`} style={{height: "39px"}}>
                    <div className="flex-1 border-r border-gray-300 px-4 py-2 text-line-wrap" style={{width: "180px", minWidth: "180px"}}>
                      {member.name}
                    </div>
                    {clickedRaidRef.current?.raid_reader === user ? (
                      <input className="flex-1 border-r border-gray-300 px-4 py-2 text-black text-center" style={{width: "77px", minWidth: "77px"}} defaultValue={member.raid_order} />
                    ) : (
                      <div className="flex-1 border-r border-gray-300 px-4 py-2" style={{width: "77px", minWidth: "77px"}}>
                        {member.raid_order}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-row mt-[40px] justify-end">
            {clickedRaidRef.current?.raid_reader === user ? (
              <>
                <button onClick={(e) => handleStart(e)} className="flex justify-center items-center w-[110px] h-[45px] border-4 border-sky-400 bg-black text-white rounded hover:bg-gray-800 hover:text-sky-400">
                  시작하기
                </button>
                <button onClick={(e) => modifyRaid(e)} className="w-[110px] h-[45px] border-4 border-sky-400 bg-black text-white rounded hover:bg-gray-800 hover:text-sky-400 ml-3">
                  수정하기
                </button>
              </>
            ) : null}
            {clickedRaidRef.current?.userlist?.find((raid) => raid.raid_user === user) !== undefined && clickedRaidRef.current?.raid_reader !== user ? (
              <button onClick={(e) => handleStart(e)} className="w-[110px] h-[45px] border-4 border-sky-400 bg-black text-white rounded hover:bg-gray-800 hover:text-sky-400 ml-3">
                참가하기
              </button>
            ) : null}
            {clickedRaidRef.current?.userlist?.find((raid) => raid.raid_user === user) !== undefined ? (
              <button onClick={(e) => exitRaid(e)} className="w-[110px] h-[45px] border-4 border-sky-400 bg-black text-white rounded hover:bg-gray-800 hover:text-sky-400 ml-3">
                방나가기
              </button>
            ) : null}
          </div>
        </div>
        {noti && <NotificationModal message={noti} css="font-nexon text-black" onClose={() => setNoti(null)} />}
      </div>
    </>
  );
}
