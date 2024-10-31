"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import TabInfo from "./TabInfo";
import TabStatus from "./TabStatus";
import TabInventory from "./TabInventory";
import BannerIcon from "@/public/images/member/04_member_ch_banner_icon.png";
import CharacterButton from "@/public/images/member/04_member_ch_button.png";
import DefaultCharacterImage from "@/public/images/member/04_member_ch02.png";
import DefaultCPetImage from "@/public/images/member/04_member_ch01.png";

const menuName = "memberDetail";
export default function Home({params}) {
  const [maindata, setMainData] = useState({});
  const [skilldata, setSkillData] = useState([]);
  const [itemdata, setItemData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [petImage, setPetImage] = useState(null);
  const images = ["https://via.placeholder.com/500?text=Image+1", "https://via.placeholder.com/500?text=Image+2", "https://via.placeholder.com/500?text=Image+3"];

  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response = await fetch(`/api/select?apitype=user&getcount=1&userid=${params.name}`);
    console.log("야 메인 땡긴다?", response);
    const newData = await response.json();
    if (newData?.data?.length) {
      console.log(`admin *** ${menuName} *** page data 갱신되었습니다 : `, newData, params);
      setMainData(newData.data[0]);
    }

    let skillResponse = await fetch(`/api/select?apitype=skill&getcount=1`);
    const newSkillData = await skillResponse.json();
    if (newSkillData?.data?.length) {
      console.log(`admin *** ${menuName} *** page data 갱신되었습니다 : `, newSkillData);
      setSkillData(newSkillData.data);
    }

    let itemResponse = await fetch(`/api/select?apitype=item&getcount=1`);
    const newItemData = await itemResponse.json();
    if (newItemData?.data?.length) {
      console.log(`admin *** ${menuName} *** page data 갱신되었습니다 : `, newItemData);
      setItemData(newItemData.data);
    }
  }
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  useEffect(() => {
    let contents = {};

    if (maindata != {}) {
      contents = maindata;
      // setPhotoCards(contents);
    }

    console.log("maindata:", contents);
  }, [maindata]);

  return (
    <>
      <div className="flex" style={{width: "960px", height: "415px"}}>
        <div className="relative" style={{width: "400px", height: "415px"}}>
          <div className="relative img-member-init img-member-char-bg w-full h-full">
            <div className="absolute" style={{width: "300px", height: "315px", top: "20px", left: "40px"}}>
              <Image src={DefaultCharacterImage} alt="character image" fill={true} />
              <Image src={DefaultCPetImage} alt="character image" width={105} height={130} style={{position: "absolute", bottom: "20px", right: "-10px"}} />
            </div>

            <div className="absolute img-member-init img-member-char-banner-bg" style={{bottom: "0px", left: "35px"}}>
              <Image src={BannerIcon} alt="banner icon" width={60} height={60} style={{position: "absolute", top: "15px", left: "15px"}} />
              <div className="absolute flex flex-row text-white text-[16px]" style={{width: "200px", height: "25px", top: "15px", left: "90px"}}>
                <span className="member_banner_title relative">SEEKER&nbsp;</span>
                <span className="member_banner_title1 relative text-line-wrap" style={{width: "70px"}}>
                  {maindata?.username1 || ""}
                </span>
                <span className="member_banner_title2 relative text-line-wrap ml-2" style={{width: "70px"}}>
                  {maindata?.username2 || ""}
                </span>
              </div>
              <div className="absolute member_banner_text font-nexon flex flex-col" style={{top: "35px", left: "90px"}}>
                <span className="text-[13px] text-line-wrap" style={{width: "200px"}}>
                  {maindata?.addinfo1}
                </span>
                <span className="text-[11px] text-line-wrap" style={{width: "200px"}}>
                  {maindata?.addinfo2}
                </span>
              </div>
            </div>

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
            </div>
          </div>
        </div>
        <div className="relative" style={{width: "550px", height: "365px", marginTop: "45px"}}>
          <div className="flex w-full justify-end gap-3">
            {[1, 2, 3].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`img-member-init ${selectedTab === tab ? "img-member-tab-btn-select" : "img-member-tab-btn"} block w-full text-white`}
                style={{width: "85px", height: "35px"}}
              >
                {tab === 1 ? "정보" : tab === 2 ? "스테이터스" : "인벤토리"}
              </button>
            ))}
          </div>
          <div className="relative img-member-tab-bg w-full" style={{height: "325px", marginTop: "0"}}>
            {selectedTab === 1 ? (
              <TabInfo user={maindata} />
            ) : selectedTab === 2 ? (
              <TabStatus user={maindata} skill={skilldata} />
            ) : selectedTab === 3 ? (
              <TabInventory user={maindata} items={itemdata} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
