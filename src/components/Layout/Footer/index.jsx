import { Logo } from "../Logo"
import styles from "./Footer.module.css"

/**
 * Pied de page global du site (logo + mention de copyright).
 * @returns {JSX.Element}
 */
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Logo />
            <p className={styles.content}>© 2020 Kasa. All rights reserved</p>
        </footer>
    )
}