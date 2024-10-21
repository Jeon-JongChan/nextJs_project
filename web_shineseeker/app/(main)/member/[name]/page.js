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
      <div className="flex justify-between space-x-4 w-full h-full">
        <div className="w-3/10 h-full">
          <div className="relative img-member-init img-member-char-bg">
            <div className="absolute" style={{top: "10px", left: "80px", width: "406px", height: "482px"}}>
              <Image src={DefaultCharacterImage} alt="character image" fill={true} />
              <Image src={DefaultCPetImage} alt="character image" width={80} height={80} style={{position: "absolute", bottom: "60px", right: "0px"}} />
            </div>

            <div className="absolute img-member-init img-member-char-banner-bg" style={{bottom: "35px", left: "70px"}}>
              <Image src={BannerIcon} alt="banner icon" width={89} height={89} style={{position: "relative", top: "25px", left: "25px"}} />
              <div className="absolute flex flex-row" style={{top: "25px", left: "130px"}}>
                <span className="member_banner_title1 relative text-white text-[16px]">이거만들때배아픔</span>
                <span className="member_banner_title2 ml-4 relative text-white text-[16px]">이거만들때배아픔</span>
              </div>
              <p className="member_banner_text font-nexon absolute" style={{top: "50px", left: "130px"}}>
                배가 너무 아파용?
              </p>
            </div>

            <div className="absolute flex flex-col gap-3">
              <button className="relative w-[40px] h-[58px]">
                <Image src={CharacterButton} alt="character button" fill={true} />
              </button>
              <button className="relative w-[40px] h-[58px]">
                <Image src={CharacterButton} alt="character button" fill={true} />
              </button>
              <button className="relative w-[40px] h-[58px]">
                <Image src={CharacterButton} alt="character button" fill={true} />
              </button>
            </div>
          </div>
        </div>
        <div className="w-7/10 space-y-4 w-full">
          <div className="flex w-full justify-end gap-3">
            {[1, 2, 3].map((tab) => (
              <button key={tab} onClick={() => setSelectedTab(tab)} className={`img-member-init ${selectedTab === tab ? "img-member-tab-btn-select" : "img-member-tab-btn"} block w-full text-white`} style={{width: "123px", height: "51px"}}>
                {tab === 1 ? "정보" : tab === 2 ? "스테이터스" : "인벤토리"}
              </button>
            ))}
          </div>
          <div className="relative img-member-init img-member-tab-bg w-full h-[490px]" style={{marginTop: "0"}}>
            {selectedTab === 1 ? <TabInfo user={maindata} /> : selectedTab === 2 ? <TabStatus user={maindata} skill={skilldata} /> : selectedTab === 3 ? <TabInventory user={maindata} items={itemdata} /> : null}
          </div>
        </div>
      </div>
    </>
  );
}
