import styles from "./CheckBox.module.css"

/**
 * Case à cocher stylisée avec son label.
 * @param {Object} props
 * @param {string} props.nameId - `id` de l'input et cible du `htmlFor` du label
 * @param {string} props.name - Attribut `name` du champ (pour la soumission de formulaire)
 * @param {string} props.value - Valeur associée à la case
 * @param {string} props.content - Texte affiché à côté de la case
 * @returns {JSX.Element}
 */
export default function CheckBox({ nameId, name, value, content }) {
    return (
        <div className={styles.checkBox}>
            <input
                type="checkbox"
                id={nameId}
                name={name}
                value={value}
                className={styles.check}
            />
            <label htmlFor={nameId} className={styles.label}>{content}</label>
        </div>
    )
}