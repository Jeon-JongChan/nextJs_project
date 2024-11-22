"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {getImageUrl} from "@/_custom/scripts/client";
import {devLog} from "@/_custom/scripts/common";

export default function Component({defaultImage, overlayImage, link}) {
  const [isHovered, setIsHovered] = useState(false);
  defaultImage = defaultImage || "https://via.placeholder.com/300x300?text=TEMP";
  overlayImage = overlayImage || "https://via.placeholder.com/300x300?text=TEMP";

  return (
    <>
      <div className="photocard relative w-48 h-72 overflow-hidden rounded-lg max-h-[70px] max-w-[70px]" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Link href={link ? link : "/member/test"}>
          <img src={isHovered ? getImageUrl(overlayImage) : getImageUrl(defaultImage)} alt="Default Image" width="70" height="70" className="object-cover transition-opacity duration-300" />
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
