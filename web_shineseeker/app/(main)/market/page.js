import Image from "next/image";

export default function Home() {
  return (
    <div id="market" className="w-full h-full relative">
      <Image src="/images/shop/06_shop_box.png" fill="true" style={{objectFit: "contain"}}></Image>
      <div className="relative w-full h-full flex flex-col justify-center items-center">
        <img className="absolute top-[40px] right-[80px]" src="/images/shop/06_shop_box_money.png" />
        <span id="market_price" className="absolute flex flex-col justify-center items-center top-[40px] right-[160px] h-[70px] w-[160px]">
          1000
        </span>
        <img className="absolute bottom-[40px] left-[20px]" src="/images/shop/06_shop_box_talk.png" />
        <p id="market-talk" className="absolute bottom-[40px] left-[20px] w-[520px] h-[180px] py-[30px] px-[40px]">
          <span>안녕하세요! [ 사용자 이름 ].</span>
          <br />
          <span>오늘은 어떤 물품을 교환하시겠어요?</span>
          <br />
          <span>천천히 둘러보세요</span>
        </p>
        <button className="market-btn-left1 absolute top-[230px] right-[770px]">
          <img src="/images/shop/06_shop_box_button01.png" />
        </button>
        <button className="market-btn-right1 absolute top-[230px] right-[110px]">
          <img src="/images/shop/06_shop_box_button02.png" />
        </button>
        <button className="market-btn-left2 absolute top-[390px] right-[770px]">
          <img src="/images/shop/06_shop_box_button01.png" />
        </button>
        <button className="market-btn-right2 absolute top-[390px] right-[110px]">
          <img src="/images/shop/06_shop_box_button02.png" />
        </button>
      </div>
    </div>
  );
}
