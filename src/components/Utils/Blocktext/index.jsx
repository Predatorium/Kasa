import styles from "./BlockText.module.css"

export default function BlockText({title = "", text = ""}) {
    return (
        <div className={styles.blockText}>
            <p className={styles.title}>{title}</p>
            <p className={styles.content}>{text}</p>
        </div>
    )
}