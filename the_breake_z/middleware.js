import {NextResponse} from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  let host = process.env.NEXT_PUBLIC_DOMAIN;
  let admin = process.env.NEXT_ADMIN;
  let users = [process.env.NEXT_ADMIN || "qwer", process.env.NEXT_USER1 || "qwer1", process.env.NEXT_USER2 || "qwer2", process.env.NEXT_USER3 || "qwer3"];
  let authkey = request.cookies.get("authkey");
  // console.log(" >>>>>>>>>>>>>    middleware :", users);
  // console.log("authkey : ", authkey, host, request.nextUrl.pathname);
  NextResponse.setHeader("Access-Control-Allow-Origin", "*"); // 모든 출처 허용
  NextResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // 허용하는 HTTP 메소드 목록
  NextResponse.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (!authkey && !(request.nextUrl.pathname == "/auth")) {
    return NextResponse.redirect(host + "/auth");
  } else if (users.includes(authkey)) {
    if (request.nextUrl.pathname == "/dbadmin") {
      if (authkey === admin) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(host + "/");
      }
    } else return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
