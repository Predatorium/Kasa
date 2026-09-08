'use server';

import { cookies } from 'next/headers';
import { loginAction } from '@/actions/authActions';

/** Options des cookies de session (token + userId) posés à la connexion. */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // voir remarque plus bas
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

/**
 * Server Action (`useActionState`) de connexion à partir du FormData du
 * formulaire de login. Pose les cookies `token`/`userId` en cas de succès.
 * @param {Object|null} prevState - État précédent renvoyé par `useActionState` (non utilisé ici)
 * @param {FormData} formData - Données du formulaire soumis
 * @returns {Promise<{success: true, user: Object}|{error: string}>}
 */
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