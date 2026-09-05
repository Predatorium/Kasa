'use server';

import { cookies } from 'next/headers';
import { loginAction } from '@/actions/authActions';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // voir remarque plus bas
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export default async function Login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }

  try {
    const result = await loginAction({ email, password });
    const { token, user } = result;

    const cookieStore = await cookies();
    cookieStore.set('token', token, COOKIE_OPTIONS);
    cookieStore.set('userId', user.id, COOKIE_OPTIONS);

    return { success: true, user };
  } catch (err) {
    console.log(err);
    return { error: 'Identifiants incorrects' };
  }
}