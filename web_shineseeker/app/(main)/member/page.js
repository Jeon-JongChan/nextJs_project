import Image from "next/image";
import MemberPhoto from "/_custom/components/member/MemberPhoto";

export default function Home() {
  const photoCards = [
    {id: 1, defaultImage: "https://via.placeholder.com/600x300?text=TEMP", overlayImage: "https://via.placeholder.com/600x300?text=TEMP2", link: "/member/test"},
    {id: 2, defaultImage: "https://via.placeholder.com/600x300?text=TEMP", overlayImage: "https://via.placeholder.com/600x300?text=TEMP2", link: "#"},
    {id: 3, defaultImage: "https://via.placeholder.com/600x300?text=TEMP", overlayImage: "https://via.placeholder.com/600x300?text=TEMP2", link: "#"},
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {photoCards.map((card) => (
        <MemberPhoto key={card.id} defaultImage={card.defaultImage} overlayImage={card.overlayImage} link={card.link} />
      ))}
    </div>
  );
}
