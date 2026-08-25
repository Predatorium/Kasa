import Image from "next/image";
import styles from "./Logo.module.css"
import Link from "next/link";

export function KasaLogo() {
  return (
    <div className={styles.kasa}>
      <Image
        src="/images/Kasa_Logo.svg"
        alt="Logo Kasa"
        fill style={{ objectFit: 'cover'}}
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
        fill style={{ objectFit: 'cover'}}
        loading="eager"
      />
    </div>
  )
}