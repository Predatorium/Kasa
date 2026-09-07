import styles from "./Property.module.css"
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function PropertyCard({ property, inFavorite }) {
    const { id, title, location, cover, price_per_night} = property;
    const { addFavorite, removeFavorite } = useFavorites();
    const { user } = useAuth();
    const [favorite, setFavorite] = useState(inFavorite);

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
                        quality={65}
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