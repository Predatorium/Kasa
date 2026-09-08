'use server';

import { cookies } from 'next/headers';
import { registerAction } from '@/actions/authActions';

/** Options des cookies de session (token + userId) posés à l'inscription. */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // voir remarque plus bas
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

/**
 * Server Action (`useActionState`) d'inscription à partir du FormData du
 * formulaire de register. Concatène prénom/nom et pose les cookies
 * `token`/`userId` en cas de succès.
 * @param {Object|null} prevState - État précédent renvoyé par `useActionState` (non utilisé ici)
 * @param {FormData} formData - Données du formulaire soumis
 * @returns {Promise<{success: true, user: Object}>}
 * @throws {Error} Si l'un des champs requis (email, password, firstName, name) est manquant
 */
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