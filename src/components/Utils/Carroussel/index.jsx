"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./Carrousel.module.css";

/**
 * Carrousel horizontal des photos d'un logement, avec flèches de défilement
 * (affichées seulement au-delà de 5 photos). Le clic sur une photo ouvre la modale
 * (via `onClick`) à l'index correspondant (via `setIndex`).
 * @param {Object} props
 * @param {string[]} props.pictures - URLs des photos à afficher
 * @param {function(boolean): void} props.onClick - Callback pour ouvrir/fermer la modale carrousel
 * @param {function(number): void} props.setIndex - Définit l'index de la photo cliquée
 * @returns {JSX.Element}
 */
export default function Carrousel({ pictures, onClick, setIndex }) {
    const containerRef = useRef(null);

    /**
     * Fait défiler le carrousel horizontalement.
     * @param {number} direction - Sens du défilement : 1 = droite, -1 = gauche
     * @returns {void}
     */
    const scroll = (direction) => {
        const container = containerRef.current;
        if (!container) return;
        const amount = container.clientWidth * 0.25; // largeur d'un "bloc"
        container.scrollBy({ left: direction * amount, behavior: "smooth" });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.caroussel} ref={containerRef}>
                {pictures.map((picture, index) => (
                    <div
                        key={index}
                        className={`${styles.picture} ${index === 0 ? styles.pictureBig : ""}`}
                        onClick={() => {onClick(true); setIndex(index)}}
                    >
                        <Image
                            src={picture}
                            alt={"Couverture"}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes={index === 0
                                ? "(max-width: 768px) 80vw, 45vw"
                                : "24vw"
                            }
                            loading="eager"
                            className={styles.pictureArt}
                        />
                    </div>
                ))}
            </div>

            {pictures.length > 5 && (
                <>
                    <button className={`${styles.arrow} ${styles.left}`} onClick={() => scroll(-1)}>
                        ‹
                    </button>
                    <button className={`${styles.arrow} ${styles.right}`} onClick={() => scroll(1)}>
                        ›
                    </button>
                </>
            )}
        </div>
    );
}