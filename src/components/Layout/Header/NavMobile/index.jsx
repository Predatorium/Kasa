'use client'

import { Logo } from "@/components/Layout/Logo"
import { ButtonLink } from "@/components/Clickable/Button"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./NavMobile.module.css"

export default function NavMobile() {
    const [openMenu, setOpenMenu] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
        if (openMenu) {
            setOpenMenu(false);
        }
    }, [pathname]);

    return (
        <nav className={`${styles.nav} ${openMenu ? styles.fullscreen : ''}`}>
            <div className={styles.head}>
                <Logo />
                <button 
                    type='button'
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    <Image
                        src={`/images/${openMenu ? "Close" : "Menu_grey"}.svg`}
                        alt="Favoris"
                        width={46}
                        height={46}
                        loading="eager"
                    />
                </button>
            </div>

            {openMenu &&
                <div className={styles.menu}>
                    <Link href="/home" className={styles.blackLink}>Accueil</Link>
                    <Link href="/about" className={styles.blackLink}>À propos</Link>
                    <Link href="/messaging" className={styles.blackLink}>Messagerie</Link>
                    <Link href="/property/favourites" className={styles.blackLink}>Favoris</Link>
                </div>
            }
            {openMenu &&
                <ButtonLink link={"/property/add"} content={"Ajouter un logement"}/>
            }
        </nav>
    )
}