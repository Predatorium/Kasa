"use server";

import apiRequest from "@/api/client";

/**
 * Ajoute un logement aux favoris de l'utilisateur connecté.
 * Auth requise — pas de body, userId récupéré depuis le token.
 * @param {string} propertyId - Identifiant du logement
 * @returns {Promise<Object|null>}
 */
export async function addFavoriteAction(propertyId) {
  return apiRequest("POST", `/api/properties/${propertyId}/favorite`);
}

/**
 * Retire un logement des favoris de l'utilisateur connecté.
 * Auth requise — pas de body, userId récupéré depuis le token.
 * @param {string} propertyId - Identifiant du logement
 * @returns {Promise<Object|null>}
 */
export async function removeFavoriteAction(propertyId) {
  return apiRequest("DELETE", `/api/properties/${propertyId}/favorite`);
}

/**
 * Récupère la liste des favoris d'un utilisateur.
 * Réservé à l'utilisateur lui-même ou à un admin.
 * @param {string} userId - Identifiant de l'utilisateur
 * @returns {Promise<Array<Object>>}
 */
export async function getFavoritesForUserAction(userId) {
  return apiRequest("GET", `/api/users/${userId}/favorites`);
}