'use client'

import { Logo } from "@/components/Layout/Logo"
import { ButtonLink } from "@/components/Clickable/Button"
import { useState } from "react";
import Image from "next/image";
import KasaLink from "@/components/Clickable/Link"
import styles from "./NavMobile.module.css"

export default function NavMobile() {
    const [openMenu, setOpenMenu] = useState(true);

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
                    <KasaLink link="/home">Accueil</KasaLink>
                    <KasaLink link="/about">À propos</KasaLink>
                    <KasaLink link="/property/favorite">Messagerie</KasaLink>
                    <KasaLink link="/messaging">Favoris</KasaLink>
                </div>
            }
            {openMenu &&
                <ButtonLink link={"/property/add"} >
                    <p>Ajouter un logement</p>
                </ButtonLink>
            }
        </nav>
    )
}