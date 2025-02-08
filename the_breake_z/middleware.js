import {NextResponse} from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  let host = process.env.NEXT_PUBLIC_HOST;
  let admin = process.env.NEXT_ADMIN;
  let users = [process.env.NEXT_ADMIN || "qwer", process.env.NEXT_USER1 || "qwer1", process.env.NEXT_USER2 || "qwer2", process.env.NEXT_USER3 || "qwer3"];
  let authkey = request.cookies.get("authkey");
  // console.log(" >>>>>>>>>>>>>    middleware :", users);
  console.log("authkey : ", authkey, host, request.url, request.nextUrl.pathname);
  if (!authkey && !(request.nextUrl.pathname == "/auth")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  } else if (users.includes(authkey)) {
    if (request.nextUrl.pathname == "/dbadmin") {
      if (authkey === admin) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
