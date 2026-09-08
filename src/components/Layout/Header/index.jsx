import NavDesktop from "./NavDesktop"
import NavMobile from "./NavMobile"
import styles from "./Header.module.css"

/**
 * En-tête global du site. Affiche `NavDesktop` ou `NavMobile` selon la largeur
 * d'écran (les deux sont rendus, le CSS gère l'affichage conditionnel).
 * @returns {JSX.Element}
 */
export default function Header() {

    return (
        <header className={styles.header}>
            <div className={styles.desktop}>
                <NavDesktop />
            </div>
            <div className={styles.mobile}>
                <NavMobile />
            </div>
        </header>
    )
}