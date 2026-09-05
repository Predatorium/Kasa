import styles from "./Property.module.css"
import { Button } from "@/components/Clickable/Button"
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

export default function PropertyCard({ property, inFavorite }) {
    const { id, title, location, cover, price_per_night} = property;
    const { addFavorite, removeFavorite } = useFavorites();
    const { user } = useAuth();

    const handleClickFavorite = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            redirect("/login");
        }

        if (inFavorite) {
            removeFavorite(id);
        } else {
            addFavorite(id);
        }
    };

    return (
        <Link href={`/property/${id}`} className={styles.card}>
            <div className={styles.head}>
                <Image
                    src={cover ?? ""}
                    alt={`Couverture ${title ?? ""}`}
                    fill style={{ objectFit: 'cover'}}
                    loading="eager"
                    className={styles.cover}
                />
                <button 
                    type='button' 
                    onClick={handleClickFavorite} 
                    className={`${styles.button} ${styles.favorite} ${inFavorite ? '' : styles.notFav}`} 
                >
                    <Image
                        src={`/images/Favoris${inFavorite ? "_fav" : ""}.svg`}
                        alt="Icon Favoris"
                        width={16}
                        height={16}
                        loading="eager"
                    />
                </button>
            </div>
            <div className={styles.infos}>
                <div className={styles.top}>
                    <p className={styles.title}>{title ?? ""}</p>
                    <em className={styles.location}>{location ?? ""}</em>
                </div>
                <p className={styles.rate}><em className={styles.price}>{`${price_per_night ?? ""}€`}</em>{" par nuit"}</p>
            </div>
        </Link>
    )
}