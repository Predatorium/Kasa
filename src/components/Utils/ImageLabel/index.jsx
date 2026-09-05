import { useRef, useEffect } from "react"
import styles from "./ImageLabel.module.css"
import { Button } from "@/components/Clickable/Button"

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

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

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
                    name={`${name || nameId}File`}
                    accept="image/*"
                    ref={fileInputRef}
                    hidden
                    onChange={handleFileChange}
                />
                <Button icon={icon} onClick={onClick ?? handleButtonClick} />
            </div>
        </div>
    )
}