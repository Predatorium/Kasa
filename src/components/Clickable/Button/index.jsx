'use client'

import styles from './Button.module.css'
import Link from "next/link";
import Image from "next/image";

export function Button({ content = '', icon = '', type = 'button', onClick = null, disabled = false }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`${styles.button} ${icon.trim() ? styles.icon : ''} ${!content.trim() ? styles.withoutText : ''}`}
      disabled={disabled}
    >
      {icon.trim() &&
        <Image
            src={`/images/${icon}${disabled ? "" : "_red"}.svg`}
            alt={`Icon ${icon}`}
            width={16}
            height={16}
            loading="eager"
        />
      }
      {content.trim() && content}
    </button>
  )
}

export function ButtonLink({ content, link }) {
  return (
    <Link 
      href={link}
      className={styles.button}
    >
      {content}
    </Link>
  )
}