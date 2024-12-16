"use client";
import {useState, useEffect} from "react";
import TabInfo from "./TabInfo";
import TabStatus from "./TabStatus";
import TabInventory from "./TabInventory";
// import CharacterButton from "@/public/images/member/04_member_ch_button.png";
import DefaultCharacterImage from "@/public/images/member/04_member_ch02.png";
import Tooltip from "@/_custom/components/_common/TooltipFixed";
import {useAuth} from "@/app/AuthContext"; // AuthContext의 경로에 따라 조정
import {devLog} from "@/_custom/scripts/common";
import {getImageUrl, getImageUrlAsync} from "@/_custom/scripts/client";
// import DefaultCPetImage from "@/public/images/member/04_member_ch01.png";

const menuName = "memberDetail";
export default function Home({params}) {
  const {tokenRef} = useAuth() || {}; // handleLogin 가져오기
  const [maindata, setMainData] = useState({});
  const [skilldata, setSkillData] = useState([]);
  const [itemdata, setItemData] = useState([]);
  const [jobImage, setJobImage] = useState("images/member/04_member_ch_banner_icon.png");
  const [selectedTab, setSelectedTab] = useState(1);
  // const images = ["https://via.placeholder.com/500?text=Image+1", "https://via.placeholder.com/500?text=Image+2", "https://via.placeholder.com/500?text=Image+3"];

  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchDataEssential() {
    let response = await fetch(`/api/select?apitype=user&getcount=1&userid=${params.name}`);
    devLog("야 메인 땡긴다?", response);
    const newData = await response.json();
    if (newData?.data?.length) {
      devLog(`admin *** ${menuName} *** page data 갱신되었습니다 : `, newData, params, newData.data[0]?.items);
      const newMainData = newData.data[0];
      setMainData(newMainData);
    }

    let itemResponse = await fetch(`/api/select?apitype=item&getcount=1`);
    const newItemData = await itemResponse.json();
    if (newItemData?.data?.length) {
      devLog(`admin *** ${menuName} page item data 갱신되었습니다 : `, newItemData);
      setItemData(newItemData.data);
    }

    let jobImageResponse = await fetch(`/api/page?apitype=user_job&getcount=1&userid=${params.name}`);
    const newJobImageData = await jobImageResponse.json();
    if (newJobImageData?.data?.length) {
      devLog(`admin *** ${menuName} page job image data 갱신되었습니다 : `, newJobImageData);
      setJobImage(newJobImageData.data[0]?.job_img_0 || jobImage);
    }

    if (params.name === tokenRef.current?.user?.name) {
      devLog(`${params.name}님 환영합니다.`);
      // let skillResponse = await fetch(`/api/select?apitype=skill&getcount=1`);
      let skillResponse = await fetch(`/api/page?apitype=member_skill&userid=${params.name}`);
      const newSkillData = await skillResponse.json();
      if (newSkillData?.data?.length) {
        devLog(`admin *** ${menuName} page skill data 갱신되었습니다 : `, newSkillData);
        setSkillData(newSkillData.data);
      }
    }
  }
  const fetchData = async () => {
    let response = await fetch(`/api/select?apitype=user&userid=${params.name}`);
    const newData = await response.json();
    if (newData?.data?.length) {
      const newMainData = newData.data[0];
      Object.keys(newMainData).forEach(async (key) => {
        if (key.includes("user_img")) {
          if (newMainData[key]) newMainData[key] = await getImageUrlAsync(newMainData[key]);
          devLog("Member user change maindata imgage key", key, newMainData[key]);
        }
      });
      devLog(`admin *** ${menuName} *** page data 반복 갱신되었습니다 : `, newData, params, newMainData?.items);
      setMainData(newMainData);
    }
  };
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchDataEssential();
    const intervalId = setInterval(fetchData, 10 * 1000);
    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  return (
    <>
      <div className="flex" style={{width: "960px", height: "415px"}}>
        <div className="relative" style={{width: "400px", height: "415px"}}>
          <div className="relative img-member-init img-member-char-bg w-full h-full">
            <div className="absolute" style={{width: "300px", height: "315px", top: "20px", left: "40px"}}>
              <img src={getImageUrl(maindata?.user_img_1) || DefaultCharacterImage} alt="character image" className="w-full h-full" />
              {maindata?.user_img_2 && <img src={getImageUrl(maindata.user_img_2)} alt="character image" width={105} height={130} style={{position: "absolute", bottom: "20px", right: "-10px"}} />}
            </div>

            <div className="absolute img-member-init img-member-char-banner-bg" style={{bottom: "0px", left: "35px"}}>
              <img src={getImageUrl(jobImage)} alt="banner icon" width={60} height={60} style={{position: "absolute", top: "15px", left: "15px"}} />
              <div className="absolute flex flex-row text-white text-[16px]" style={{width: "200px", height: "25px", top: "15px", left: "90px"}}>
                <span className="member_banner_title relative">SEEKER&nbsp;</span>
                <span className="member_banner_title1 relative text-line-wrap" style={{width: "140px"}}>
                  {maindata?.username1 || ""}
                </span>
                {/* <span className="member_banner_title2 relative text-line-wrap ml-2" style={{width: "70px"}}>
                  {maindata?.username2 || ""}
                </span> */}
              </div>
              <div className="absolute member_banner_text font-nexon flex flex-col" style={{top: "35px", left: "90px"}}>
                <span className="text-[11px] text-line-wrap" style={{width: "200px"}}>
                  {maindata?.addinfo1}
                </span>
                {/* <span className="text-[11px] text-line-wrap" style={{width: "200px"}}>
                  {maindata?.addinfo2}
                </span> */}
                <Tooltip content={maindata?.addinfo2} fixWidth={450} fixLeft={430}>
                  <span className="text-[11px] text-line-wrap block" style={{width: "200px"}}>
                    {maindata?.addinfo2}
                  </span>
                </Tooltip>
              </div>
            </div>

            {/* 사진 변경 버튼 
            <div className="absolute flex flex-col gap-3">
              <button className="relative">
                <Image src={CharacterButton} alt="character button" width={30} height={30} />
              </button>
              <button className="relative">
                <Image src={CharacterButton} alt="character button" width={30} height={30} />
              </button>
              <button className="relative">
                <Image src={CharacterButton} alt="character button" width={30} height={30} />
              </button>
            </div> */}
          </div>
        </div>
        <div className="relative" style={{width: "550px", height: "365px", marginTop: "45px"}}>
          <div className="flex w-full justify-end gap-3">
            {[1, 2, 3].map((tab) => (
              <button key={tab} onClick={() => setSelectedTab(tab)} className={`img-member-init ${selectedTab === tab ? "img-member-tab-btn-select" : "img-member-tab-btn"} block w-full text-white`} style={{width: "85px", height: "35px"}}>
                {tab === 1 ? "정보" : tab === 2 ? "스테이터스" : "인벤토리"}
              </button>
            ))}
          </div>
          <div className={`img-member-tab-bg w-full`} style={{height: "325px", marginTop: "0"}}>
            {selectedTab === 1 ? (
              <TabInfo user={maindata} />
            ) : selectedTab === 2 ? (
              <TabStatus user={maindata} skill={skilldata} currentUser={tokenRef.current?.user?.name} />
            ) : selectedTab === 3 ? (
              <TabInventory user={maindata} items={itemdata} currentUser={tokenRef.current?.user?.name} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
