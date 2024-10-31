"use client";
import {useState, useEffect} from "react";
import Image from "next/image";

export default function Component(props) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [items, setItems] = useState([]);

  const getItemImage = (name) => {
    if (props?.items) {
      let item = props.items.find((item) => item.item_name === name);
      console.log("getItenImage", name, item);
      return item?.item_img_0 || null;
    }
  };

  useEffect(() => {
    console.log("TabInventory useEffect", props);
    if (props?.items?.length) {
      let itemArr = [];
      props.items.forEach((item) => {
        let itemImage = getItemImage(item.item_name);
        if (itemImage) itemArr.push(itemImage);
      });
      setItems(itemArr);
    }
  }, [props]);

  const dragStart = (event) => {
    setDraggedItem(event.currentTarget);
    console.log("DRAG START", event.currentTarget, draggedItem);
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
    console.log("DROP", draggedItem, draggedItem.getBoundingClientRect(), target, target.nextSibling);
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
      console.log("PARENT DROP", event.currentTarget.parentNode, draggedItem, event.currentTarget, event.target);
      event.currentTarget.appendChild(draggedItem);
    }
    // event.currentTarget.appendChild(draggedItem);
  }
  return (
    <div className="flex flex-col w-full px-6 py-2">
      <h1 className="text-[16px] text-white mb-2 mt-4">게임 인벤토리</h1>
      <div className="flex flex-wrap drop-parent" draggable="true" onDragOver={dragOver} onDrop={parentDrop}>
        {items.map((item, index) => (
          <div
            key={index}
            className="relative img-member-init img-member-tab-imagebox flex justify-center items-center cursor-move inventory-item ml-2"
            style={{widht: "70px", height: "70px"}}
            draggable="true"
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            onDragOver={dragOver}
            onDrop={drop}
          >
            <Image src={item} alt="item" width={45} height={45} className="max-h-[45px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
