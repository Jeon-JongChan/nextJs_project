export default function Admin() {
  return (
    <>
      <div id="admin">
        <div className="frame" style={{ minHeight: "100px" }}>
          <article style={{ width: "100%" }}>
            <h1 className="list-header">포켓몬 지역별 등록 검색창</h1>
            <div className="local-search">
              <input id="input-search" className="input-text" type="text" />
              <button
                className="search-btn"
                onClick={() => searchLocalPoketmon()}
              >
                검색
              </button>
            </div>
            <div className="search-list"></div>
          </article>
        </div>
        <div className="frame">
          <article className="article-left">
            <h1 className="list-header">포켓몬 리스트</h1>
            <div className="poketmon-list"></div>
          </article>
          <article className="article-center input-item">
            <section className="add-poketmon">
              <div className="additem add-poketname">
                <label htmlFor="p-add-name" className="add-header">
                  포켓몬 이름 :
                </label>
                <input className="input-text" id="p-add-name" type="text" />
              </div>
              <div className="additem add-poketimage">
                <label className="add-header">이미지 :</label>
                <div className="input-file">
                  <input id="image-poketmon" type="file" />
                </div>
              </div>
              <div className="additem add-local">
                <label htmlFor="p-add-local" className="add-header">
                  출몰지 :
                </label>
                <input className="input-text" id="p-add-local" type="text" />
              </div>
              <div className="additem add-rare">
                <label className="add-header">출현율 :</label>
                <input className="input-text" type="number" />
              </div>
              <div className="additem add-poket-type">
                <label htmlFor="p-add-type" className="add-header">
                  포켓몬 타입 :
                </label>
                <input className="input-text" id="p-add-type" type="text" />
              </div>
              <div className="additem add-personal">
                <label htmlFor="p-add-personal" className="add-header">
                  포켓몬 특성1 :
                </label>
                <input className="input-text" id="p-add-personal" type="text" />
              </div>
              <div className="additem add-personal">
                <label htmlFor="p-add-personal2" className="add-header">
                  포켓몬 특성2 :
                </label>
                <input
                  className="input-text"
                  id="p-add-personal2"
                  type="text"
                />
              </div>
              <div className="additem add-personal">
                <label htmlFor="p-add-hidden" className="add-header">
                  숨겨진 특성 :
                </label>
                <input className="input-text" id="p-add-hidden" type="text" />
              </div>
            </section>
            <div className="buttons">
              <button id="add-poketmon-btn" onClick={() => addPoketmon()}>
                추가
              </button>
            </div>
          </article>
        </div>
        <div className="frame">
          <article className="article-left">
            <h1 className="list-header">
              출몰 지역 참조 리스트{" "}
              <span className="help-text">
                숫자는 지역에 존재하는 포켓몬 수
              </span>
            </h1>
            <div className="local-list"></div>
          </article>
          <article className="article-center input-item">
            <section className="add-poketmon">
              <div className="additem add-local-name">
                <label className="add-header">포켓몬 출몰지 :</label>
                <input className="input-text" type="text" />
              </div>
            </section>
            <div className="buttons">
              <button id="add-spec-btn" onClick={() => addLocal()}>
                추가
              </button>
            </div>
          </article>
        </div>
        <div className="frame">
          <article className="article-left">
            <h1 className="list-header">포켓몬 성격 리스트</h1>
            <div className="spec-list"></div>
          </article>
          <article className="article-center input-item">
            <section className="add-poketmon">
              <div className="additem add-spec-name">
                <label className="add-header">포켓몬 성격 :</label>
                <input className="input-text" type="text" />
              </div>
            </section>
            <div className="buttons">
              <button id="add-spec-btn" onClick={() => addSpec()}>
                추가
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
