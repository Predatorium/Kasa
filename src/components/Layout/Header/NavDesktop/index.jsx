'use client'

import { KasaLogo } from "@/components/Layout/Logo"
import { Button } from "@/components/Clickable/Button"
import { logoutAction } from '@/actions/authActions';
import { useAuth } from '@/contexts/AuthContext';
import Image from "next/image";
import Link from "next/link";
import styles from "./NavDesktop.module.css"
import { redirect } from 'next/navigation';

/**
 * Barre de navigation version desktop : liens principaux, logo, accès
 * favoris/messagerie et bouton connexion/déconnexion.
 * @returns {JSX.Element}
 */
export default function NavDesktop() {
    const { user, clearUser } = useAuth();

    /**
     * Déconnecte l'utilisateur (suppression des cookies côté serveur + reset
     * du contexte local) et redirige vers la page d'accueil.
     * @returns {Promise<void>}
     */
    const handleLogout = async () => {
        if (user) {
            await logoutAction();
            clearUser();
            redirect('/home');
            return;
        }

        redirect("/login")
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.left}>
                <Link href="/home" className={styles.blackLink}>Accueil</Link>
                <Link href="/about" className={styles.blackLink}>À propos</Link>
            </div>
                
            <KasaLogo />

            <div className={styles.right}>
                {(user?.role === "owner" || !user) &&
                    <Link href="/property/add" className={styles.link}>+Ajouter un logement</Link>
                }
                <div className={styles.icons}>
                    <Link href="/property/favourites" className={styles.iconLink}>
                        <Image
                            src="/images/Favoris_red.svg"
                            alt="Favoris"
                            width={16}
                            height={16}
                            loading="eager"
                        />
                    </Link>
                    <hr className={styles.separator}/>
                    <Link href="/messaging" className={styles.iconLink}>
                        <Image
                            src="/images/Message_red.svg"
                            alt="Messages"
                            width={16}
                            height={16}
                            loading="eager"
                        />
                    </Link>
                </div>
                <Button onClick={handleLogout} content={user ? "Se déconnecter" : "Se connecter"} />
            </div>
        </nav>
    )
}