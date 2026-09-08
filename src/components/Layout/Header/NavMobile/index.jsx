'use client'

import { Logo } from "@/components/Layout/Logo"
import { ButtonLink, Button } from "@/components/Clickable/Button"
import { logoutAction } from '@/actions/authActions';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./NavMobile.module.css"

/**
 * Barre de navigation version mobile : menu plein écran (burger), liens
 * principaux, accès favoris/messagerie et bouton connexion/déconnexion.
 * Le menu se ferme automatiquement à chaque changement de route.
 * @returns {JSX.Element}
 */
export default function NavMobile() {
    const { user, clearUser } = useAuth();
    const [openMenu, setOpenMenu] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
        if (openMenu) {
            setOpenMenu(false);
        }
    }, [pathname]);

    /**
     * Déconnecte l'utilisateur (suppression des cookies côté serveur + reset
     * du contexte local) et redirige vers la page d'accueil.
     * @returns {Promise<void>}
     */
    const handleLogout = async () => {
        await logoutAction();
        clearUser();
        redirect('/home');
    };

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
                <div className={styles.actions}>
                    {user?.role === "owner" || !user &&
                        <ButtonLink link="/property/add" content="Ajouter un logement" />
                    }
                    <Button onClick={handleLogout} content={user ? "Se déconnecter" : "Se connecter"} />

                </div>
            }
        </nav>
    )
}