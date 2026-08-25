import { KasaLogo } from "@/components/Layout/Logo"
import Image from "next/image";
import KasaLink from "@/components/Clickable/Link"
import Link from "next/link";
import styles from "./NavDesktop.module.css"

export default function NavDesktop() {

    return (
        <nav className={styles.nav}>
            <div className={styles.left}>
                <KasaLink link="/home">Accueil</KasaLink>
                <KasaLink link="/about">À propos</KasaLink>
            </div>
                
            <KasaLogo />

            <div className={styles.right}>
                <Link href="/property/add" className={styles.link}>+Ajouter un logement</Link>
                <div className={styles.icons}>
                    <Link href="/property/favorite" className={styles.iconLink}>
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
            </div>
        </nav>
    )
}