"use server";

import apiRequest from "@/api/client";

/**
 * Récupère la liste de tous les utilisateurs.
 * Réservé aux admins.
 * @returns {Promise<Array<Object>>}
 */
export async function getUsersAction() {
  return apiRequest("GET", "/api/users");
}

/**
 * Récupère un utilisateur par son identifiant.
 * Réservé à l'utilisateur lui-même ou à un admin.
 * @param {string} id - Identifiant de l'utilisateur
 * @returns {Promise<Object>}
 */
export async function getUserByIdAction(id) {
  return apiRequest("GET", `/api/users/${id}`);
}

/**
 * Crée un nouvel utilisateur.
 * Réservé aux admins.
 * @param {Object} body
 * @param {string} body.name - Nom de l'utilisateur (requis)
 * @param {string} [body.picture] - URL de la photo de profil
 * @param {"owner"|"client"|"admin"} [body.role] - Rôle de l'utilisateur
 * @returns {Promise<Object>}
 */
export async function createUserAction(body) {
  return apiRequest("POST", "/api/users", body);
}

/**
 * Met à jour un utilisateur.
 * Réservé à l'utilisateur lui-même ou à un admin.
 * @param {string} id - Identifiant de l'utilisateur
 * @param {Object} body - Sous-ensemble de { name, picture, role }
 * @returns {Promise<Object>} Échoue en 403 si `role: 'admin'` est demandé par un appelant qui n'est pas lui-même admin
 */
export async function updateUserAction(id, body) {
  return apiRequest("PATCH", `/api/users/${id}`, body);
}