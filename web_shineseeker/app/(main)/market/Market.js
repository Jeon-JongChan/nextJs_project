"use client";
import {useState, useEffect} from "react";
// import Tooltip from "@/_custom/components/_common/Tooltip";
import Tooltip from "@/_custom/components/_common/TooltipFixed";
import {getImageUrl} from "@/_custom/scripts/client";
import {devLog} from "@/_custom/scripts/common";

const menuName = "market";
export default function Home({userid, marketItems, money, setMoney}) {
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 상태
  const [items, setItems] = useState([]);

  const handleItemSelect = (event, item) => {
    event.stopPropagation();
    devLog("아이템 선택:", event, event.target, event.clientX, event.clientY, item);
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedItem({
      index: item.index,
      item_name: item.item_name,
      cost: item.cost,
      position: {x: rect.right, y: rect.bottom}, // 아이템의 오른쪽 아래 위치
    });
  };
  const handleBlur = (event) => {
    if (event.relatedTarget) return;
    // devLog("아이템 선택 해제:", event, event.relatedTarget);
    setSelectedItem(null);
  };
  const handleAction = (action) => {
    if (action === "use") {
      if (selectedItem.cost !== 0 && money < selectedItem.cost) {
        setSelectedItem(null);
        alert("돈이 부족합니다.");
        return;
      }
      devLog("아이템 구매:", selectedItem.item);
      // setItems((prevItems) => prevItems.filter((_, i) => i !== selectedItem.index));
      // 서버에 변경사항 저장
      const formData = new FormData();
      formData.append("apitype", "market_buy_item");
      formData.append("item_name", selectedItem.item_name);
      formData.append("item_cost", selectedItem.cost);
      formData.append("userid", userid);
      fetch("/api/page", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setMoney(money - selectedItem.cost);
          console.info("아이템 사용 성공적 메세지 : ", data);
        })
        .catch((error) => console.error("Market(handleAction) using Item Error:", error));
    } else if (action === "delete") {
      devLog("아이템 삭제:", selectedItem.item);
    }
    setSelectedItem(null);
  };
  useEffect(() => {
    setItems(marketItems);
  }, [marketItems]);
  return (
    <div className="absolute market-itembox p-2 grid grid-cols-3 auto-rows-[65px] gap-1 overflow-y-auto" style={{width: "530px", height: "230px", top: "80px", right: "45px", marginTop: "20px"}}>
      {items &&
        items?.map((item, index) => (
          <Tooltip key={index} css={"relative flex"} content={<span>{item.item_desc}</span>}>
            <div
              className="relative flex market-itembox-item img-market-init img-market-itemframe"
              style={{width: "150px", height: "65px"}}
              onClick={(e) => handleItemSelect(e, {index: index, item_name: item.item_name, cost: item.item_cost})}
              tabIndex={0} // 포커스 가능하도록 설정
              onBlur={handleBlur} // 외부 클릭 시 선택 해제
            >
              <div
                className="market-itembox-item-image flex justify-center items-center max-h-[45px] min-h-[45px] max-w-[45px] min-w-[45px]"
                style={{width: "45px", height: "45px", margin: "10px 2px 6px 7px"}}
              >
                <img
                  src={getImageUrl(item.item_img_0) || "https://via.placeholder.com/100?text=Image"}
                  className="relative max-h-[40px] min-h-[40px] max-w-[40px] min-w-[40px]"
                  width={40}
                  height={40}
                  alt="item image"
                />
              </div>
              <div className="market-itembox-item-info flex flex-col p-1 font-nexon font-bold h-full" style={{width: "100px"}}>
                <div className="flex flex-col w-full mt-4">
                  <span className="block text-white text-[12px]">{item.item_name}</span>
                  {item.item_cost && <span className="block text-[10px] text-line-wrap">{item.item_cost || 0} AKA</span>}
                </div>
                {/* <div className="w-full flex flex-row mt-2">
                  <span className="text-white text-[10px] w-[30px]">{item.item_name}</span>
                  <span className="text-[10px] text-center text-line-wrap">{item.item_cost} AKA</span>
                </div>
                <p className="text-[12px] text-x-wrap no-scrollbar" style={{width: "90px", height: "35px", marginLeft: "1px"}}>
                  아이템 설명ddddd
                </p> */}
              </div>
            </div>
          </Tooltip>
        ))}
      {/* 선택된 아이템의 액션 버튼 */}
      {selectedItem && (
        <div
          className={`fixed bg-white p-2 rounded shadow-lg flex flex-col space-y-2 z-50`}
          style={{
            top: `${selectedItem.position.y + window.scrollY - 10}px`, // 아이템의 오른쪽 아래로 위치
            left: `${selectedItem.position.x + window.scrollX - 10}px`,
          }}
        >
          <button className="text-blue-500" onClick={() => handleAction("use")}>
            구매하기
          </button>
          {/* <button className="text-red-500" onClick={() => handleAction("delete")}>삭제하기</button> */}
        </div>
      )}
    </div>
  );
}
