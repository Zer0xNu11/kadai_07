import { auth, signIn } from "@/auth";
import { prismadb } from "@/globals/db";
import React from "react";

const OauthButton = async () => {
  const session = await auth();
  return (
      <form action={async()=> {
      'use server';
      await signIn()
      }}>

      <button className="mt-8 w-full rounded-lg bg-red-500 text-white h-10 hover:bg-red-400 focus-visible:outline-offset-2">
        他のアカウントでサインアップ
      </button>
      </form>
  );
};

export default OauthButton;
