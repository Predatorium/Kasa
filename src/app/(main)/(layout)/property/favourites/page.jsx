'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { redirect } from "next/navigation";
import styles from "./favourites.module.css"
import PropertyCard from "@/components/Card/Property";

export default function Favourites() {
    const { user } = useAuth();

    if (!user) {
        redirect("/login");
    }

    const { favorites, loading, error } = useFavorites();

    return (
        <div className={styles.page}>
            <div className={styles.head}>
                <h1 className={styles.title}>Vos favoris</h1>
                <p className={styles.slogan}>{"Retrouvez ici tous les logements que vous avez aimés.\nPrêts à réserver ? Un simple clic et votre prochain séjour est en route."}</p>
            </div>
            <div className={styles.favorites}>
                {loading && <p>Chargement...</p>}
                {error && <p>Erreur : {error}</p>}
                {favorites?.map((property) => (
                    <PropertyCard key={property.id} property={property} inFavorite={true} />
                ))}
            </div>

        </div>
    )

}