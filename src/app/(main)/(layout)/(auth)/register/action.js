'use server';

import { cookies } from 'next/headers';
import { registerAction } from '@/actions/authActions';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // voir remarque plus bas
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export default async function Register(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const firstName = formData.get('firstName');
  const name = formData.get('name');
  const role = formData.get('role') ?? 'client'; // nouveau

  if (!email || !password || !firstName || !name) {
    throw new Error('Tous les champs doivent être remplis');
  }

  const fullName = `${firstName} ${name}`;

  try {
    const result = await registerAction({ email, password, name: fullName, role });
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