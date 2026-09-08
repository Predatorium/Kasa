import styles from "./Logo.module.css"
import Image from "next/image";

/**
 * Logo Kasa version texte (utilisé dans la nav desktop).
 * @returns {JSX.Element}
 */
export function KasaLogo() {
  return (
    <div className={styles.kasa}>
      <Image
        src="/images/Kasa_Logo.svg"
        alt="Logo Kasa"
        width={113}
        height={40}
        loading="eager"
      />
    </div>
  )
}

/**
 * Logo Kasa version icône seule (utilisé dans le footer et la nav mobile).
 * @returns {JSX.Element}
 */
export function Logo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/images/Logo.svg"
        alt="Logo Kasa"
        width={46}
        height={53}
        loading="eager"
      />
    </div>
  )
}