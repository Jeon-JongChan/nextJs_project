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
 * @param {Object[]} layer - hover 상태에서 출력할 layertext(name, content) 객체의 배열
 */
export default function Component(props) {
    let imageSrc = props?.imageSrc || "/temp/blank.png";
    let imageAlt = props?.imageAlt || "";
    let header = props?.header || "";
    let text = props?.text || "";
    let layer = props?.layer || null;

    return (
        <>
            <div className="aspect-square w-full rounded-lg bg-gray-200 relative">
                {/* <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover object-center group-hover:opacity-75" /> */}
                {/* <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover"></Image> */}
                <div className="apply-image-layer-text">
                    {layer
                        ? layer.map((object, idx) => {
                              console.log("layer inner", imageSrc, object, idx);
                              return (
                                  <div key={idx} className="text-white">
                                      <span className="font-black">
                                          {object.name} : <span className="font-extralight">{object.content}</span>
                                      </span>
                                  </div>
                              );
                          })
                        : ""}
                </div>
                <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" objectPosition="center"></Image>
            </div>
            {header ? <h3 className="mt-4 text-sm text-gray-700">{header}</h3> : ""}
            {text ? <p className="mt-1 font-medium text-gray-900">{text}</p> : ""}
        </>
    );
}

// {
//     imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
//     imageAlt: "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
//     layer: [
//         { name: "1", content: "test" },
//         { name: "2", content: "image" },
//         { name: "3", content: "monkey" },
//     ],
// },
// {
//     imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
//     imageAlt: "Olive drab green insulated bottle with flared screw lid and flat top.",
//     layer: [
//         { name: "1", content: "test" },
//         { name: "2", content: "image" },
//         { name: "3", content: "monkey" },
//     ],
// },
// {
//     imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
//     imageAlt: "Person using a pen to cross a task off a productivity paper card.",
//     layer: [
//         { name: "1", content: "test" },
//         { name: "2", content: "image" },
//         { name: "3", content: "monkey" },
//     ],
// },
// {
//     imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
//     imageAlt: "Hand holding black machined steel mechanical pencil with brass tip and top.",
//     layer: [
//         { name: "1", content: "test" },
//         { name: "2", content: "image" },
//         { name: "3", content: "monkey" },
//     ],
// },
// More products...
// ];