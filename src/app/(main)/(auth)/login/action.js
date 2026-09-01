'use server';

import { cookies } from 'next/headers';
import { loginAction } from '@/actions/authActions';

export default async function Login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }

  try {
    const result = await loginAction({ email, password });
    console.log(result);
    const { token, user } = result.data;

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.REACT_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user };
  } catch (err) {
    return { error: 'Identifiants incorrects' };
  }
}