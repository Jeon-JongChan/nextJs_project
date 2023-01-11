/* next Module */
import Script from "next/script";
import Image from "next/image";
// * react
/**
 * hover시 이미지에 대한 상세 정보를 출력가능한 이미지박스.
 * @param {String} imageSrc - 이미지 주소
 * @param {String} imageAlt - 이미지 태그 alt
 * @param {String} header - 이미지 설명
 * @param {String} text - 이미지 상세 설명
 */
export default function Component(props) {
    let imageSrc = props?.imageSrc || "/blank.png";
    let imageAlt = props?.imageAlt || "";
    let header = props?.header || "";
    let text = props?.text || "";
    return (
        <>
            <div className="aspect-square w-full rounded-lg bg-gray-200 relative">
                <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" objectPosition="center"></Image>
            </div>
            {header ? <h3 className="mt-4 text-sm text-gray-700">{header}</h3> : ""}
            {text ? <p className="mt-1 font-medium text-gray-900">{text}</p> : ""}
        </>
    );
}
