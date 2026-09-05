'use client'

import { useAuth } from "@/contexts/AuthContext";
import { redirect, useRouter } from "next/navigation";
import styles from "./add.module.css"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Clickable/Button";
import { useActionState, useState, useEffect } from "react";
import AddProperty from "./action";
import InputLabel from "@/components/Utils/InputLabel";
import ImageLabel from "@/components/Utils/ImageLabel";
import { KasaLinkButton } from "@/components/Clickable/Link";
import CheckBox from "@/components/Utils/CheckBox";
import Tag from "@/components/Utils/Tag";

const Equipments = [ 
    "Micro-Ondes", "Clic-clac", "Douche italienne", "Four", "Frigo", 
    "Rangements", "WIFI", "Lit", "Parking", "Bouilloire", "Sèche Cheveux",
    "SDB", "Machine à laver", "Toilettes sèches", "Cuisine équipée",
    "Cintres", "Télévision", "Baie vitrée", "Chambre Séparée", "Hotte",
    "Climatisation", "Baignoire", "Frigo Américain", "Vue Parc"
]

export default function Add() {
    const { user } = useAuth();
    if (!user) {
        redirect("/login");
    }

    const [actionData, formAction, isPending] = useActionState(AddProperty, null);
    const router = useRouter();

    useEffect(() => {
        if (actionData?.success && actionData.property?.id) {
            router.push(`/property/${actionData.property.id}`);
        }
    }, [actionData, router]);

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput("");
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    // un id unique par champ affiché à l'écran
    const [propertyFields, setPropertyFields] = useState([{ id: "initial" }])
    
    const handleAddField = () => {
        setPropertyFields((prev) => [...prev, { id: crypto.randomUUID() }])
    }

    return (
        <form action={formAction} className={styles.page}>
            <Link href="/" className={styles.button} >
                <Image
                    src="/images/Back.svg"
                    alt="Icon back"
                    width={16}
                    height={16}
                    loading="eager"
                />
                Retour
            </Link>
            <div className={styles.add}>
                <h1 className={styles.title}>Ajouter une propriété</h1>
                <Button type="submit" content="Ajouter"/>
            </div>
            
            {actionData?.error && <p className={styles.error}>{actionData.error}</p>}

            <div className={styles.greatSection}>
                <div className={styles.section}>
                    <InputLabel type="text" nameId="name" content="Titre de la propriété" placeholder="Ex : Appartement cosy au coeur de paris" />
                    <div className={styles.area}>
                        <InputLabel type="textarea" nameId="description" content="Description" placeholder="Décrivez votre propriété en détail..." />
                    </div>
                    <InputLabel type="text" nameId="postalCode" content="Code postal" />
                    <InputLabel type="text" nameId="localisation" content="Localisation" />
                    <InputLabel type="text" nameId="price_per_night" content="Prix pour la nuit" />

                </div>
                <div className={styles.parent}>
                    <div className={styles.subSection}>
                        <ImageLabel 
                            nameId="Cover"
                            name="Cover"
                            content="Image de couverture" 
                            icon="Plus_white" 
                        />
                        {propertyFields.map((field) => (
                            <ImageLabel
                                key={field.id}
                                nameId={`propertyPicture-${field.id}`}
                                name="propertyPicture"
                                content="Image du logement"
                                icon="Plus_white"
                            />
                        ))}
                        <KasaLinkButton onClick={handleAddField}>+Ajouter une image</KasaLinkButton>
                    </div>
                    <div className={styles.subSection}>
                        <InputLabel type="text" nameId="hostName" content="Nom de l’hôte" />
                        <ImageLabel 
                            nameId="hostPicture"
                            name="hostPicture"
                            content="Photo de profil" 
                            icon="Plus_white" 
                        />
                    </div>
                </div>

            </div>
            <div className={styles.greatSection}>
                <div className={styles.section}>
                    <h2 className={styles.title2}>Équipements</h2>
                    <div className={styles.equips}>
                    {Equipments.map((equip, index) => (
                        <CheckBox
                            key={index}
                            nameId={`Equip ${index}`}
                            name="equipments"
                            value={equip}
                            content={equip}
                        />
                    ))}
                    </div>
                </div>
                <div className={styles.section}>
                    <h2 className={styles.title2}>Catégories</h2>
                    <div className={styles.tagList}>
                        {tags.map((tag, index) => (
                            <Tag key={index} text={tag} onClick={() => removeTag(index)} />
                        ))}
                        {tags.length === 0 && <p className={styles.empty}>Aucune tag ajouter</p>}
                    </div>

                    {tags.map((tag, index) => (
                        <input key={index} type="hidden" name="tags" value={tag} />
                    ))}
                    <ImageLabel
                        nameId="newTag"
                        content="Ajouter une catégorie personnalisée" 
                        placeholder="Nouveau tag" 
                        icon="Plus_white"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onClick={addTag}
                    />

                </div>
            </div>

        </form>
    )
}