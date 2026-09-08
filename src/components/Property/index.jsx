import styles from "./Property.module.css"
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { useState } from "react";

/**
 * Carte d'aperçu d'un logement (cover, titre, localisation, prix) avec bouton favori.
 * Redirige vers `/login` si l'utilisateur clique sur le favori sans être connecté.
 * @param {Object} props
 * @param {Object} props.property - Données du logement
 * @param {string} props.property.id
 * @param {string} props.property.title
 * @param {string} props.property.location
 * @param {string} props.property.cover
 * @param {number} props.property.price_per_night
 * @param {boolean} props.inFavorite - Indique si le logement est déjà dans les favoris de l'utilisateur
 * @returns {JSX.Element}
 */
export default function PropertyCard({ property, inFavorite }) {
    const { id, title, location, cover, price_per_night} = property;
    const { addFavorite, removeFavorite } = useFavorites();
    const { user } = useAuth();
    const [favorite, setFavorite] = useState(inFavorite);

    /**
     * Ajoute ou retire le logement des favoris au clic sur l'icône.
     * Empêche la propagation pour ne pas déclencher le lien vers la page détail.
     * @param {React.MouseEvent} event
     * @returns {void}
     */
    const handleClickFavorite = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            redirect("/login");
        }

        if (favorite) {
            removeFavorite(id);
        } else {
            addFavorite(id);
        }
        setFavorite(!favorite);
    };

    return (
        <div className={styles.card}>
            <button 
                type='button' 
                onClick={handleClickFavorite} 
                className={`${styles.button} ${styles.favorite} ${favorite ? '' : styles.notFav}`} 
            >
                <Image
                    src={`/images/Favoris${favorite ? "_fav" : ""}.svg`}
                    alt="Icon Favoris"
                    width={16}
                    height={16}
                    loading="eager"
                />
            </button>
            <Link href={`/property/${id}`} className={styles.link}>
                <div className={styles.head}>
                    <Image
                        src={cover ?? ""}
                        alt={`Couverture ${title ?? ""}`}
                        fill style={{ objectFit: 'cover'}}
                        sizes="355px"
                        loading="eager"
                        className={styles.cover}
                    />
                </div>
                <div className={styles.infos}>
                    <div className={styles.top}>
                        <p className={styles.title}>{title ?? ""}</p>
                        <em className={styles.location}>{location ?? ""}</em>
                    </div>
                    <p className={styles.rate}><em className={styles.price}>{`${price_per_night ?? ""}€`}</em>{" par nuit"}</p>
                </div>
            </Link>
        </div>
    )
}