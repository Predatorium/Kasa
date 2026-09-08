'use client'

import styles from './Link.module.css'
import Link from "next/link";

/**
 * Lien de navigation stylisé (Next.js `Link`).
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du lien
 * @param {string} props.link - URL/route cible
 * @returns {JSX.Element}
 */
export default function KasaLink({ children, link  }) {
  return (
    <Link 
      href={link}
      className={styles.link}
    >
      {children}
    </Link>
  )
}

/**
 * Variante de `KasaLink` sous forme de bouton (pour une action au lieu d'une navigation).
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {Function} props.onClick - Callback au clic
 * @returns {JSX.Element}
 */
export function KasaLinkButton({ children, onClick  }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={styles.link}
    >
      {children}
    </button>
  )
}