import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import { prismadb } from "./globals/db";


export const authConfig= {
  basePath: '/api/auth',    
  adapter: PrismaAdapter(prismadb),
  session:{strategy: 'jwt'}, //JWT利用によりサーバーメモリ節約
  callbacks: { 

    authorized({request, auth}){ //認証前後の制約について設定する request情報 auth認証情報オブジェクト 
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