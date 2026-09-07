'use client'

import styles from "./property.module.css"
import { ButtonLink } from "@/components/Clickable/Button";
import Image from "next/image";
import Tag from "@/components/Utils/Tag";
import Carrousel from "@/components/Utils/Carroussel";
import Link from "next/link";
import ModalCarroussel from "@/components/Utils/ModalCarroussel"
import { useState } from "react";

export default function PropertyContent({ property }) {
    const { title, description, location, rating_avg, host, pictures, equipments, tags } = property;
    const { id, name, picture } = host;
    const [indexPicture, setIndexPicture] = useState(0);
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.page}>
            <div className={styles.back}>
                <Link href="/" className={styles.button} >
                    <Image
                        src="/images/Back.svg"
                        alt="Icon back"
                        width={16}
                        height={16}
                        loading="eager"
                    />
                    Retour aux annonces
                </Link>
            </div>
            <div className={styles.propertyPage}>
                <div className={styles.property}>
                    <Carrousel pictures={pictures} onClick={setOpen} setIndex={setIndexPicture} />
                    <div className={styles.infos}>
                        <div className={styles.top}>
                            <div className={styles.subtop}>
                                <h1 className={styles.title}>{title}</h1>
                                <p className={styles.location}>
                                    <Image
                                        src={"/images/Localisation.svg"}
                                        alt="icone location"
                                        width={16}
                                        height={16}
                                        loading="eager"
                                    />
                                    {location}
                                </p>

                            </div>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.equipments}>
                            <h2 className={styles.title2}>Équipements</h2>
                            <div className={styles.tags}>
                                {equipments.map((equipment, index) => (
                                    <Tag key={index} text={equipment} fitContainer={true} />
                                ))}
                            </div>
                        </div>
                        <div className={styles.categories}>
                            <h2 className={styles.title2}>Catégorie</h2>
                            <div className={styles.tags}>
                                {tags.map((tag, index) => (
                                    <Tag key={index} text={tag} fitContainer={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.host}>
                    <h2 className={styles.title3}>Votre hôte</h2>
                    <div className={styles.hostInfo}>
                        <Image
                            src={picture}
                            alt={`Picture ${name}`}
                            width={81}
                            height={82}
                            loading="eager"
                            className={styles.hostPicture}
                        />
                        <p className={styles.hostName}>{name}</p>
                        <div className={styles.rate}>
                            <Image
                                src={"/images/Star.svg"}
                                alt={"star"}
                                width={19}
                                height={23}
                                loading="eager"
                            />
                            <p className={styles.rating}>{rating_avg}</p>
                        </div>
                    </div>
                    <ButtonLink link={"/messaging"} content="Contacter l’hôte" fitContainer={true} />
                    <ButtonLink link={"/messaging"} content="Envoyer un message" fitContainer={true} />
                </div>
            </div>
            <div className={`${styles.modal} ${open ? styles.open : ""}`}>
                <ModalCarroussel pictures={pictures} startIndex={indexPicture} onClose={() => setOpen(false)} isOpen={open}/>
            </div>
        </div>
    )
}