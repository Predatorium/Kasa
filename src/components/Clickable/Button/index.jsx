'use client'

import styles from './Button.module.css'
import Link from "next/link";
import Image from "next/image";

/**
 * Bouton cliquable générique, avec icône optionnelle.
 * @param {Object} props
 * @param {string} [props.content=''] - Texte affiché dans le bouton
 * @param {string} [props.icon=''] - Nom du fichier icône (sans extension), dans `/images/`. Un suffixe `_disable` est ajouté automatiquement si `disabled` est vrai
 * @param {"button"|"submit"|"reset"} [props.type='button'] - Type HTML du bouton
 * @param {Function|null} [props.onClick=null] - Callback au clic
 * @param {boolean} [props.disabled=false] - Désactive le bouton
 * @param {boolean} [props.fitContainer=false] - Étire le bouton à la largeur de son conteneur
 * @returns {JSX.Element}
 */
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

/**
 * Variante de `Button` sous forme de lien de navigation (Next.js `Link`).
 * @param {Object} props
 * @param {string} [props.content=''] - Texte affiché
 * @param {string} [props.icon=''] - Nom du fichier icône (sans extension), dans `/images/`
 * @param {string} props.link - URL/route cible
 * @param {boolean} [props.fitContainer=false] - Étire le lien à la largeur de son conteneur
 * @returns {JSX.Element}
 */
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