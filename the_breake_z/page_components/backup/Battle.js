export default function Battle() {
  return (
    <>
      <div id="battle">
        <div className="first-input">
          <label htmlFor="bname1">선공포켓몬</label>
          <input id="bname1" type="text" defaultValue="" />
          <label htmlFor="bskill1">사용기술</label>
          <input id="bskill1" type="text" defaultValue="" />
          <label htmlFor="bhealth1">현재체력</label>
          <input id="bhealth1" type="number" defaultValue={100} />
          <label htmlFor="bdamage1">데미지상성</label>
          <select defaultValue="3" name="damage" id="bdamage1">
            <option value="0">x0</option>
            <option value="1">x0.25</option>
            <option value="2">x0.5</option>
            <option value="3">x1.0</option>
            <option value="4">x2.0</option>
            <option value="5">x4.0</option>
          </select>
        </div>
        <div className="second-input">
          <label htmlFor="bname2">후공포켓몬</label>
          <input id="bname2" type="text" defaultValue="" />
          <label htmlFor="bskill2">사용기술</label>
          <input id="bskill2" type="text" defaultValue="" />
          <label htmlFor="bhealth2">현재체력</label>
          <input id="bhealth2" type="number" defaultValue={100} />
          <label htmlFor="bdamage2">데미지상성</label>
          <select defaultValue="3" name="damage" id="bdamage2">
            <option value="0">x0</option>
            <option value="1">x0.25</option>
            <option value="2">x0.5</option>
            <option value="3">x1.0</option>
            <option value="4">x2.0</option>
            <option value="5">x4.0</option>
          </select>
        </div>
        <div className="battle-dialoger half-div">
          <button className="generator-btn" onClick={() => genBattleDialog()}>
            전투 데미지 로그 생성기
          </button>
          <button
            className="generator-btn"
            onClick={() => copyToClipBoard(".battle-dialog")}
          >
            Copy
          </button>
          <div className="battle-dialog">
            <div style={{ fontSize: "16px", textAlign: "center" }}>
              💥&nbsp;<span className="bd-name1"></span>의&nbsp;
              <span className="bd-skill1"></span>!<br />
              <span className="bd-effect1"></span>&nbsp;-(
              <span className="bd-damage1"></span>)%
              <br />
              <br />
              💥&nbsp;상대&nbsp;<span className="bd-name2"></span>의&nbsp;
              <span className="bd-skill2"></span>!<br />
              <span className="bd-effect2"></span>&nbsp;-(
              <span className="bd-damage2"></span>)%
              <br />
              <br />
              <span className="bd-name1"></span>&nbsp;: 남은체력&nbsp;
              <span className="bd-health1"></span>%<br />
              <span className="bd-name2"></span>&nbsp;: 남은체력&nbsp;
              <span className="bd-health2"></span>%<br />▶ 다음은 무엇을 할까?
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
