import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import { prismadb } from "./globals/db";
import { DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from "./routes";


export const authConfig= {
  pages: {
    signIn: '/login',
  },
  basePath: '/api/auth',    
  adapter: PrismaAdapter(prismadb),
  session:{strategy: 'jwt'}, //JWT利用によりサーバーメモリ節約
  callbacks: { 

    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },

    authorized({request, auth}){ //認証前後の制約について設定する request情報 auth認証情報オブジェクト 
      const isLoggedIn = !!auth?.user; //ログインしているかどうかチェック
      const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
      const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

       //ルートフォルダ以外のページにログインしていない時アクセスすると拒否
         if (!isPublicRoute && !isLoggedIn) {
          return false;
        }

      //ログイン、レジスターのサイト訪問時に、
      if (isAuthRoute) {
        //ログイン済みの時リダイレクト
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl));
        }

        return true;
      }

      

      try{
        const {pathname} = request.nextUrl; //nextUrl 現在のリクエストのURL情報を表すオブジェクトからpathname(=URL)を分割代入
        if(pathname === '/mypage') return !!auth;
        return true;

      }catch(err){
        console.log(err);
      }
    },

  },
  providers: [],
}satisfies NextAuthConfig;