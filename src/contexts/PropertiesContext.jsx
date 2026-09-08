"use client";

import { createContext, useContext, useState, useCallback } from "react";
import {
  getPropertiesAction,
  getPropertyByIdAction,
  createPropertyAction,
  updatePropertyAction,
  deletePropertyAction,
} from "@/actions/propertiesActions";

const PropertiesContext = createContext(null);

/**
 * Shape "liste" (via GET /api/properties) :
 * { id, slug, title, description, cover, location, price_per_night,
 *   rating_avg, ratings_count, host?: { id, name, picture } }
 *
 * Shape "détail" (via GET /api/properties/:id) : idem + pictures[], equipments[], tags[]
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Array<Object>} [props.initialProperties] - Logements déjà résolus côté serveur
 * @returns {JSX.Element}
 */
export default function PropertiesProvider({ children, initialProperties = [] }) {
  const [properties, setProperties] = useState(initialProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Récupère la liste de tous les logements et met à jour l'état local.
   * @returns {Promise<Array<Object>>}
   */
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getPropertiesAction();
      if (error) throw new Error(error);
      setProperties(data ?? []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupère le détail d'un logement par son id (sans toucher à l'état local).
   * @param {string} id - Identifiant du logement
   * @returns {Promise<Object>} Le logement, avec pictures/equipments/tags en plus des champs de la liste
   */
  const fetchPropertyById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getPropertyByIdAction(id);
      if (error) throw new Error(error);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crée un logement et l'ajoute à l'état local.
   * Réservé owner/admin.
   * @param {Object} body
   * @param {string} body.title - Titre du logement (requis)
   * @param {string} [body.description]
   * @param {string} [body.cover]
   * @param {string} [body.location]
   * @param {number} [body.price_per_night]
   * @param {string} [body.host_id] - Requis si `host` n'est pas fourni
   * @param {{name: string, picture: string}} [body.host] - Requis si `host_id` n'est pas fourni (picture optionnelle)
   * @param {string[]} [body.pictures]
   * @param {string[]} [body.equipments]
   * @param {string[]} [body.tags]
   * @returns {Promise<Object>} Le logement créé (détails complets, via getPropertyDetails côté API)
   */
  const createProperty = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await createPropertyAction(body);
      if (error) throw new Error(error);
      setProperties((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Met à jour un logement et synchronise l'état local.
   * Réservé owner/admin — au moins un champ requis (sinon 400 côté API).
   * @param {string} id - Identifiant du logement
   * @param {Object} body - Sous-ensemble de { title, description, cover, location, host_id, price_per_night }
   * @returns {Promise<Object>} Le logement mis à jour
   */
  const updateProperty = useCallback(async (id, body) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await updatePropertyAction(id, body);
      if (error) throw new Error(error);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprime un logement et le retire de l'état local.
   * Réservé owner/admin — 404 si id inconnu, 204 sinon (pas de data).
   * @param {string} id - Identifiant du logement
   * @returns {Promise<void>}
   */
  const deleteProperty = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await deletePropertyAction(id);
      if (error) throw new Error(error);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    properties,
    loading,
    error,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
}

/**
 * Hook d'accès au contexte des logements.
 * @returns {{properties: Array<Object>, loading: boolean, error: string|null, fetchProperties: Function, fetchPropertyById: Function, createProperty: Function, updateProperty: Function, deleteProperty: Function}}
 * @throws {Error} Si utilisé en dehors d'un `PropertiesProvider`
 */
export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error("useProperties doit être utilisé dans un PropertiesProvider");
  }
  return context;
}