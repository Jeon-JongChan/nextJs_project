import Image from "next/image";
import TabParagraph from "/_custom/components/intro/TabParagraph";
import SlideTumbnail from "/_custom/components/intro/SlideTumbnail";

export default function Home() {
  return (
    <>
      <div className="flex w-full">
        <div className="w-1/3">
          <SlideTumbnail />
        </div>
        <div className="w-2/3">
          <TabParagraph />
        </div>
      </div>
    </>
  );
}
