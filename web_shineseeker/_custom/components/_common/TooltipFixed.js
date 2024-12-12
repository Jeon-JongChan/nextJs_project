import {devLog} from "@/_custom/scripts/common";
import React, {useState, useEffect, useRef} from "react";

// Tooltip 컴포넌트
const Tooltip = ({children, content, css = "", tooltipCss = "", style = {}, reverse = false, maxWidth = 450, baseLeft = 50}) => {
  const [width, setWidth] = useState(150);
  const [left, setLeft] = useState(baseLeft);
  const [top, setTop] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const tooltipContainerRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // 부모 엘리먼트 위치와 크기 계산
    if (content?.props?.children?.length && tooltipContainerRef.current) {
      let target = content.props.children;
      let textLength = Array.isArray(target) ? target.reduce((maxLength, str) => Math.max(maxLength, str.length || 0), 0) : target.length;
      let multiple = Math.floor(textLength / 30) ? Math.floor(textLength / 30) : 1;
      let tempWidth = 150 * multiple > maxWidth ? maxWidth : 100 * multiple;
      setWidth(tempWidth);

      const {top, left, width: containerWidth, height} = tooltipContainerRef.current.getBoundingClientRect();
      //   const tooltipElement = tooltipContainerRef.current.querySelector(".tooltip");
      const tooltipElement = tooltipRef.current;
      if (tooltipElement) {
        const {height: tooltipHeight} = tooltipElement.getBoundingClientRect(); // 툴팁의 크기
        const tooltipWidth = tempWidth;

        // 툴팁의 위치를 부모 엘리먼트 중심을 기준으로 계산
        setLeft(left + Math.floor((containerWidth - (tooltipWidth < 150 ? 150 : tooltipWidth)) / 2 + 5)); // 부모의 가로 중앙에 툴팁 위치

        if (reverse) {
          setTop(top + height); // 부모 엘리먼트 위에 툴팁 배치 (10px 간격)
        } else {
          setTop(top - (tooltipHeight + 10)); // 부모 엘리먼트 아래에 툴팁 배치 (10px 간격)
        }
        //638 911.5 100     70          82          100             78              900.5
        // devLog("Tooltip position:", tooltipElement, top, left, width, height, tooltipHeight, tooltipWidth, containerWidth, left + Math.floor((containerWidth - tooltipWidth) / 2));
      }
    }
  }, [content]);

  // 높이는 스크롤이 생기면서 변경될 수 있으므로, 계속 갱신
  useEffect(() => {
    if (tooltipContainerRef.current && tooltipRef.current && isVisible) {
      const {top, height} = tooltipContainerRef.current.getBoundingClientRect();
      const tooltipElement = tooltipRef.current;
      const {height: tooltipHeight} = tooltipElement.getBoundingClientRect(); // 툴팁의 크기
      if (reverse) {
        setTop(top + height); // 부모 엘리먼트 위에 툴팁 배치 (10px 간격)
      } else {
        setTop(top - (tooltipHeight + 10)); // 부모 엘리먼트 아래에 툴팁 배치 (10px 간격)
      }
    }
  }, [isVisible]);

  return (
    <div className={"tooltip-container " + css} style={style} ref={tooltipContainerRef} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      <div
        ref={tooltipRef}
        className={`tooltip whitespace-pre-wrap break-all ` + tooltipCss}
        style={{
          visible: isVisible && content ? "visible" : "hidden",
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          maxWidth: `${maxWidth}px`,
          width: `${width}px`,
          zIndex: 1000,
        }}
      >
        {content}
        {isVisible && content && <span className="tooltip-arrow" />}
      </div>
      {children}
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip {
          visibility: ${isVisible ? "visible" : "hidden"};
          opacity: ${isVisible ? "1" : "0"};
          background-color: rgba(51, 51, 51, 0.9);
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 5px;
          transition: opacity 0.3s, transform 0.3s;
        }
        .tooltip-arrow {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-width: 5px;
          border-style: solid;
          border-color: ${reverse ? "transparent transparent #333 transparent" : "#333 transparent transparent transparent"};
          top: ${reverse ? "auto" : "100%"};
          bottom: ${reverse ? "100%" : "auto"};
        }
      `}</style>
    </div>
  );
};

export default Tooltip;
