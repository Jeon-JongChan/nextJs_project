"use client";
import React, {useState, useEffect, useRef} from "react";

/**
 * 자동완성 컴포넌트
 *
 * @param {Array} data - 자동완성에 사용할 데이터 목록 (예: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }])
 * @param {string} id - input 요소의 ID
 * @param {function} onSelect - 선택된 항목을 처리할 콜백 함수 (선택된 항목의 id나 전체 데이터를 전달)
 * @param {number} [height=40] - 드롭다운 높이 (기본값 40px)
 */
export default function Autocomplete({data, id, onSelect, autokey = "name", height = 40, maxVisibleItem = 5}) {
  let inputElement = null;
  const dropdownRef = useRef(null);
  const [inputValue, setInputValue] = useState(""); // 입력값
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 드롭다운 표시 여부
  const [dropdownWidth, setDropdownWidth] = useState(0); // 드롭다운의 넓이
  const [isItemSelected, setIsItemSelected] = useState(false); // 항목 선택 여부

  // id가 변경되면 input에 이벤트 리스너를 추가하는 effect
  useEffect(() => {
    try {
      inputElement = document.querySelector(id);
      // console.log("Autocomplete.js useEffect", id, inputElement, data);
      if (inputElement && data?.length > 0) {
        // input 요소의 넓이를 설정

        setDropdownWidth(inputElement.offsetWidth);

        const handleInputChange = (e) => {
          e.preventDefault();
          const value = e.target.value;
          setInputValue(value);

          // 입력값에 맞게 필터링
          // prettier-ignore
          const filtered = data.filter(item => {
          let name = item?.[autokey];
          return name.toLowerCase().includes(value)
        });
          console.log("Autocomplete.js --> ", value, data, filtered, data[0]?.[autokey].normalize("NFD"), data[0]?.[autokey].includes(value));
          setFilteredData(filtered);
          setIsDropdownVisible(filtered.length > 0 && value.trim() !== ""); // 입력값이 있을 때만 드롭다운 표시
          setIsItemSelected(false); // 입력값이 변경되면 항목 선택 상태 초기화
        };

        const handleBlur = () => {
          if (!isItemSelected) {
            setTimeout(() => setIsDropdownVisible(false), 200);
          }
        };

        // 이벤트 리스너 추가
        inputElement.addEventListener("input", handleInputChange);
        inputElement.addEventListener("blur", handleBlur);

        // 드롭다운을 input의 하위 DOM으로 이동

        inputElement.parentNode.insertBefore(dropdownRef.current, inputElement.nextSibling);

        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
          inputElement.removeEventListener("input", handleInputChange);
          inputElement.removeEventListener("blur", handleBlur);
        };
      }
    } catch (e) {
      console.log("Autocomplete.js --> ", e);
    }
  }, [data, id]);

  // 항목을 선택했을 때
  const handleItemClick = (e, item) => {
    e.preventDefault();
    const inputElement = document.querySelector(id);
    if (inputElement) {
      inputElement.value = e.target.innerText; // 입력값을 선택된 항목으로 설정
    }
    setIsDropdownVisible(false); // 드롭다운 숨기기
    setIsItemSelected(true); // 항목 선택 상태 설정
    if (onSelect) onSelect(item); // 선택된 항목을 콜백으로 전달
  };

  return (
    <div className="relative autocomplete" ref={dropdownRef}>
      {isDropdownVisible && filteredData.length > 0 && (
        <ul
          className="absolute left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-auto z-10"
          style={{
            width: `${dropdownWidth}px`, // input의 넓이를 기준으로 드롭다운 넓이 설정
            maxHeight: `${height * ((filteredData?.length || 0) > maxVisibleItem ? maxVisibleItem : filteredData?.length || 0)}px`, // 드롭다운 최대 높이
          }}
        >
          {filteredData.map((item) => (
            <li
              key={`${item?.[autokey]}-${item.id}`}
              onClick={(e) => handleItemClick(e, item)} // 항목 클릭 시 처리
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {item?.[autokey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
