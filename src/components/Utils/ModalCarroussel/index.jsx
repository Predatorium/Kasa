"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ModalCarroussel.module.css";

/**
 * Modale plein écran affichant les photos d'un logement en carrousel, avec
 * navigation circulaire (retour au début après la dernière photo et inversement).
 * Se ferme au clic en dehors des flèches, ou via la touche Échap.
 * @param {Object} props
 * @param {string[]} props.pictures - URLs des photos à afficher
 * @param {number} props.startIndex - Index de la photo affichée à l'ouverture
 * @param {Function} props.onClose - Callback de fermeture de la modale
 * @param {boolean} props.isOpen - Indique si la modale est actuellement ouverte
 * @returns {JSX.Element}
 */
export default function ModalCarrousel({ pictures, startIndex, onClose, isOpen }) {
    const containerRef = useRef(null);
    const [indexPicture, setIndexPicture] = useState(0);

    /**
     * Fait défiler le carrousel vers la photo suivante/précédente, avec
     * bouclage circulaire au-delà des bornes.
     * @param {number} direction - Sens du défilement : 1 = droite, -1 = gauche
     * @returns {void}
     */
    const scroll = (direction) => {
        const container = containerRef.current;
        if (!container) return;
        const amount = container.clientWidth;
        if (indexPicture + direction >= pictures.length) {
            setIndexPicture(0);
            container.scrollBy({ left: -pictures.length * amount, behavior: "smooth" });
        }
        else if (indexPicture + direction < 0) {
            setIndexPicture(pictures.length - 1);
            container.scrollBy({ left: pictures.length * amount, behavior: "smooth" });
        }
        else {
            setIndexPicture(indexPicture + direction);
            container.scrollBy({ left: direction * amount, behavior: "smooth" });
        }
    };

    // Repositionne le carrousel sur startIndex à chaque ouverture/changement d'index de départ
    useEffect(() => {
        setIndexPicture(startIndex);
        const container = containerRef.current;
        const amount = container.clientWidth;
        container.scrollTo(startIndex * amount, 0)
    }, [startIndex])

    // Gère la fermeture via Échap et bloque le scroll de la page tant que la modale est ouverte
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    /**
     * Défile vers la photo suivante sans propager le clic (évite de fermer la modale).
     * @param {React.MouseEvent} event
     * @returns {void}
     */
    const handleClickRight = (event) => {
        event.preventDefault();
        event.stopPropagation();
        scroll(1);
    }

    /**
     * Défile vers la photo précédente sans propager le clic (évite de fermer la modale).
     * @param {React.MouseEvent} event
     * @returns {void}
     */
    const handleClickLeft = (event) => {
        event.preventDefault();
        event.stopPropagation();
        scroll(-1);
    }

    return (
        <div className={styles.wrapper} onClick={onClose}>
            <div className={styles.caroussel} ref={containerRef}>
                {pictures.map((picture, index) => (
                    <div
                        key={index}
                        className={styles.picture}
                    >
                        <Image
                            src={picture}
                            alt={"Couverture"}
                            fill style={{ objectFit: "cover" }}
                            sizes="80vw"
                            loading="eager"
                            className={styles.pictureArt}
                        />
                    </div>
                ))}
            </div>
            <button className={`${styles.arrow} ${styles.left}`} onClick={handleClickLeft}>
                ‹
            </button>
            <button className={`${styles.arrow} ${styles.right}`} onClick={handleClickRight}>
                ›
            </button>
        </div>
    );
}