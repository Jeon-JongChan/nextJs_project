import {useState, forwardRef, useImperativeHandle} from "react";
import {devLog} from "@/_custom/scripts/common";
import GridInputText from "@/_custom/components/_common/grid/GridInputText";
import GridTextArea from "@/_custom/components/_common/grid/GridInputTextArea";
import GridInputButton from "@/_custom/components/_common/grid/GridInputButton";

// 모달 컴포넌트
function ChangeSpellModal({onButtonClick, title = "아이템 선택"}, ref) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // 애니메이션을 제어하는 상태
  const [item, setItem] = useState(null);

  // 외부에서 openModal 함수 호출 가능하도록 설정
  useImperativeHandle(ref, () => ({
    openModal: (item) => {
      devLog("ModalExample openModal - mailing : ", item);
      setItem(item);
      setIsModalOpen(true); // 모달이 열리기 시작
      setTimeout(() => setIsVisible(true), 10); // 애니메이션 적용
    },
  }));

  // 모달 닫기 함수
  const closeModal = () => {
    setIsVisible(false); // 애니메이션 시작
    setTimeout(() => setIsModalOpen(false), 300); // 애니메이션 종료 후 모달 닫기
  };

  // 아이템 클릭 핸들러
  const handleButtonClick = (event) => {
    event.preventDefault();
    const value = event.target.innerText;
    onButtonClick(value); // 부모 컴포넌트에 선택된 아이템 전달
    closeModal();
  };

  // 바깥 검은 부분을 클릭했을 때 모달 닫기
  const handleBackgroundClick = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="fixed flex items-center justify-center h-screen top-0 left-0">
      {/* 모달 */}
      {isModalOpen && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`} onClick={handleBackgroundClick}>
          <div className={`relative bg-white rounded-lg p-6 w-80 text-center transform transition-all duration-300 ${isVisible ? "scale-100 translate-y-0" : "scale-90 -translate-y-10"}`}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="grid grid-cols-12 font-nexon">
              {item.map((user, index) => (
                <div key={index} onClick={handleButtonClick} className="flex items-center justify-center col-span-12 bg-black min-h-[40px] text-white ">
                  {user.userid}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default forwardRef(ChangeSpellModal);
