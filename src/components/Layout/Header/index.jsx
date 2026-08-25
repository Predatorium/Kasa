import NavDesktop from "./NavDesktop"
import NavMobile from "./NavMobile"
import styles from "./Header.module.css"

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