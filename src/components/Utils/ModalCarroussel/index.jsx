"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ModalCarroussel.module.css";

export default function ModalCarrousel({ pictures, startIndex, onClose, isOpen }) {
    const containerRef = useRef(null);
    const [indexPicture, setIndexPicture] = useState(0);

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

    useEffect(() => {
        setIndexPicture(startIndex);
        const container = containerRef.current;
        const amount = container.clientWidth;
        container.scrollTo(startIndex * amount, 0)
    }, [startIndex])

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

    const handleClickRight = (event) => {
        event.preventDefault();
        event.stopPropagation();
        scroll(1);
    }

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