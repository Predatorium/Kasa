"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { addFavoriteAction, removeFavoriteAction, getFavoritesForUserAction } from "@/actions/favoritesActions"

const FavoritesContext = createContext(null);

/**
 * Shape "liste" (via GET /api/properties) :
 * { id, slug, title, description, cover, location, price_per_night,
 *   rating_avg, ratings_count, host?: { id, name, picture } }
 *
 * Shape "détail" (via GET /api/properties/:id) : idem + pictures[], equipments[], tags[]
 */
export default function FavoritesProvider({ children, initialFavorites = [] }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavoritesByUserId = useCallback(async (id) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFavoritesForUserAction(id);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
  }, []);
  
  // Réservé owner/admin
  // body: { title(requis), description?, cover?, location?, price_per_night?,
  //         host_id? OU host:{name,picture?}, pictures?, equipments?, tags? }
  const addFavorite = useCallback(async (id) => {
      setLoading(true);
      setError(null);
      try {
        const data = await addFavoriteAction(id);
        setFavorites((prev) => [...prev, data]);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
  }, []);

  // Réservé owner/admin — 404 si id inconnu, 204 sinon (pas de data)
  const removeFavorite = useCallback(async (id) => {
      setLoading(true);
      setError(null);
      try {
        await removeFavoriteAction(id);
        setFavorites((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
  }, []);

  const value = {
    favorites,
    loading,
    error,
    fetchFavoritesByUserId,
    addFavorite,
    removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans un FavoritesProvider");
  }
  return context;
}