'use client'

import styles from "./home.module.css"
import { useProperties } from "@/contexts/PropertiesContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import PropertyCard from "@/components/Property"
import Image from "next/image"
import BlockText from "@/components/Utils/Blocktext"

export default function HomeContent() {
    const { properties, loading, error } = useProperties();
    const { favorites } = useFavorites();
    
    const isFavorite = (propertyId) => 
    favorites?.some((fav) => fav.id === propertyId); // ou `fav === propertyId` si favorites est un tableau d'ids

    return (
        <div className={styles.home}>
            <div className={styles.head}>
                <div className={styles.top}>
                    <h1 className={styles.title}>{"Chez vous,\n partout et ailleurs"}</h1>
                    <p className={styles.slogan}>Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.</p>
                </div>
                <div className={styles.homeCover}>
                    <Image
                        src={"/images/Home_cover.jpg"}
                        alt={"Couverture"}
                        fill style={{ objectFit: 'cover'}}
                        sizes="(max-width: 1115px) 88vw, 458px"
                        loading="eager"
                        className={styles.cover}
                        priority
                    />
                </div>
            </div>
            <div className={styles.properties}>
                {loading && <p>Chargement...</p>}
                {error && <p>Erreur : {error}</p>}
                {properties?.map((property) => (
                    <PropertyCard key={property.id} property={property} inFavorite={isFavorite(property.id)} />
                ))}
            </div>
            <div className={styles.foot}>
                <div className={styles.top}>
                    <p className={styles.howUse}>Comment ça marche ?</p>
                    <p className={styles.describ}>Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel, </p>
                </div>
                <div className={styles.explain}>
                    <BlockText title="Recherchez" text="Entrez votre destination, vos dates et laissez Kasa faire le reste"/>
                    <BlockText title="Réservez" text="Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés."/>
                    <BlockText title="Vivez l’expérience" text="Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout."/>
                </div>
            </div>
        </div>
    )
}