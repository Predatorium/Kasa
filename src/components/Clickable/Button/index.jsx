'use client'

import styles from './Button.module.css'
import Link from "next/link";

export function Button({ children, type = 'button', onClick = null, disabled = false }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={styles.button}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function ButtonLink({ children, link, disabled = false  }) {
  return (
    <Link 
      href={link}
      className={styles.button}
      disabled={disabled}
    >
      {children}
    </Link>
  )
}