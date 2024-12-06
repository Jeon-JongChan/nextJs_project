import React, {useState, useEffect} from "react";

// Tooltip 컴포넌트
const Tooltip = ({children, content, css = "", tooltipCss = "", style = {}, reverse = false}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    setIsReverse(reverse);
  }, [reverse]);

  return (
    <div className={"tooltip-container " + css} style={style} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {isVisible && content && (
        <div className={"tooltip " + tooltipCss} style={{bottom: isReverse ? "auto" : "110%", top: isReverse ? "110%" : "auto"}}>
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
          background-color: #333;
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
          left: 50%;
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
