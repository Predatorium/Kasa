"use server";

import apiRequest from "@/api/client";

export async function getRatingsForPropertyAction(propertyId) {
  return apiRequest("GET", `/api/properties/${propertyId}/ratings`);
}

export async function addRatingAction(propertyId, body) {
  // body: { user_id (requis), score (entier 1-5, requis), comment? }
  // retour: { rating_avg, ratings_count, ratings: [...] }
  return apiRequest("POST", `/api/properties/${propertyId}/ratings`, body);
}