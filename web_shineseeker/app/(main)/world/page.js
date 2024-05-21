import Image from "next/image";
import TabParagraph from "/_custom/components/world/TabParagraph";
import WorldSlide from "/_custom/components/world/WorldSlide";

export default function Home() {
  return (
    <>
      <div className="flex w-full" style={{height: "600px"}}>
        <div className="w-1/3">
          <WorldSlide />
        </div>
        <div className="w-2/3">
          <TabParagraph />
        </div>
      </div>
    </>
  );
}
