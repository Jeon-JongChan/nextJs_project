import React, {useState} from "react";

const LogViewer = ({logs}) => {
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
    <div className="max-w-md mx-auto">
      {/* 드롭다운 */}
      <div className="mb-4">
        <label htmlFor="page-select" className="block mb-2 font-semibold text-gray-700">
          페이지 선택:
        </label>
        <select id="page-select" value={selectedPage} onChange={handlePageChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">전체</option>
          {pages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>

      {/* 로그 목록 */}
      <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4 bg-white">
        {filteredLogs.map((log, index) => (
          <div key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-md last:mb-0">
            <span className="font-semibold text-gray-800">[{log.page}]</span>
            <span className="text-gray-600">{log.log}</span>
          </div>
        ))}
        {filteredLogs.length === 0 && <div className="text-center text-gray-500 mt-4">로그 데이터가 없습니다.</div>}
      </div>
    </div>
  );
};

export default LogViewer;
