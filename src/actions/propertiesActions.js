"use server";

import apiRequest from "@/api/client";

export async function getPropertiesAction() {
  return apiRequest("GET", "/api/properties");
}

export async function getPropertyByIdAction(id) {
  return apiRequest("GET", `/api/properties/${id}`);
}

// Réservé rôle owner/admin
export async function createPropertyAction(body) {
  // body: {
  //   id?, title (requis), description?, cover?, location?,
  //   price_per_night? (sinon fallback 80),
  //   host_id?  OU  host: { name, picture? }  ← l'un des deux est requis
  //   pictures?: [url], equipments?: [name], tags?: [name]
  // }
  return apiRequest("POST", "/api/properties", body);
}

// Réservé rôle owner/admin
export async function updatePropertyAction(id, body) {
  // body: subset de { title, description, cover, location, host_id, price_per_night }
  // → au moins un champ requis, sinon 400
  return apiRequest("PATCH", `/api/properties/${id}`, body);
}

// Réservé rôle owner/admin
export async function deletePropertyAction(id) {
  // retour 204 → data sera null
  return apiRequest("DELETE", `/api/properties/${id}`);
}