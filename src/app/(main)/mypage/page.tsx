import React from 'react'
import { auth } from '@/auth';
import { prismadb } from '@/globals/db';

const Mypage = async () => {
  const session = await auth();
  const user = await prismadb.user.findUnique({
    where: { email: session?.user?.email || 'undefined' },
    select: { username: true },
  });
  const email = session?.user?.email;

  return (
    <main>
        mypage
    <div>
      <div>{`ようこそ ${user?.username}`}</div> 
      <div>{email}</div>

    </div>
    </main>
    
  );
}

export default Mypage