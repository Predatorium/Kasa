'use client'

import styles from './Link.module.css'
import Link from "next/link";

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