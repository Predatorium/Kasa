"use server";

import apiRequest from "@/api/client";

// Réservé admin
export async function getUsersAction() {
  return apiRequest("GET", "/api/users");
}

// Self ou admin
export async function getUserByIdAction(id) {
  return apiRequest("GET", `/api/users/${id}`);
}

// Réservé admin
export async function createUserAction(body) {
  // body: { name (requis), picture?, role? } — role parmi 'owner' | 'client' | 'admin'
  return apiRequest("POST", "/api/users", body);
}

// Self ou admin
export async function updateUserAction(id, body) {
  // body: subset de { name, picture, role }
  // → role: 'admin' échoue en 403 si l'appelant n'est pas lui-même admin
  return apiRequest("PATCH", `/api/users/${id}`, body);
}