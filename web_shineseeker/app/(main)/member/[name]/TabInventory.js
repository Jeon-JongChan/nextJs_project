"use client";
import {useState, useEffect, useRef} from "react";
import {devLog} from "@/_custom/scripts/common";
// import Tooltip from "@/_custom/components/_common/Tooltip";
import Tooltip from "@/_custom/components/_common/TooltipFixed";
import MailModal from "./MailModal";
import NotificationModal from "@/_custom/components/NotificationModal";
import {getImageUrl, logSave} from "@/_custom/scripts/client";
import {update} from "@/_custom/scripts/sqlite3-query";

export default function Component(props) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [noti, setNoti] = useState(null);

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
      item: item.item_name,
      item_consumable: item.item_consumable,
      item_type: item.item_type,
      item_etc: item.item_etc,
      updated: item.updated,
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
      formData.append("item_etc", selectedItem.item_etc);
      formData.append("item_type", selectedItem.item_type);
      formData.append("updated", selectedItem.updated);

      logSave(props.currentUser, "member", `아이템 사용 : ${selectedItem.item}`);
      fetch("/api/page", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => devLog(data))
        .catch((error) => console.error("TabInventory(handleAction) using Item Error:", error));
    } else if (action === "delete") {
      devLog("아이템 삭제:", selectedItem.item);
    }
    setSelectedItem(null);
  };

  const handleBlur = (event) => {
    if (event.relatedTarget) return;
    if (selectedItem && selectedItem.item) {
      devLog("아이템 선택 해제:", event, event.relatedTarget);
      setSelectedItem(null);
    }
  };
  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 선택 버튼 띄우기 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 설명 변경 모달 부분 변수 및 함수 <<<<<<<<<<<<*/
  const mailModal = useRef(null);
  const submitMail = (item, mail, recipient) => {
    devLog(
      "submitMail",
      item,
      items.filter((_, i) => i == item.index),
      mail,
      recipient
    );
    setItems((prevItems) => prevItems.filter((_, i) => i !== item.index));
    // 서버에 변경사항 저장
    const formData = new FormData();
    formData.append("apitype", "member_use_mail");
    formData.append("userid", recipient);
    formData.append("recipient", props.currentUser);
    formData.append("item_name", item.item);
    formData.append("mail", mail);
    fetch("/api/page", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        devLog(data);
        setNoti("메세지를 보냈습니다");
      })
      .catch((error) => console.error("TabStatus(handleChoiceAction) change spell Error:", error));

    setSelectedItem(null);
  };
  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 설명 모달 변수 및 함수 끝 >>>>>>>>>>>>>*/

  const getItemData = (name) => {
    if (props?.items) {
      let item = props.items.find((item) => item.item_name === name);
      // devLog("TabInventory getItenImage", name, item);
      return item ? item : null;
    }
  };

  useEffect(() => {
    devLog("TabInventory useEffect", props);
    let itemArr = [];
    if (props?.user?.items?.length) {
      props.user.items.forEach((item) => {
        let itemData = getItemData(item);
        if (itemData) itemArr.push(itemData);
      });
    }
    // 있는 메일을 아이템화 시켜주기
    if (props.user?.mails?.length) {
      props.user.mails.forEach((mail) => {
        itemArr.push({
          item_name: mail.item_name + " - 사용된 우편",
          item_img_0: mail.item_img_0,
          item_consumable: "O",
          item_type: mail.item_type,
          updated: mail.updated,
          item_desc: `${mail.mail}

보내는 이 : ${mail.recipient}
시간 : ${new Date(mail.updated).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            hour12: false,
          })}`,
        });
      });
    }
    setItems(itemArr);
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
    <div className="relative flex flex-col w-full px-6 py-2">
      <h1 className="relative text-[16px] text-white mb-2 mt-4">인벤토리</h1>
      <div
        className={`relative flex flex-wrap gap-1 drop-parent overflow-x-hidden overflow-y-auto h-[268px]  ${items.length <= 18 ? "flex-1 max-w-[500px]" : "w-[510px] max-w-[510px]"}`}
        draggable="true"
        onDragOver={dragOver}
        onDrop={parentDrop}
      >
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
                css={"flex relative"}
                // reverse={index < 6 || item.item_desc.length > 50 ? true : false}
                tooltipCss="min-w-[150px]"
                maxWidth={350}
                baseLeft={60}
              >
                <div
                  className="relative img-member-init img-member-tab-imagebox flex justify-center items-center cursor-move inventory-item ml-2"
                  style={{widht: "70px", height: "70px"}}
                  tabIndex={0} // 포커스 가능하도록 설정
                  onBlur={handleBlur} // 외부 클릭 시 선택 해제
                  onClick={(e) => handleItemSelect(e, {index: index, ...item})} // 아이템 클릭 시 상태 업데이트
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
      <MailModal ref={mailModal} title={"메세지 입력 창"} onButtonClick={submitMail} />
      {noti && <NotificationModal message={noti} onClose={() => setNoti(null)} />}
      {/* 선택된 아이템의 액션 버튼 */}
      {selectedItem && (
        <div
          className={`fixed bg-white p-2 rounded shadow-lg flex flex-col space-y-2 z-50`}
          style={{
            top: `${selectedItem.position.y + window.scrollY - 10}px`, // 아이템의 오른쪽 아래로 위치
            left: `${selectedItem.position.x + window.scrollX - 10}px`,
          }}
        >
          {selectedItem.item_type === "우편" && (
            <button
              className="text-black-500"
              onClick={() => {
                mailModal.current.openModal(selectedItem);
                setSelectedItem(null);
              }}
            >
              메세지 보내기
            </button>
          )}
          <button className="text-blue-500" onClick={() => handleAction("use")}>
            사용하기
          </button>
          {/* <button className="text-red-500" onClick={() => handleAction("delete")}>삭제하기</button> */}
        </div>
      )}
    </div>
  );
}
