import styles from "./Tag.module.css"
import Image from "next/image"

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
                        src={"/images/close.svg"}
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