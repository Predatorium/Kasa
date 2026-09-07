"use server";

import apiRequest from "@/api/client";

// Auth requise — pas de body, userId vient du token
export async function addFavoriteAction(propertyId) {
  return apiRequest("POST", `/api/properties/${propertyId}/favorite`);
}

export async function removeFavoriteAction(propertyId) {
  return apiRequest("DELETE", `/api/properties/${propertyId}/favorite`);
}

// Self ou admin
export async function getFavoritesForUserAction(userId) {
  return apiRequest("GET", `/api/users/${userId}/favorites`);
}