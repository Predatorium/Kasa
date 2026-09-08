"use server";

import apiRequest from "@/api/client";

/**
 * Récupère les avis d'un logement.
 * @param {string} propertyId - Identifiant du logement
 * @returns {Promise<Array<Object>>}
 */
export async function getRatingsForPropertyAction(propertyId) {
  return apiRequest("GET", `/api/properties/${propertyId}/ratings`);
}

/**
 * Ajoute un avis sur un logement.
 * @param {string} propertyId - Identifiant du logement
 * @param {Object} body
 * @param {string} body.user_id - Identifiant de l'utilisateur (requis)
 * @param {number} body.score - Note entière entre 1 et 5 (requis)
 * @param {string} [body.comment] - Commentaire optionnel
 * @returns {Promise<{rating_avg: number, ratings_count: number, ratings: Array<Object>}>}
 */
export async function addRatingAction(propertyId, body) {
  return apiRequest("POST", `/api/properties/${propertyId}/ratings`, body);
}