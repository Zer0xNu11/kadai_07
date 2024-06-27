import { auth } from '@/auth';

export default async function User () {
  const session = await auth();
  const name = session?.user?.name;
  const email = session?.user?.email;
  return (
    <main>
        mypage
    <div>
      <div>{`ようこそ ${name}`}</div> 
      <div>{email}</div>

    </div>
    </main>
    
  );
}