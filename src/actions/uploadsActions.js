"use server";

import apiRequest from "@/api/client";

/**
 * Upload une image.
 * Réservé aux rôles owner/admin. Envoie du multipart/form-data,
 * incompatible avec le mode JSON classique de `apiRequest`.
 * @param {FormData} formData - Contient le fichier image à uploader
 * @returns {Promise<Object>}
 */
export async function uploadImageAction(formData) {
  return apiRequest("POST", "/api/uploads/image", formData);
}

/**
 * Supprime une ou plusieurs images.
 * Réservé aux rôles owner/admin. Requête JSON classique.
 * @param {Object} body
 * @param {string[]} [body.filenames] - Liste de noms de fichiers à supprimer
 * @param {string[]} [body.urls] - Liste d'URLs à supprimer
 * @param {string} [body.filename] - Nom de fichier unique à supprimer
 * @param {string} [body.url] - URL unique à supprimer
 * @returns {Promise<Object|null>}
 */
export async function deleteImagesAction(body) {
  return apiRequest("DELETE", "/api/uploads/images", body);
}