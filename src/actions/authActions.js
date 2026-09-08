"use server";

import apiRequest from "@/api/client";
import { cookies } from 'next/headers';

/**
 * Crée un nouveau compte utilisateur.
 * @param {Object} body
 * @param {string} body.name - Nom de l'utilisateur (requis)
 * @param {string} body.email - Email de l'utilisateur (requis)
 * @param {string} body.password - Mot de passe, 6 caractères minimum (requis)
 * @param {string} [body.picture] - URL de la photo de profil
 * @param {"owner"|"client"} [body.role] - Rôle demandé (fallback 'client' côté serveur si absent/invalide)
 * @returns {Promise<{token: string, user: {id: string, name: string, email: string, picture: string, role: string}}>}
 */
export async function registerAction(body) {
  return apiRequest("POST", "/auth/register", body);
}

/**
 * Connecte un utilisateur existant.
 * @param {Object} body
 * @param {string} body.email - Email de l'utilisateur (requis)
 * @param {string} body.password - Mot de passe (requis)
 * @returns {Promise<{token: string, user: Object}>}
 */
export async function loginAction(body) {
  return apiRequest("POST", "/auth/login", body);
}

/**
 * Déclenche une demande de réinitialisation de mot de passe.
 * @param {Object} body
 * @param {string} body.email - Email de l'utilisateur (requis)
 * @returns {Promise<{ok: boolean, message: string, token: string}>} `token` uniquement présent si NODE_ENV !== 'production'
 */
export async function requestResetAction(body) {
  return apiRequest("POST", "/auth/request-reset", body);
}

/**
 * Réinitialise le mot de passe à partir d'un token de reset.
 * @param {Object} body
 * @param {string} body.token - Token de réinitialisation (requis)
 * @param {string} body.password - Nouveau mot de passe, 6 caractères minimum (requis)
 * @returns {Promise<Object|null>}
 */
export async function resetPasswordAction(body) {
  return apiRequest("POST", "/auth/reset-password", body);
}

/**
 * Déconnecte l'utilisateur en supprimant les cookies de session.
 * @returns {Promise<void>}
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('userId');
}