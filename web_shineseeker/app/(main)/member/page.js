import Image from "next/image";
import MemberPhoto from "./MemberPhoto";

export default function Home() {
  const photoCards = [
    {id: 1, defaultImage: "/images/04_member_box.webp", overlayImage: "https://via.placeholder.com/300x300?text=TEMP2", link: "/member/test"},
    {id: 2, defaultImage: "https://via.placeholder.com/300x300?text=TEMP", overlayImage: "https://via.placeholder.com/300x300?text=TEMP2", link: "#"},
    {id: 3, defaultImage: "https://via.placeholder.com/300x300?text=TEMP", overlayImage: "https://via.placeholder.com/300x300?text=TEMP2", link: "#"},
  ];
  return (
    <div className="" style={{height: "600px"}}>
      <div className="grid grid-cols-9 gap-4" style={{height: "inherit"}}>
        {photoCards.map((card) => (
          <MemberPhoto key={card.id} defaultImage={card.defaultImage} overlayImage={card.overlayImage} link={card.link} />
        ))}
      </div>
    </div>
  );
}
