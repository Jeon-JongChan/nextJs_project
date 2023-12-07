import server from "/scripts/server";
import selectq from "/scripts/query/select";
import {devLog} from "/scripts/common";
import {sseInsertMessage, sseGetMessage} from "/scripts/server/sseServer";
import puppeteer from "puppeteer";

let browser = null;
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
    devLog("==================================== macro interpark : ", url, browser);

    try {
        // Puppeteer 브라우저 시작
        if (browser === null) browser = await puppeteer.launch({headless: false}); // headless: true로 변경하여 화면 표시를 하지 않을 수 있습니다.
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
        const isNotLogged = await page.evaluate(() => {
            const logoutButton = document.querySelector(".gatewayLogout"); // 로그인 버튼의 선택자를 적절하게 변경해야 합니다.
            return logoutButton === null;
        });

        devLog("========= macro interpark : 로그인 버튼 여부 확인 : ", isNotLogged);

        // 로그인되어 있지 않으면 로그인 처리
        if (isNotLogged) {
            await page.goto("https://ticket.interpark.com/Gate/TPLogin.asp");
            await page.waitForSelector("footer");
            const frame = (await page.frames())[1];

            frame.evaluate(() => {
                document.querySelector("#userId").value = "loki3773";
                document.querySelector("#userPwd").value = "tpdlqj31";
                document.querySelector("#saveSess").click();
                document.querySelector("#btn_login").click();
            });

            // 네비게이션 작동
            await page.waitForNavigation();
            await page.goto(url);
        }

        // 매크로 작업 수행 - 예: 티켓 예매
        /*
        // 여기에서 필요한 작업을 수행하세요.

        // 브라우저 종료
        await browser.close();
*/
    } catch (error) {
        console.error(error);
        // await browser.close();
    }
}
