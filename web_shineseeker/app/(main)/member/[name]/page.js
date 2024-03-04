import Image from "next/image";
import MemberPhoto from "/_custom/components/member/MemberPhoto";

export default function Home({params}) {
  return (
    <>
      <p>{params.name}</p>
    </>
  );
}
