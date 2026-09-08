import { useRef, useEffect } from "react"
import styles from "./ImageLabel.module.css"
import { Button } from "@/components/Clickable/Button"

/**
 * Champ de saisie d'image combinant une URL et un sélecteur de fichier local.
 * Le nom du fichier choisi remplace l'affichage du champ texte (sans modifier
 * la valeur réelle envoyée par l'URL tant que `onChange` n'est pas déclenché).
 * @param {Object} props
 * @param {string} [props.nameId=''] - `id` du champ texte, utilisé aussi comme base pour `name` et l'input file
 * @param {string} [props.name=''] - Base du `name` des champs (fallback sur `nameId` si absent)
 * @param {string} [props.content=''] - Libellé affiché au-dessus du champ
 * @param {string} [props.placeholder='Coller une URL ou choisir un fichier'] - Placeholder du champ texte
 * @param {string} [props.value=''] - Valeur initiale/contrôlée du champ texte (URL)
 * @param {string} [props.icon=''] - Icône du bouton d'action
 * @param {Function|null} [props.onChange=null] - Callback au changement du champ texte
 * @param {Function|null} [props.onClick=null] - Callback au clic sur le bouton (fallback : ouvre le sélecteur de fichier)
 * @returns {JSX.Element}
 */
export default function ImageLabel({
    nameId = "",
    name = "",
    content = "",
    placeholder = "Coller une URL ou choisir un fichier",
    value = "",
    icon = "",
    onChange = null,
    onClick = null,
}) {
    const fileInputRef = useRef(null)
    const textInputRef = useRef(null)

    // resynchronise le champ affiché quand la prop value change côté parent
    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.value = value ?? ''
        }
    }, [value])

    /**
     * Ouvre le sélecteur de fichier natif du navigateur.
     * @returns {void}
     */
    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    /**
     * Affiche le nom du fichier sélectionné dans le champ texte.
     * @param {React.ChangeEvent<HTMLInputElement>} e
     * @returns {void}
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (textInputRef.current) {
            textInputRef.current.value = file.name
        }
    }

    return (
        <div className={styles.imageLabel}>
            <label htmlFor={nameId} className={styles.title}>{content}</label>
            <div className={styles.wrapper}>
                <input
                    id={nameId}
                    name={`${name || nameId}Url`}
                    type="text"
                    className={styles.input}
                    placeholder={placeholder}
                    defaultValue={value ?? ''}
                    onChange={onChange}
                    autoComplete="off"
                    ref={textInputRef}
                />
                <input
                    type="file"
                    id={`${nameId}-file`}
                    name={`${name || nameId}File`}
                    accept="image/*"
                    aria-label={`Choisir un fichier pour ${content || name || nameId}`}
                    ref={fileInputRef}
                    hidden
                    onChange={handleFileChange}
                />
                <Button icon={icon} onClick={onClick ?? handleButtonClick} />
            </div>
        </div>
    )
}