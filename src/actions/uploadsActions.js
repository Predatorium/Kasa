"use server";
import apiRequest from "@/api/client";

// Réservé rôle owner/admin — multipart/form-data, incompatible avec apiRequest
export async function uploadImageAction(formData) {
  return apiRequest("POST", "/api/uploads/image", formData);
}

// Réservé rôle owner/admin — JSON classique
export async function deleteImagesAction(body) {
  // body: { filenames: [...] } ou { urls: [...] } ou { filename } ou { url }
  return apiRequest("DELETE", "/api/uploads/images", body);
}