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
 */
export default function PropertiesProvider({ children, initialProperties = [] }) {
  const [properties, setProperties] = useState(initialProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchPropertyById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getPropertyByIdAction(id);
      if (error) throw new Error(error);
      // data ici contient pictures/equipments/tags en plus des champs de la liste
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
  const createProperty = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await createPropertyAction(body);
      if (error) throw new Error(error);
      // data = détails complets (via getPropertyDetails côté API)
      setProperties((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Réservé owner/admin — au moins un champ requis (sinon 400 côté API)
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

  // Réservé owner/admin — 404 si id inconnu, 204 sinon (pas de data)
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

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error("useProperties doit être utilisé dans un PropertiesProvider");
  }
  return context;
}