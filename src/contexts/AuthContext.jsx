'use client';

import { createContext, useContext, useState } from 'react';
import { getUserByIdAction, updateUserAction } from '@/actions/usersActions';

const AuthContext = createContext(null);

/**
 * @param {object} props
 * @param {object|null} props.initialUser - passé par le Server Component parent
 *   (déjà résolu via getUserByIdAction, à partir de l'id décodé du token JWT en cookie)
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AuthProvider({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Recharge le profil de l'utilisateur connecté depuis l'API.
   * @returns {Promise<Object|null>} L'utilisateur mis à jour, ou `null` s'il n'y a pas d'utilisateur courant
   */
  const refreshProfile = async () => {
    if (!user?.id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUserByIdAction(user.id);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Met à jour le profil de l'utilisateur connecté.
   * ⚠️ `role: 'admin'` renverra 403 si l'utilisateur courant n'est pas admin.
   * @param {Object} profileData - Sous-ensemble de { name, picture, role }
   * @returns {Promise<Object>} L'utilisateur mis à jour
   */
  const editProfile = async (profileData) => {
    const { data } = await updateUserAction(user.id, profileData);
    setUser(data.user);
    return data.user;
  };

  /** Réinitialise l'utilisateur courant à `null` (déconnexion locale). */
  const clearUser = () => setUser(null);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, loading, error, isAdmin, setUser, refreshProfile, editProfile, clearUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook d'accès au contexte d'authentification.
 * @returns {{user: Object|null, loading: boolean, error: string|null, isAdmin: boolean, setUser: Function, refreshProfile: Function, editProfile: Function, clearUser: Function}}
 * @throws {Error} Si utilisé en dehors d'un `AuthProvider`
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}