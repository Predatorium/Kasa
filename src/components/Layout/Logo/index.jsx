import styles from "./Logo.module.css"
import Image from "next/image";

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