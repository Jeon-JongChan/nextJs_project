/* next Module */
import Script from "next/script";
import Nav from "/page_components/Nav";
import PoketmonInput from "/page_components/PoketmonInput";
import ImageLayoutText from "./public/ImageLayoutText";
// * react
export default function Layout() {
    const products = [
        {
            id: 1,
            name: "Earthen Bottle",
            href: "#",
            price: "$48",
            imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
            imageAlt: "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
        },
        {
            id: 2,
            name: "Nomad Tumbler",
            href: "#",
            price: "$35",
            imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
            imageAlt: "Olive drab green insulated bottle with flared screw lid and flat top.",
        },
        {
            id: 3,
            name: "Focus Paper Refill",
            href: "#",
            price: "$89",
            imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
            imageAlt: "Person using a pen to cross a task off a productivity paper card.",
        },
        {
            id: 4,
            name: "Machined Mechanical Pencil",
            href: "#",
            price: "$35",
            imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
            imageAlt: "Hand holding black machined steel mechanical pencil with brass tip and top.",
        },
        // More products...
    ];
    return (
        <>
            <Nav></Nav>
            <div className="mt-2">
                <ul className="flex items-center justify-center space-x-4">
                    <button>
                        <li className="apply-tab-item">포켓몬 추가</li>
                    </button>
                    <button>
                        <li className="apply-tab-item">포켓몬 지역</li>
                    </button>
                    <button>
                        <li className="apply-tab-item">포켓몬 특성</li>
                    </button>
                </ul>
            </div>
            <div className="flex mt-4">
                <div className="flex flex-col w-2/4">
                    <div className="bg-white">
                        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                            <h2 className="sr-only">Products</h2>

                            <div className="grid grid-cols-4 gap-y-10 gap-x-6">
                                {products.map((product) => (
                                    <a key={product.id} href={product.href} className="group">
                                        {/* <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8"> */}
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                                            <img src={product.imageSrc} alt={product.imageAlt} className="h-full w-full object-cover object-center group-hover:opacity-75" />
                                        </div>
                                        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
                                    </a>
                                ))}
                                <ImageLayoutText></ImageLayoutText>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-2/4">
                    <PoketmonInput></PoketmonInput>
                </div>
            </div>
        </>
    );
}
