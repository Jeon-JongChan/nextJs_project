/* next Module */
import Script from "next/script";
import Image from "next/image";
// * react
export default function Component(props) {
    let imageSrc = props?.imageSrc || "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg";
    let imageAlt = props?.imageAlt || "";
    let header = props?.header || "";
    let text = props?.text || "";
    return (
        <>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                {/* <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover object-center group-hover:opacity-75" /> */}
                <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover"></Image>
            </div>
            {header ? <h3 className="mt-4 text-sm text-gray-700">{header}</h3> : ""}
            {text ? <p className="mt-1 font-medium text-gray-900">{text}</p> : ""}
        </>
    );
}
