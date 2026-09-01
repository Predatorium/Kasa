import styles from "./Property.module.css"
import { Button } from "@/components/Clickable/Button"
import Image from "next/image";
import Link from "next/link";

export default function PropertyCard({property}) {
    const { id, title, location, cover, price_per_night} = property;

    return (
        <Link href={`/property/${id}`} className={styles.card}>
            <div className={styles.head}>
                <Image
                    src={cover ?? ""}
                    alt={`Couverture ${title ?? ""}`}
                    width={355}
                    height={376}
                    loading="eager"
                    className={styles.cover}
                />
                <div className={styles.favorite}>
                    <Button icon="Favoris" onClick={()=>{}} disabled={true}/>
                </div>
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