'use server';

import { cookies } from 'next/headers';
import { registerAction } from '@/actions/authActions';

export default async function Register(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const firstName = formData.get('firstName');
  const name = formData.get('name');

  if (!email || !password || !firstName || !name) {
    throw new Error('Tous les champs doivent être remplis');
  }

  const fullName = `${firstName} ${name}`;

  try {
    const result = await registerAction({ email, password, name: fullName });
    const { token, user } = result.token;
  
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.REACT_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, //30 jours
    });

    return { success : true, user };
  } catch (err) {
    return { error: 'Identifiants incorrects' };
  }
}