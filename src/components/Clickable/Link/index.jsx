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