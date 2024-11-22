"use client";
import {useState} from "react";
import Image from "next/image";
import {devLog, updateDataWithFormInputs} from "/_custom/scripts/common";
import GridInputSelectBox from "/_custom/components/_common/grid/GridInputSelectBox";
import ImageMakeButton from "@/public/images/raid/05_raid_button1.png";

export default function Home() {
  const [raids, setRaids] = useState([
    {id: 1, name: "다크리사 던전", leader: "유저1", members: 4, status: "참가 가능"},
    {id: 2, name: "다크리사 챔버", leader: "유저2", members: 6, status: "관전 가능"},
    {id: 2, name: "다크리사 챔버", leader: "유저2", members: 6, status: "관전 가능"},
  ]);
  const [raidTeamMember, setRaidTeamMember] = useState([
    {id: 1, name: "유저1", team_order: 1},
    {id: 2, name: "유저2", team_order: 2},
    {id: 2, name: "유저2", team_order: 2},
    {id: 2, name: "유저2", team_order: 2},
    {id: 2, name: "유저2", team_order: 2},
    {id: 2, name: "유저2", team_order: 2},
  ]);

  const handleJoin = (id) => {
    alert(`${id}번 레이드에 참가합니다!`);
  };

  const handleSpectate = (id) => {
    alert(`${id}번 레이드를 관전합니다!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apitype = e.target.dataset.apitype;
    const addObject = {};

    // 각 select의 id와 선택된 value를 가져와 result 객체에 저장
    const selectElements = e.target.querySelectorAll("select");
    selectElements.forEach((select) => {
      addObject[select.id] = select.value; // id: value 형태로 저장
    });

    devLog("handleSubmitUser", apitype);
    updateDataWithFormInputs(e, apitype, "page/raid", addObject, true);
  };

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
              {raids.map((raid, index) => (
                <div key={raid.id} className={`flex text-white text-center ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}`} style={{height: "35px"}}>
                  <div className="flex-1 border-r border-gray-300 px-4 py-2">{raid.name}</div>
                  <div className="flex-1 border-r border-gray-300 px-4 py-2">{raid.leader}</div>
                  <div className="flex-1 border-r border-gray-300 px-4 py-2">{raid.members}/6</div>
                  <div className="flex-1 px-[7px] py-[6px]">
                    {raid.members >= 6 ? (
                      <button onClick={() => handleSpectate(raid.id)} className="bg-gray-500 text-white px-2 rounded hover:bg-gray-600">
                        관전하기
                      </button>
                    ) : (
                      <button onClick={() => handleJoin(raid.id)} className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600">
                        참가하기
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} data-apitype="update_user" id="raid-teammaker" className="relative flex flex-row" style={{height: "85px", marginTop: "20px"}}>
            <div className="border border-[#806FAF]" style={{width: "345px"}}>
              <div className="bg-[#806FAF] text-black text-center flex">
                <div className="flex-1 border-r border-gray-300 px-4 py-2">레이드명</div>
                <div className="flex-1 border-r border-gray-300 px-4 py-2">참가인원</div>
              </div>
              <div className={`flex text-black text-center`}>
                <div className="flex-1 border-r border-gray-300 px-4">
                  <GridInputSelectBox id={"raid-namelist"} type={"text"} colSpan={12} onchange={null} options={["퍼큐", "시발"]} />
                </div>
                <div className="flex-1 border-r border-gray-300 px-4 py-2">
                  <input type="number" min={0} max={6} value={6} id={"raid-headcount"} className="w-full h-full rounded-md text-center pl-[20px]" />
                </div>
              </div>
            </div>
            <button type="submit" className="relative" style={{width: "180px", height: "90px", marginLeft: "30px"}}>
              <Image src={ImageMakeButton} alt="레이드생성버튼" widht={180} height={90} className="hover:opacity-80" />
            </button>
          </form>
        </div>
        <div className="flex flex-col h-full" style={{width: "260px", marginLeft: "80px"}}>
          <div id="raid-memberlist" className="border border-[#806FAF]">
            {/* 헤더 영역 */}
            <div className="bg-[#806FAF] text-black text-center flex">
              <div className="flex-1 border-r border-gray-300 px-4 py-2">참가인원 리스트</div>
              <div className="flex-1 border-r border-gray-300 px-4 py-2">순서</div>
            </div>

            {/* 데이터 영역 (스크롤 가능) */}
            <div className="max-h-[235px]" style={{height: "235px"}}>
              {raidTeamMember.map((member, index) => (
                <div key={member.id} className={`flex text-white text-center ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}`} style={{height: "39px"}}>
                  <div className="flex-1 border-r border-gray-300 px-4 py-2">{member.name}</div>
                  <div className="flex-1 border-r border-gray-300 px-4 py-2">{member.team_order}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row mt-[40px] justify-end">
            <button className="w-[110px] h-[45px] border-4 border-sky-400 bg-black text-white rounded hover:bg-gray-800 hover:text-sky-400">시작하기</button>
            <button className="w-[110px] h-[45px] border-4 border-sky-400 bg-black text-white rounded hover:bg-gray-800 hover:text-sky-400 ml-3">방나가기</button>
          </div>
        </div>
      </div>
    </>
  );
}
