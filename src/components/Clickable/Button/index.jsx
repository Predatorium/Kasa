'use client'

import styles from './Button.module.css'
import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';

export function Button({ content = '', icon = '', type = 'button', onClick = null, disabled = false, fitContainer = false }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`
        ${styles.button} 
        ${icon.trim() ? styles.icon : ''} 
        ${!content.trim() ? styles.withoutText : ''}
        ${fitContainer ? styles.fit : ''}
      `}
      disabled={disabled}
    >
      {icon.trim() &&
        <Image
            src={`/images/${icon}${disabled ? "_disable" : ""}.svg`}
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

export function ButtonLink({ content = '', icon = '', link, fitContainer = false }) {
  return (
    <Link 
      href={link}
      className={`
        ${styles.button} 
        ${icon.trim() ? styles.icon : ''} 
        ${!content.trim() ? styles.withoutText : ''}
        ${fitContainer ? styles.fit : ''}
      `}
    >      
      {icon.trim() &&
        <Image
            src={`/images/${icon}.svg`}
            alt={`Icon ${icon}`}
            width={16}
            height={16}
            loading="eager"
        />
      }
      {content.trim() && content}
    </Link>
  )
}