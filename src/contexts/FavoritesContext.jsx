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
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Array<Object>} [props.initialFavorites] - Favoris déjà résolus côté serveur
 * @returns {JSX.Element}
 */
export default function FavoritesProvider({ children, initialFavorites = [] }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Récupère les favoris d'un utilisateur donné.
   * @param {string} id - Identifiant de l'utilisateur
   * @returns {Promise<Array<Object>>}
   */
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

  /**
   * Ajoute un logement aux favoris et met à jour l'état local.
   * Réservé owner/admin.
   * @param {string} id - Identifiant du logement
   * @returns {Promise<Object>} Le favori créé
   */
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

  /**
   * Retire un logement des favoris et met à jour l'état local.
   * Réservé owner/admin — 404 si id inconnu, 204 sinon (pas de data).
   * @param {string} id - Identifiant du logement
   * @returns {Promise<void>}
   */
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

/**
 * Hook d'accès au contexte des favoris.
 * @returns {{favorites: Array<Object>, loading: boolean, error: string|null, fetchFavoritesByUserId: Function, addFavorite: Function, removeFavorite: Function}}
 * @throws {Error} Si utilisé en dehors d'un `FavoritesProvider`
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans un FavoritesProvider");
  }
  return context;
}