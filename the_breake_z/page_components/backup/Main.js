export default function Main() {
  return (
    <>
      <div id="main">
        <div className="player-local">
          <label htmlFor="player">플레이어</label>
          <input id="player" type="text" defaultValue="" />
          <label htmlFor="local">지역</label>
          <input id="local" type="text" defaultValue="" />
        </div>
        <div className="selected">
          <label htmlFor="selected-poketmon">선택받은 포켓몬</label>
          <input id="selected-poketmon" type="text" defaultValue="" />
        </div>
        <div className="youtube">
          <label htmlFor="youtube-url">첨부할 유투브 음악 주소</label>
          <input
            id="youtube-url"
            type="text"
            defaultValue="youtu.be/Q9qzH58HtHM"
          />
        </div>
        <div className="plevel">
          <label htmlFor="plevel-min">레벨 최소 범위</label>
          <input id="plevel-min" type="number" defaultValue={1} />
          <label htmlFor="plevel-max">레벨 최대 범위</label>
          <input id="plevel-max" type="number" defaultValue={50} />
        </div>
        <div className="poket-dialog">
          <div className="poketmon-selector half-div">
            <button
              className="generator-btn"
              onClick={() => genPoketSelector()}
            >
              포켓몬 랜덤 생성기
            </button>
            <button
              className="generator-btn"
              onClick={() => copyToClipBoard(".poketmon-select")}
            >
              Copy
            </button>
            <div className="poketmon-select">
              <p style={{ fontSize: "16px" }}>
                ♫<span className="music"></span>
                <br />
                야생의 포켓몬이 나타났어. <span className="player1"></span>...
                <br />
                <br />
                ...누구를 리서치 해볼까 <span className="player2"></span>?<br />
                &#9654;<span className="poket1">돌살이</span>
                <br />
                &#9654;<span className="poket2">끼리동</span>
                <br />
              </p>
              <img id="poket1-img" width="49%" src="" />
              <img id="poket2-img" width="49%" src="" />
            </div>
          </div>
          <div className="poketmon-battler half-div">
            <button className="generator-btn" onClick={() => genPoketBattle()}>
              포켓몬 전투 대사 생성기
            </button>
            <button
              className="generator-btn"
              onClick={() => copyToClipBoard(".poketmon-battle")}
            >
              Copy
            </button>
            <div className="poketmon-battle">
              <p style={{ fontSize: "16px" }}>
                ♫<span className="music"></span>
                <br />
                <br />
                야생의
                <span className="pspec"></span>
                <span className="pname"></span>가 나타났어.
                <br />
                <br />
                Lv.&nbsp;<span className="plevel"></span>&nbsp;[&nbsp;
                <span className="ppersonal"></span>&nbsp;]
                <br />
                <br />
                <span className="player1"></span>는 무엇을 할까?
                <br />
                <br />
                &#9654; 싸운다
                <br />
                &#9654; 대화한다(프렌드볼 전용)
                <br />
                &#9654; 몬스터볼
                <br />
                &#9654; 도망친다
                <br />
              </p>
              <img id="poket-img" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
