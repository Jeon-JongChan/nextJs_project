import server from "/scripts/server";
import selectq from "/scripts/query/select";
import {devLog} from "/scripts/common";
import {sseInsertMessage, sseGetMessage} from "/scripts/server/sseServer";
import puppeteer from "puppeteer";

export default async function handler(req, res) {
    // 클라이언트로 보낼 메시지
    let query = req.query;

    if (query.state == "test") {
        let data = server.db.prepare(selectq.macro.start).all({site: "interpark"});
        devLog("macro start : ", query.state, " data : ", data);

        data.forEach((element) => {
            interpark(element.URL);
        });
        // await interpark();
    }
}

async function interpark(url) {
    const timeout = 10000;
    devLog("==================================== macro interpark : ", url);

    try {
        // Puppeteer 브라우저 시작
        const browser = await puppeteer.launch({headless: false}); // headless: true로 변경하여 화면 표시를 하지 않을 수 있습니다.
        const page = await browser.newPage();

        // 인터파크 페이지 열기
        await page.goto(url);
        await page.waitForSelector("footer");

        devLog("========= macro interpark : 페이지 열기 성공");
        // 팝업창 닫기
        const closePopup = await page.evaluate(() => {
            const popupCheck = document.querySelector(".popupWrap .popupCheck .popupCheckLabel"); // 팝업창의 선택자를 적절하게 변경해야 합니다.
            const prdGuide = document.querySelector("#popup-prdGuide .popupFooter .popupCloseBtn.is-bottomBtn"); // 로그인 버튼의 선택자를 적절하게 변경해야 합니다.
            if (popupCheck) popupCheck.click();
            if (prdGuide) prdGuide.click();

            return true;
        });

        devLog("========= macro interpark : 팝업창 닫기 성공");

        // 로그인 여부 확인
        const isLogged = await page.evaluate(() => {
            const loginButton = document.querySelector(".gatewayLogout"); // 로그인 버튼의 선택자를 적절하게 변경해야 합니다.
            return loginButton === null;
        });

        devLog("========= macro interpark : 로그인 여부 확인 : ", isLogged);

        if (isLogged) {
            await page.goto("https://ticket.interpark.com/Gate/TPLogin.asp");
            await page.waitForSelector("footer");
            await page.evaluate(() => {
                let contentDocument = document.querySelector("iframe").contentDocument;
                contentDocument.querySelector("#userId").value = "loki3773";
                querySelector.querySelector("#userPwd").value = "tpdlqj31";
            });
            // 로그인되어 있지 않으면 로그인 처리
            // await page.type("#userId", "loki3773"); // 사용자 이름 입력란 선택자와 실제 사용자 이름으로 변경해야 합니다.
            // await page.type("#userPwd", "tpdlqj31"); // 비밀번호 입력란 선택자와 실제 비밀번호로 변경해야 합니다.
            await page.click("#btn_login"); // 로그인 버튼 선택자로 변경
            await page.waitForNavigation();
        }

        // 매크로 작업 수행 - 예: 티켓 예매
        await page.goto(url);
        /*
        // 여기에서 필요한 작업을 수행하세요.

        // 브라우저 종료
        await browser.close();
*/
    } catch (error) {
        console.error(error);
    }
}
