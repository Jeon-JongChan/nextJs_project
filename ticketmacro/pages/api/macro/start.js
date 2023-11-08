import server from "/scripts/server";
import insertq from "/scripts/query/insert";
import {devLog} from "/scripts/common";
import {sseInsertMessage, sseGetMessage} from "/scripts/server/sseServer";
// import puppeteer from "puppeteer";

export default async function handler(req, res) {
    // 클라이언트로 보낼 메시지
    let query = req.query;

    if (query.state == "test") {
    }
}

async function interpark(sseId) {
    const LOGIN_URL = "https://www.interpark.com/malls/index.html";
    const TICKET_URL = "https://www.interpark.com/malls/index.html";

    try {
        // Puppeteer 브라우저 시작
        const browser = await puppeteer.launch({headless: false}); // headless: true로 변경하여 화면 표시를 하지 않을 수 있습니다.
        const page = await browser.newPage();

        // 인터파크 페이지 열기
        await page.goto(LOGIN_URL);

        // 로그인 여부 확인
        const isLogged = await page.evaluate(() => {
            const loginButton = document.querySelector("#loginButton"); // 로그인 버튼의 선택자를 적절하게 변경해야 합니다.
            return loginButton === null;
        });

        if (!isLogged) {
            // 로그인되어 있지 않으면 로그인 처리
            await page.type("#username", "your_username"); // 사용자 이름 입력란 선택자와 실제 사용자 이름으로 변경해야 합니다.
            await page.type("#password", "your_password"); // 비밀번호 입력란 선택자와 실제 비밀번호로 변경해야 합니다.
            await page.click("#loginButton"); // 로그인 버튼 선택자로 변경
            await page.waitForNavigation();
        }

        // 매크로 작업 수행 - 예: 티켓 예매
        await page.goto(TICKET_URL);

        // 여기에서 필요한 작업을 수행하세요.

        // 브라우저 종료
        await browser.close();

        res.status(200).json({success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: error.message});
    }
}
