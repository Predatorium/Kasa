import { getFavoritesForUserAction } from "@/actions/favoritesActions"
import { getUserByIdAction } from "@/actions/usersActions"
import AppProviders from "@/contexts/AppProvider";
import { cookies } from "next/headers";

export default async function GlobalLayout({ children }) {
    let initialFavorites = null;
    let initialUser = null;

    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const userId = cookieStore.get("userId");

    if (token && userId) {
        try {
            const [favoritesResult, userResult] = await Promise.all([
                getFavoritesForUserAction(userId.value),
                getUserByIdAction(userId.value)
            ]);
            initialFavorites = favoritesResult;
            initialUser = userResult;
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    return (
        <AppProviders initialFavorites={initialFavorites ?? []} initialUser={initialUser ?? null}>
            {children}
        </AppProviders>
    )
}