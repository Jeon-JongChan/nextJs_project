"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import {devLog} from "@/_custom/scripts/common";
import Tooltip from "@/_custom/components/_common/Tooltip";
import {getImageUrl} from "@/_custom/scripts/client";

export default function Component(props) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [items, setItems] = useState([]);

  /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 선택 버튼 띄우기 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 상태

  const handleItemSelect = (event, item) => {
    event.stopPropagation();
    if (!(props?.user && props?.currentUser && props.user.userid === props.currentUser)) return;
    if (item.item_consumable === "X") return; // 사용불가 아이템일 경우 리턴
    devLog("아이템 선택:", event, event.target, event.clientX, event.clientY, item);
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedItem({
      index: item.index,
      item: item.item,
      item_consumable: item.item_consumable,
      position: {x: rect.right, y: rect.bottom}, // 아이템의 오른쪽 아래 위치
    });
  };

  const handleAction = (action) => {
    if (action === "use") {
      devLog("아이템 사용:", selectedItem.item);
      setItems((prevItems) => prevItems.filter((_, i) => i !== selectedItem.index));
      // 서버에 변경사항 저장
      const formData = new FormData();
      formData.append("apitype", "member_use_item");
      formData.append("item_name", selectedItem.item);
      formData.append("userid", props.currentUser);
      fetch("/api/page", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("TabInventory(handleAction) using Item Error:", error));
    } else if (action === "delete") {
      devLog("아이템 삭제:", selectedItem.item);
    }
    setSelectedItem(null);
  };

  const handleBlur = (event) => {
    if (event.relatedTarget) return;
    devLog("아이템 선택 해제:", event);
    setSelectedItem(null);
  };
  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 선택 버튼 띄우기 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  const getItemData = (name) => {
    if (props?.items) {
      let item = props.items.find((item) => item.item_name === name);
      // devLog("TabInventory getItenImage", name, item);
      return item ? item : null;
    }
  };

  useEffect(() => {
    devLog("TabInventory useEffect", props);
    if (props?.user?.items?.length) {
      let itemArr = [];
      props.user.items.forEach((item) => {
        let itemData = getItemData(item);
        if (itemData) itemArr.push(itemData);
      });
      setItems(itemArr);
    }
  }, [props.user, props.items]);

  const dragStart = (event) => {
    setDraggedItem(event.currentTarget);
    devLog("DRAG START", event.currentTarget, draggedItem);
    // event.dataTransfer.setData("text/plain", id);
    event.currentTarget.style.opacity = "0.5";
  };

  const dragEnd = (event) => {
    event.currentTarget.style.opacity = "1";
  };

  // 드롭될 때 실행되는 이벤트 핸들러
  function dragOver(event) {
    event.preventDefault(); // 기본 동작을 막음
  }

  // 드롭될 때 실행되는 이벤트 핸들러
  function drop(event) {
    event.preventDefault(); // 기본 동작 막기
    const target = event.currentTarget;
    // 드롭 위치에 아이템을 추가
    devLog("DROP", draggedItem, draggedItem.getBoundingClientRect(), target, target.nextSibling);
    if (target.nextSibling === draggedItem) {
      // 바로 이전꺼에 놓으면 위치 교환
      target.parentNode.insertBefore(draggedItem, target);
    } else {
      // 아니면 그냥 뒤에 놓기
      target.parentNode.insertBefore(draggedItem, target.nextSibling);
    }
  }
  function parentDrop(event) {
    event.preventDefault();
    const target = event.target;
    if (!target.classList.contains("inventory-item")) {
      devLog("PARENT DROP", event.currentTarget.parentNode, draggedItem, event.currentTarget, event.target);
      event.currentTarget.appendChild(draggedItem);
    }
    // event.currentTarget.appendChild(draggedItem);
  }
  return (
    <div className="flex flex-col w-full px-6 py-2">
      <h1 className="text-[16px] text-white mb-2 mt-4">게임 인벤토리</h1>
      <div className="flex flex-wrap drop-parent" draggable="true" onDragOver={dragOver} onDrop={parentDrop}>
        {items.map(
          (item, index) =>
            item?.item_img_0 && (
              <Tooltip
                key={`${item.item_name}-${index}`}
                content={
                  <span>
                    {item.item_name}
                    <br />
                    {item.item_desc}
                  </span>
                }
                css={"flex"}
                tooltipCss="min-w-[150px]"
              >
                <div
                  className="relative img-member-init img-member-tab-imagebox flex justify-center items-center cursor-move inventory-item ml-2"
                  style={{widht: "70px", height: "70px"}}
                  tabIndex={0} // 포커스 가능하도록 설정
                  onBlur={handleBlur} // 외부 클릭 시 선택 해제
                  onClick={(e) => handleItemSelect(e, {index: index, item: item.item_name, item_consumable: item.item_consumable})} // 아이템 클릭 시 상태 업데이트
                  draggable="true"
                  onDragStart={dragStart}
                  onDragEnd={dragEnd}
                  onDragOver={dragOver}
                  onDrop={drop}
                >
                  <img src={getImageUrl(item.item_img_0)} alt="item" width={45} height={45} className="max-h-[45px]" />
                </div>
              </Tooltip>
            )
        )}
      </div>
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
            사용하기
          </button>
          {/* <button className="text-red-500" onClick={() => handleAction("delete")}>삭제하기</button> */}
        </div>
      )}
    </div>
  );
}
