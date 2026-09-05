import styles from "./CheckBox.module.css"

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