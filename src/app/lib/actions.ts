'use server';
//use server しないとbcrypt でエラーが出る

import { signUpSchema } from '@/app/lib/schemas';
import { signIn, signOut } from '@/auth';
import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '../db/user';
import { prismadb } from '@/globals/db';

export type SignUpState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function signUp(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
//safeParse エラーを投げずに出力する
  const validatedFields = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors, //flatten ネストされたエラー構造を平坦化
      message: '入力項目が足りません。',
    };
  }

  const {name, email, password } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const existingUser = await getUserByEmail(email); //DB上にそんざいするか確認

    if (existingUser) {
      return {
        message: 'このメールアドレスはすでに使用されています',
      };
    }

    await prismadb.user.create({
      data: {
        username: name,
        email: email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    throw error;
  }

  redirect('/login');
}

export async function login(formData: FormData) {
  try {
    await signIn('credentials', formData); //signIn nextAuthの関数 credentials プロバイダーの種類
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }

    throw error;
  }
  redirect('/mypage');
}



export async function logout() {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
}


// export async function loginByOAuth(){
//     const existingUser = await prismadb.user.findUnique({
//       where:{email:user.email}
//     })
//   try{
//     //新規ユーザーの場合
//     if (!existingUser) {
//       await prismadb.user.create({
//         data: {
//           name: user.name,
//           email: user.email,
//           image: user.image,
//         },
//       })
//       return true

//     }else{ //既存ユーザーの場合
//       await prismadb.user.update({
//         where: { id: existingUser.id },
//         data: {
//         name: profile.name,
//         image: profile.picture,
//         },
//       })
//     } 
//     return true
//   }catch (error) {
//       throw error;
//     }
//   };