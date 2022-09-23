/* next Module */
import Script from "next/script";
/* import component */
import Battle from "/page_components/backup/Battle";
import Main from "/page_components/backup/Main";
import Admin from "/page_components/backup/Admin";

// * react
export default function MyLayout() {
    return (
        <>
            <Script src="/scripts/data.js" defer />
            <Script src="/scripts/public.js" defer />
            <Script src="/scripts/battle.js" defer />
            <Script src="/scripts/main.js" defer />
            <Script src="/scripts/admin.js" defer />
            <nav className="menu">
                <a
                    className="change-menu"
                    style={{ backgroundColor: "rgba(200,0,0,0.3)" }}
                    onClick={() => changeMenu("admin")}
                >
                    ADMIN
                </a>
                <a
                    className="change-menu"
                    style={{ backgroundColor: "rgba(0,200,0,0.3)" }}
                    onClick={() => changeMenu("main")}
                >
                    MAIN
                </a>
                <a
                    className="change-menu"
                    style={{ backgroundColor: "rgba(0,0,200,0.3)" }}
                    onClick={() => changeMenu("battle")}
                >
                    BATTLE
                </a>
            </nav>
            <Battle></Battle>
            <Main></Main>
            <Admin></Admin>

            <template
                dangerouslySetInnerHTML={{
                    __html: `
          <section className="poketmon">
          <div className="poket-img">
            <div className="poket-modal">
              <div className="poket-line">
                <h3 className="poket-name"></h3>
              </div>
              <div className="poket-line">
                <span className="left">타입 :</span>&nbsp;
                <span className="right poket-type"></span>
              </div>
              <div className="poket-line">
                <span className="left">특성 :</span>&nbsp;
                <span className="right poket-personal"></span>
              </div>
              <div className="poket-line">
                <span className="left">히든특성</span>&nbsp;
                <span className="right poket-personal-hidden"></span>
              </div>
              <div className="poket-line">
                <span className="left">지역 :</span>&nbsp;
                <span className="right poket-local"></span>
              </div>
              <div className="poket-line">
                <span className="left">출현율 :</span>&nbsp;
                <span className="right poket-rare"></span>%
              </div>
            </div>
          </div>
          <button
            style={{ width: "100%" }}
            className="delete-btn"
            onClick={() => deletePoketData("poketmon")}
          >
            X
          </button>
        </section>
        <section className="local">
          <span className="local-name"></span>&nbsp;
          <span className="local-count"></span>&nbsp;
          <button className="delete-btn" onClick={() => deletePoketData("local")}>
            X
          </button>
        </section>
        <section className="spec">
          <span className="spec-name"></span>&nbsp;&nbsp;
          <button className="delete-btn" onClick={() => deletePoketData("spec")}>
            X
          </button>
        </section>
        <section className="search">
          <span className="search-name"></span>&nbsp;
        </section>
        `,
                }}
            />

            <style jsx>{`
                .frame {
                    display: flex;
                    flex-direction: row;
                    min-height: 200px;
                }
                article {
                    display: inline-block;
                    /* width: 50%; */
                }
                .article-center {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .article-left {
                    width: 80%;
                }
                .input-item .buttons {
                    margin-left: auto;
                    margin-top: 5px;
                }
                .add-poketmon {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                }
                .list-header {
                    text-align: center;
                }

                .poketmon {
                    text-align: left;
                    margin: 0 10px;
                    width: 150px;
                    display: inline-block;
                }
                .poketmon-list {
                    height: 344px;
                    overflow-y: scroll;
                    border: 1px solid black;
                }
                .poket-img {
                    min-height: 150px;
                    min-width: 150px;
                }
                .additem {
                    display: flex;
                    flex-direction: row;
                    min-width: 300px;
                }
                .additem .input-text {
                    width: 150px;
                    margin-left: auto;
                }
                .input-file {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    max-width: 190px;
                    margin-left: auto;
                }
                .add-header {
                    margin: 0 10px 0 0;
                    font-weight: 700;
                }
                .poket-img {
                    width: 150px;
                    height: 150px;
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .poket-line {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    color: white;
                    font-weight: 700;
                    font-size: 12px;
                }
                .poket-line .left {
                    float: left;
                }
                .poket-line .right {
                    float: right;
                }
                .poket-vertical {
                    display: flex;
                    flex-direction: column;
                }
                .poket-line h3 {
                    margin: 0;
                }
                .poket-modal {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.6);
                    padding-left: 5px;
                    opacity: 0;
                }
                .poket-modal:hover {
                    opacity: 1;
                }

                .spec-list {
                    height: 100px;
                    overflow-y: scroll;
                    border: 1px solid black;
                }
                .spec {
                    display: inline-block;
                    width: 160px;
                }
                .spec button {
                    float: right;
                    margin-right: 5px;
                }
                .local-list {
                    height: 100px;
                    overflow-y: scroll;
                    border: 1px solid black;
                }
                .local {
                    display: inline-block;
                    width: 240px;
                }
                .local button {
                    float: right;
                    margin-right: 5px;
                }

                .help-text {
                    font-size: 10px;
                }
            `}</style>
        </>
    );
}
