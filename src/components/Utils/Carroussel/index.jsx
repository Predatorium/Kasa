"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./Carrousel.module.css";

export default function Carrousel({ pictures, onClick, setIndex }) {
    const containerRef = useRef(null);

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