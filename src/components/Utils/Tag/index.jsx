import styles from "./Tag.module.css"
import Image from "next/image"

/**
 * Étiquette (ex: équipement d'un logement), avec bouton de suppression optionnel.
 * @param {Object} props
 * @param {string} props.text - Texte affiché dans le tag
 * @param {Function} [props.onClick] - Callback de suppression ; si fourni, affiche le bouton de fermeture
 * @param {boolean} [props.fitContainer=false] - Étire le tag à la largeur de son conteneur
 * @returns {JSX.Element}
 */
export default function Tag({ text, onClick, fitContainer = false }){
    return (
        <div className={`${styles.tag} ${fitContainer ? styles.fit : ""}`}>
            <p className={styles.text}>{text}</p>
            {onClick && 
                <button 
                    type='button'
                    onClick={onClick}
                >
                    <Image
                        src={"/images/Close.svg"}
                        alt={`Icon close`}
                        width={16}
                        height={16}
                        loading="eager"
                    />
                </button>
            }
        </div>
    )
}