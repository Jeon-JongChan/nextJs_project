import Image from "next/image";
import CustomSlide from "/_custom/components/CustomSlide";
import LoginForm from "/_custom/components/main/LoginForm";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-6" style={{height: "400px"}}>
        <div className="login col-span-2 max-h-full mr-4" style={{height: "inherit"}}>
          <div className="bg-gray-100 max-h-full flex flex-col items-center">
            {/* 로고 */}
            <div className="text-white w-full py-4 px-28" style={{height: "248px"}}>
              <img src="https://via.placeholder.com/300x300?text=login" alt="로고" className="w-full max-h-full" />
            </div>
            {/* 로그인 폼 */}
            <LoginForm />
          </div>
        </div>
        <div className="col-span-4 max-h-full" style={{height: "inherit"}}>
          <CustomSlide />
        </div>
      </div>
      <div className="grid grid-cols-6  w-full mt-8" style={{height: "400px"}}>
        <div className="col-span-2 mr-4 px-2">
          <div className="w-full h-full bg-slate-700"></div>
        </div>
        <div className="col-span-4 grid grid-cols-4 gap-x-4">
          <div className="grid-cols-1 bg-slate-700"></div>
          <div className="grid-cols-1 bg-slate-700"></div>
          <div className="grid-cols-1 bg-slate-700"></div>
          <div className="grid-cols-1 bg-slate-700"></div>
        </div>
      </div>
    </>
  );
}
