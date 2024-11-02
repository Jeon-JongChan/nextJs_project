"use client";
import MemberPhoto from "./MemberPhoto";
import React, {useState, useEffect} from "react";

const menuName = "member";
export default function Home(props) {
  const [maindata, setMainData] = useState([]);
  const [photoCards, setPhotoCards] = useState([]);
  let fetchIndex = 0;
  // 데이터를 주기적으로 가져오기 위한 함수
  async function fetchData() {
    let response = await fetch(`/api/select?apitype=user&getcount=1`);
    console.log("야 메인 땡긴다?", response);
    // if (fetchIndex++ == 0) response = await fetch(`/api/select?apitype=${menuName}&getcount=1`);
    // else response = await fetch(`/api/select?apitype=${menuName}`);
    const newData = await response.json();
    if (newData?.data?.length) {
      console.log(`admin *** ${menuName} *** page data 갱신되었습니다(${fetchIndex}): `, newData);
      setMainData([...newData.data]);
    }
  }
  // 최초 데이터 빠르게 가져오기 위한 useEffect
  useEffect(() => {
    fetchData();
    // const intervalId = setInterval(fetchData, 10 * 1000);
    // return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
  }, []);

  /* prettier-ignore */
  useEffect(() => {
    let contents = {};
    
    if (maindata.length) {
      contents = maindata.filter((data) => data?.['user_img_0'] ).map((data) => ({defaultImage: data.user_img_0, overlayImage: data.user_img_0, link: `/member/${data.userid}`}));
      setPhotoCards(contents);
    }
      
    console.log("maindata:", contents);
  }, [maindata]);

  return (
    <div className="relative w-full overflow-y-auto no-scrollbar" style={{height: "325px", top: "-60px"}}>
      <div className="grid grid-cols-9 gap-4" style={{height: "inherit"}}>
        {photoCards.map((card) => (
          <MemberPhoto key={card.id} defaultImage={card.defaultImage} overlayImage={card.overlayImage} link={card.link} />
        ))}
      </div>
    </div>
  );
}

const defaultPhotoCards = [
  {id: 1, defaultImage: "/images/04_member_box.webp", overlayImage: "https://via.placeholder.com/300x300?text=TEMP2", link: "/member/test"},
  // {id: 2, defaultImage: "https://via.placeholder.com/300x300?text=TEMP", overlayImage: "https://via.placeholder.com/300x300?text=TEMP2", link: "#"},
  // {id: 3, defaultImage: "https://via.placeholder.com/300x300?text=TEMP", overlayImage: "https://via.placeholder.com/300x300?text=TEMP2", link: "#"},
];
