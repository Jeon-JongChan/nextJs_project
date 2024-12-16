import {devLog} from "@/_custom/scripts/common";
import React, {useState, useEffect} from "react";

// Tooltip 컴포넌트
const Tooltip = ({children, content, css = "", tooltipCss = "", style = {}, reverse = false, maxWidth = 450, baseLeft = 50, fixWidth = null, fixLeft = null}) => {
  const [width, setWidth] = useState(150);
  const [left, setLeft] = useState(baseLeft);
  const [isVisible, setIsVisible] = useState(false);
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    setIsReverse(reverse);
    setLeft(baseLeft);
    let tempWidth = 150;
    let tempLeft = baseLeft;
    if (content?.props?.children?.length) {
      let target = content.props.children;
      // 배열인지 텍스트인지 구분 후 글씨 개수가 30개 이상일경우 최대한도 400px 기준으로 크기를 강제 조절
      let textLength = Array.isArray(target) ? target.reduce((maxLength, str) => Math.max(maxLength, str.length || 0), 0) : target.length;
      // devLog("Tooltip content:", target, textLength);
      let multiple = Math.floor(textLength / 30) ? Math.floor(textLength / 30) : 1;
      tempWidth = 150 * multiple > maxWidth ? maxWidth : 100 * multiple;
      let leftMinus = multiple < 4 ? 10 * multiple : 35;
      tempLeft = baseLeft - leftMinus;
    }
    // 고정 값 있을경우 적용
    if (fixWidth) setWidth(fixWidth);
    else if (tempWidth > 150) setWidth(tempWidth);
    else setWidth(150);

    if (fixLeft) setLeft(fixLeft);
    else setLeft(tempLeft);
  }, [content, reverse]);

  return (
    <div className={"tooltip-container " + css} style={style} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {isVisible && content && (
        <div className={`tooltip whitespace-pre-wrap break-all ` + tooltipCss} style={{bottom: isReverse ? "auto" : "110%", top: isReverse ? "110%" : "auto", maxWidth: `${maxWidth}px`, width: `${width}px`}}>
          {content}
        </div>
      )}
      {children}
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip {
          position: absolute;
          visibility: ${isVisible ? "visible" : "hidden"};
          opacity: ${isVisible ? "1" : "0"};
          background-color: rgba(51, 51, 51, 0.9);
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 5px;
          z-index: 100;
          left: 50%;
          margin-left: -60px; /* Center the tooltip */
          transition: opacity 0.3s;
        }
        .tooltip::after {
          content: "";
          position: absolute;
          left: ${left}%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: ${isReverse ? "transparent transparent #333 transparent" : "#333 transparent transparent transparent"};
          top: ${isReverse ? "auto" : "100%"}; /* Move the arrow to the top or bottom */
          bottom: ${isReverse ? "100%" : "auto"}; /* Position arrow depending on the reverse prop */
        }
      `}</style>
    </div>
  );
};

export default Tooltip;
