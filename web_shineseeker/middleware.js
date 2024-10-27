import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";

export async function middleware(req) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
  const {pathname} = req.nextUrl;

  // 사용자 권한에 따라 접근 가능한 경로 배열 정의
  const adminRoutes = ["/admin", "/api/admin"];
  const userRoutes = ["/api", "/member", "/market", "/battle"];

  console.log(">>>>>>>>>>>>>>>>>>>>>>> 미들웨어 토큰:", token, pathname);
  if (!token) {
    // JWT 토큰이 없으면 로그인 페이지로 리다이렉트s
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // 관리자(admin) 경로 접근 제어
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/404", req.url)); // 권한 없음 페이지로 리디렉션
    }
  }

  // 일반 사용자(user) 경로 접근 제어
  if (userRoutes.some((route) => pathname.startsWith(route))) {
    if (!(token.role === "user" || token.role === "admin")) {
      return NextResponse.redirect(new URL("/404", req.url)); // 권한 없음 페이지로 리디렉션
    }
  }

  // 나머지는 그대로 진행
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/manager", "/admin/page", "/api/amdin/:path*", "/api/app/:path*", "/market", "/member/:path*", "/battle/:path*"], // 관리 페이지와 사용자 페이지에 적용
};
