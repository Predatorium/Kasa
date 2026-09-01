'use client';

import { createContext, useContext, useState } from 'react';
import { getUserByIdAction, updateUserAction } from '@/actions/usersActions';

const AuthContext = createContext(null);

/**
 * @param {object} props
 * @param {object|null} props.initialUser - passé par le Server Component parent
 *   (déjà résolu via getUserByIdAction, à partir de l'id décodé du token JWT en cookie)
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const editProfile = async (profileData) => {
    // profileData : subset de { name, picture, role }
    // ⚠️ role: 'admin' renverra 403 si l'utilisateur courant n'est pas admin
    const { data } = await updateUserAction(user.id, profileData);
    setUser(data.user);
    return data.user;
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}