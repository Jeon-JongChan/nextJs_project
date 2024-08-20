"use client";
import {useState} from "react";
import Image from "next/image";

export default function Component() {
  const [draggedItem, setDraggedItem] = useState(null);
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
    <div key="2">
      <h1 className="text-3xl font-bold mb-4">게임 인벤토리</h1>
      <div className="flex flex-wrap drop-parent" draggable="true" onDragOver={dragOver} onDrop={parentDrop}>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          검
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          방패
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          포션
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          지팡이1
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          지팡이2
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          지팡이3
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          지팡이4
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          지팡이5
        </div>
        <div
          className="p-4 bg-gray-200 border border-gray-400 rounded cursor-move inventory-item"
          draggable="true"
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          onDragOver={dragOver}
          onDrop={drop}
        >
          지팡이6
        </div>
      </div>
    </div>
  );
}
