"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";

export default function Component({defaultImage, overlayImage, link}) {
  const [isHovered, setIsHovered] = useState(false);
  defaultImage = defaultImage ? defaultImage : "https://via.placeholder.com/300x300?text=TEMP";
  return (
    <>
      <div className="photocard relative w-48 h-72 overflow-hidden rounded-lg max-h-[70px] max-w-[70px]" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Link href={link ? link : "/member/test"}>
          <Image
            src={isHovered ? overlayImage : defaultImage}
            alt="Default Image"
            width="70"
            height="70"
            className="object-cover transition-opacity duration-300"
            //style={{opacity: isHovered ? 0 : 1}}
          />
        </Link>
      </div>
    </>
  );
}
/*
        {isHovered && (
          <div
            className="overlay-image absolute top-0 left-0 w-full h-full bg-cover opacity-100 transition-opacity duration-300"
            style={{backgroundImage: `url('${overlayImage}')`}}
          ></div>
        )}
*/
