"use client";
import {useState} from "react";
import Image from "next/image";
import TabInfo from "./TabInfo";
import TabStatus from "./TabStatus";
import TabInventory from "./TabInventory";
import BannerIcon from "@/public/images/member/04_member_ch_banner_icon.png";
import CharacterButton from "@/public/images/member/04_member_ch_button.png";
import DefaultCharacterImage from "@/public/images/member/04_member_ch02.png";
import DefaultCPetImage from "@/public/images/member/04_member_ch01.png";

export default function Home({params}) {
  const [selectedTab, setSelectedTab] = useState(1);
  const [petImage, setPetImage] = useState(null);
  const images = ["https://via.placeholder.com/500?text=Image+1", "https://via.placeholder.com/500?text=Image+2", "https://via.placeholder.com/500?text=Image+3"];
  const contents = [<TabInfo key="1" />, <TabStatus key="2" />, <TabInventory key="3" />];

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
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`img-member-init ${selectedTab === tab ? "img-member-tab-btn-select" : "img-member-tab-btn"} block w-full text-white`}
                style={{width: "123px", height: "51px"}}
              >
                탭 {tab}
              </button>
            ))}
          </div>
          <div className="relative img-member-init img-member-tab-bg mt-4 w-full h-[490px]">
            {contents[selectedTab - 1]}
            <h1 className="member_once_text absolute text-white text-[36px]" style={{bottom: "20px", left: "25px"}}>
              &quot;아몰랑&quot;
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
