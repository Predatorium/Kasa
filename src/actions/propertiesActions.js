"use server";

import apiRequest from "@/api/client";

/**
 * Récupère la liste de tous les logements.
 * @returns {Promise<Array<Object>>}
 */
export async function getPropertiesAction() {
  return apiRequest("GET", "/api/properties");
}

/**
 * Récupère un logement par son identifiant.
 * @param {string} id - Identifiant du logement
 * @returns {Promise<Object>}
 */
export async function getPropertyByIdAction(id) {
  return apiRequest("GET", `/api/properties/${id}`);
}

/**
 * Crée un nouveau logement.
 * Réservé aux rôles owner/admin.
 * @param {Object} body
 * @param {string} [body.id]
 * @param {string} body.title - Titre du logement (requis)
 * @param {string} [body.description]
 * @param {string} [body.cover]
 * @param {string} [body.location]
 * @param {number} [body.price_per_night] - Prix par nuit (fallback 80 si absent)
 * @param {string} [body.host_id] - Requis si `host` n'est pas fourni
 * @param {{name: string, picture: string}} [body.host] - Requis si `host_id` n'est pas fourni (picture optionnelle)
 * @param {string[]} [body.pictures] - URLs des photos
 * @param {string[]} [body.equipments] - Noms des équipements
 * @param {string[]} [body.tags] - Noms des tags
 * @returns {Promise<Object>}
 */
export async function createPropertyAction(body) {
  return apiRequest("POST", "/api/properties", body);
}

/**
 * Met à jour un logement existant.
 * Réservé aux rôles owner/admin. Au moins un champ requis, sinon 400.
 * @param {string} id - Identifiant du logement
 * @param {Object} body - Sous-ensemble de { title, description, cover, location, host_id, price_per_night }
 * @returns {Promise<Object>}
 */
export async function updatePropertyAction(id, body) {
  return apiRequest("PATCH", `/api/properties/${id}`, body);
}

/**
 * Supprime un logement.
 * Réservé aux rôles owner/admin.
 * @param {string} id - Identifiant du logement
 * @returns {Promise<null>} La réponse est un 204, `data` vaudra `null`
 */
export async function deletePropertyAction(id) {
  return apiRequest("DELETE", `/api/properties/${id}`);
}