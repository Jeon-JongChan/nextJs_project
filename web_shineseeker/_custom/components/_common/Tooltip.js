import React, {useState} from "react";

// Tooltip 컴포넌트
const Tooltip = ({children, content, css = "", style = {}}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={"tooltip-container " + css} style={style} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && content && <div className="tooltip">{content}</div>}
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip {
          visibility: ${isVisible ? "visible" : "hidden"};
          opacity: ${isVisible ? "1" : "0"};
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 5px;
          position: absolute;
          z-index: 100;
          bottom: 125%; /* Position above the element */
          left: 50%;
          margin-left: -60px; /* Center the tooltip */
          transition: opacity 0.3s;
        }
        .tooltip::after {
          content: "";
          position: absolute;
          top: 100%; /* At the bottom of the tooltip */
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }
      `}</style>
    </div>
  );
};

export default Tooltip;
/* 사용 예시
const App = () => (
  <div>
    <Tooltip content="This is a tooltip!">
      <button>Hover me</button>
    </Tooltip>
  </div>
);
*/
