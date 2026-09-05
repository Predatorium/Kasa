'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import FavoritesProvider from "@/contexts/FavoritesContext"

/**
 * Regroupe les contexts globaux (Auth + Projects). Les données initiales viennent
 * du Server Component parent (ProtectedLayout) - plus de fetch au montage ici.
 * TaskContext/CommentContext restent montés plus bas (page projet/tâche), avec le
 * même principe : initialTasks/initialComments passés par leur propre layout serveur.
 */
export default function AppProviders({ children, initialUser, initialFavorites }) {
  return (
    <AuthProvider initialUser={initialUser}>
      <FavoritesProvider initialFavorites={initialFavorites}>
        {children}
      </FavoritesProvider>
    </AuthProvider>
  );
}