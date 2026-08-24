"use server";
import apiRequest from "@/api/client";

export async function registerAction(body) {
  // body: { name (requis), email (requis), password (requis, min 6), picture?, role? }
  // role limité à 'owner' ou 'client' côté serveur (fallback 'client' sinon)
  // retour: { token, user: { id, name, email, picture, role } }
  return apiRequest("POST", "/auth/register", body);
}

export async function loginAction(body) {
  // body: { email (requis), password (requis) }
  // retour: { token, user }
  return apiRequest("POST", "/auth/login", body);
}

export async function requestResetAction(body) {
  // body: { email (requis) }
  // retour: { ok: true, message } (+ token si NODE_ENV !== 'production')
  return apiRequest("POST", "/auth/request-reset", body);
}

export async function resetPasswordAction(body) {
  // body: { token (requis), password (requis, min 6) }
  return apiRequest("POST", "/auth/reset-password", body);
}