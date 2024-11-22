"use client";
import {useState} from "react";
import Image from "next/image";
import {devLog} from "/_custom/scripts/common";
import {updateDataWithFormInputs} from "/_custom/scripts/client";
import RaidProcessButton from "@/public/images/raid/05_raid_03_gobutton.png";
import {getImageUrl} from "@/_custom/scripts/client";

export default function Home() {
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isGameClear, setIsGameClear] = useState(true);
  const [hpCurrent, setHpCurrent] = useState(110);
  const bgImage = "/images/raid/05_raid_button1.png"; // 배경 이미지 경로
  const bossImage = "/images/raid/boss_example.webp"; // 보스 이미지 경로
  const hpMax = 200;
  const iconUrls = ["/images/04_member_box.webp", "/images/04_member_box.webp", "/images/04_member_box.webp", "/images/04_member_box.webp", "/images/04_member_box.webp"];
  const MemberPosCss = ["top-[0px] left-[0px]", "top-[145px] left-[0px]", "top-[290px] left-[0px]", "top-[0px] right-[0px]", "top-[145px] right-[0px]", "top-[290px] right-[0px]"];

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

  return isGameEnded ? (
    <Ended isClear={isGameClear} item={"사람얼굴"} image={"/images/04_member_box.webp"} />
  ) : (
    <>
      <button
        className="fixed text-[40px] top-0"
        onClick={() => {
          setIsGameEnded(true);
          setIsGameClear(false);
        }}
      >
        게임 실패
      </button>
      <button
        className="fixed text-[40px] top-0 left-[40px]"
        onClick={() => {
          setIsGameEnded(true);
          setIsGameClear(true);
        }}
      >
        게임 성공
      </button>
      <input type="number" max={200} onChange={(e) => setHpCurrent(e.target.value > 200 ? 200 : e.target.value)} className="fixed text-[40px] top-0 right-[40px]" />
      <div className="absolute flex flex-col items-center" style={{width: "760px", height: "600px", top: "-30px"}}>
        <div className="relative block text-white text-[24px]">보스 이름</div>
        <div className="relative flex w-full h-full mt-1">
          <HPBar maxHP={hpMax} currentHP={hpCurrent} />
        </div>
        <div className="relative flex" style={{width: "760px", height: "535px"}}>
          <img src={getImageUrl(bossImage)} alt="raid-bg" className="w-full h-full" />
        </div>
      </div>
      <div className="relative flex w-full h-full">
        {MemberPosCss.map((css, index) => (
          <RaidMember key={index} bgImage={bgImage} hpCurrent={hpCurrent} hpMax={hpMax} iconUrls={iconUrls} css={css} />
        ))}
      </div>
    </>
  );
}

function RaidMember({bgImage, hpCurrent, hpMax, iconUrls, css = ""}) {
  return (
    <div
      className={"absolute w-[245px] h-[125px] bg-cover bg-center rounded-lg " + css}
      style={{backgroundImage: `url(${getImageUrl(bgImage)})`}} // 배경화면
    >
      {/* 진행하기 버튼 */}
      <button className="absolute w-[80px] h-[25px]" style={{top: "10px", right: "12px"}}>
        <Image src={RaidProcessButton} alt="raid-process-button" width={80} height={25} />
      </button>

      {/* HP 텍스트 */}
      <div className="absolute text-white" style={{top: "40px", right: "15px"}}>
        HP
      </div>

      {/* 잔여 HP */}
      <div className="absolute text-white" style={{top: "55px", right: "15px"}}>
        {hpCurrent}/{hpMax}
      </div>

      {/* 아이콘들 */}
      <div className="absolute bottom-2 left-2 flex space-x-3">
        {iconUrls.map((icon, index) => (
          <div key={index} className="relative flex justify-center items-center w-[35px] h-[35px] img-raid-icon-frame">
            <img src={getImageUrl(icon)} alt={`icon-${index}`} className="max-w-[30px] max-h-[30px]" width={30} height={30} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HPBar({maxHP, currentHP}) {
  // HP 비율 계산
  const hpPercentage = (currentHP / maxHP) * 100;

  return (
    <div className="relative w-full bg-white rounded-full" style={{height: "8px"}}>
      {/* 초록색 바 (HP가 남아있는 부분) */}
      <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-300" style={{width: `${hpPercentage}%`}} />
      {/* 흰색 바 (HP가 부족한 부분, 오른쪽에만 표시) */}
      {/* <div className="absolute top-0 right-0 h-full bg-white rounded-full transition-all duration-300" style={{width: `${100 - hpPercentage}%`}} /> */}
    </div>
  );
}
