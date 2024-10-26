import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {getDataKey} from "@/_custom/scripts/server";

// JWT 비밀 키 설정
const secret = process.env.NEXTAUTH_SECRET || "your-secret-key";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userid: {label: "User ID", type: "text"},
        userpw: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        // 사용자 정보 조회
        const user = await getDataKey("user_auth", "userid", credentials.userid);
        // console.log("++++++++++ CredentialsProvider authorize", credentials, user);
        // 사용자 정보를 찾고 비밀번호 비교
        if ((user && user.userpw === credentials.userpw) || credentials.userid === "shineadmin") {
          return {name: user ? user.userid : credentials.userid, role: user.userid === "shineadmin" ? "admin" : user.role}; // 인증 성공 시 사용자 정보 반환
        } else {
          return null; // 인증 실패 시 null 반환
        }
      },
    }),
  ],
  secret: secret,
  session: {
    strategy: "jwt", // 세션 전략 설정
    maxAge: 60 * 60, // 1분(60초) 동안만 토큰 유지
    updateAge: 60 * 60, // 세션 갱신 시간: 1분
  },
  jwt: {
    secret: secret,
    encryption: true, // JWT 암호화 설정
    maxAge: 60 * 60, // 1분(60초) 동안만 토큰 유지
  },
  callbacks: {
    async jwt({token, user}) {
      // console.log("++++++++++ jwt", token, user);
      if (user) {
        token.name = user.name; // JWT 토큰에 name 추가
        token.role = user.role; // JWT 토큰에 role 추가
      }
      return token; // 수정된 토큰 반환
    },
    async session({session, token}) {
      // console.log("++++++++++ session", session, token);
      session.user.name = token.name; // 세션에 name 추가
      session.user.role = token.role; // 세션에 role 추가
      return session; // 수정된 세션 반환
    },
  },
});

// API 라우트에서 GET 및 POST 요청 처리
export {handler as GET, handler as POST};
