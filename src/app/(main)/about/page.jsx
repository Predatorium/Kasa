import styles from "./about.module.css"
import Image from "next/image"

export default function About() {
    return (
        <div className={styles.about}>
            <div className={styles.head}>
                <div className={styles.top}>
                    <h1 className={styles.title}>À propos</h1>
                    <p className={styles.subsection}>
                        {"Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.\n\nDepuis notre création, nous mettons en relation des voyageurs en quête d’authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses."}
                    </p>
                </div>
                <div className={styles.aboutCover}>
                    <Image
                        src={"/images/About_cover.png"}
                        alt={"Couverture"}
                        fill style={{ objectFit: 'cover'}}
                        loading="eager"
                        className={styles.cover}
                    />
                </div>
            </div>
            <div className={styles.foot}>
                <h2 className={styles.title2}>Notre mission est simple :</h2>
                <ol className={styles.list}>
                    <li>Offrir une plateforme fiable et simple d’utilisation</li>
                    <li>Proposer des hébergements variés et de qualité</li>
                    <li>Favoriser des échanges humains et chaleureux entre hôtes et voyageurs</li>
                </ol>
                <p className={styles.conclusion}>Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.</p>

                <div className={styles.illustration}>
                    <Image
                        src={"/images/About_illustration.png"}
                        alt={"Art"}
                        fill style={{ objectFit: 'cover'}}
                        loading="eager"
                        className={styles.cover}
                    />
                </div>
            </div>
        </div>
    )
}