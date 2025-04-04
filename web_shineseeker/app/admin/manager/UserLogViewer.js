import React, {useState} from "react";

const LogViewer = ({logs, onInitButton = null}) => {
  const [selectedPage, setSelectedPage] = useState("all");

  // 드롭다운 선택 변경 핸들러
  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  // 필터링된 로그 데이터
  const filteredLogs = selectedPage === "all" ? logs : logs.filter((log) => log.page === selectedPage);

  // 페이지 목록 가져오기
  const pages = Array.from(new Set(logs.map((log) => log.page)));

  return (
    <div className="w-full px-1 font-nexon">
      {/* 드롭다운 */}
      <div className="mb-1">
        <label htmlFor="page-select" className="block mb-2 font-semibold text-gray-700">
          페이지 선택:
        </label>
        <select id="page-select" value={selectedPage} onChange={handlePageChange} className="w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">전체</option>
          {pages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        <button className="flex-1 w-1/3 border rounded-md bg-indigo-600 hover:bg-indigo-700 text-white h-[36px]" onClick={onInitButton ? (e) => onInitButton(e, selectedPage) : null}>
          초기화
        </button>
      </div>

      {/* 로그 목록 */}
      <div className="max-h-screen overflow-y-auto border border-gray-300 rounded-md py-4 px-1 bg-white">
        {filteredLogs.map((log, index) => (
          <div key={index} className="flex flex-col justify-between items-center mb-2 p-2 bg-gray-100 rounded-md last:mb-0">
            <div className="flex">
              <span className="font-semibold text-gray-800 mr-1">[{log.page}]</span>
              <span className="text-gray-600">{log.log}</span>
            </div>
            <span className="text-gray-600">{new Date(log.updated).toLocaleString()}</span>
          </div>
        ))}
        {filteredLogs.length === 0 && <div className="text-center text-gray-500 mt-4">로그 데이터가 없습니다.</div>}
      </div>
    </div>
  );
};

export default LogViewer;
