import styles from "./BlockText.module.css"

/**
 * Bloc simple titre + texte (ex: description, équipements dans la page détail logement).
 * @param {Object} props
 * @param {string} [props.title=''] - Titre du bloc
 * @param {string} [props.text=''] - Contenu texte du bloc
 * @returns {JSX.Element}
 */
export default function BlockText({title = "", text = ""}) {
    return (
        <div className={styles.blockText}>
            <p className={styles.title}>{title}</p>
            <p className={styles.content}>{text}</p>
        </div>
    )
}