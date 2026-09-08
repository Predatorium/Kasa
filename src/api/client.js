import { cookies } from "next/headers";
import config from "@/config/config";

// Ce fichier ne doit JAMAIS être importé depuis un composant/context 'use client' -
// cookies() n'existe que côté serveur. Il ne doit être appelé que depuis @/actions ou
// des Server Components.

/**
 * Effectue une requête vers l'API en y attachant automatiquement le token
 * d'authentification (cookie httpOnly) s'il est présent.
 *
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} method - La méthode HTTP à utiliser
 * @param {string} path - Le chemin de l'endpoint (ajouté à l'URL de base de l'API)
 * @param {Object|FormData|null} [body=null] - Le corps de la requête. Si c'est du
 * FormData, il est envoyé tel quel (utile pour l'upload de fichiers) ; sinon il est
 * sérialisé en JSON.
 * @returns {Promise<Object|null>} Les données JSON renvoyées par l'API, ou null
 * si la réponse n'a pas de corps (ex: 204 No Content)
 * @throws {Error} Si la réponse HTTP n'est pas OK (status hors 200-299) — l'erreur
 * contient alors `status` (code HTTP) et `data` (corps de la réponse si disponible)
 */
export default async function apiRequest(method, path, body = null) {
  const headers = {};

  // Récupère le token JWT depuis le cookie httpOnly posé à la connexion
  const token = (await cookies()).get("token")?.value;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body !== null) {
    if (body instanceof FormData) {
      options.body = body; // pas de Content-Type : fetch le gère seul
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${config.apiUrl}${path}`, options);

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // pas de body JSON (ex: 204 No Content)
  }

  if (!response.ok) {
    // On construit une erreur enrichie (status + data) pour permettre
    // aux appelants de gérer finement les différents cas d'échec
    const error = new Error(data?.message || `Erreur HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}