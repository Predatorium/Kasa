'use client'

import styles from "./register.module.css"
import Register from "./action"
import { useActionState, useEffect } from "react";
import KasaLink from "@/components/Clickable/Link";
import InputLabel from "@/components/Utils/InputLabel";
import { Button } from "@/components/Clickable/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [actionData, formAction, isPending] = useActionState(Register, null);
    const { setUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (actionData?.success && actionData.user) {
            setUser(actionData.user);   // contexte à jour immédiatement
            router.push('/');           // navigation côté client, après coup
        }
    }, [actionData, setUser, router]);

    return (
        <div className={styles.page}>
            <form action={formAction} className={styles.register}>
                <div className={styles.head}>
                    <h1 className={styles.title}>Rejoignez la communauté Kasa</h1>
                    <p className={styles.subsection}>Créez votre compte et commencez à voyager autrement : 
                        réservez des logements uniques, découvrez de nouvelles destinations et partagez vos 
                        propres lieux avec d’autres voyageurs.</p>
                </div>

                {actionData?.error && <p className={styles.error}>{actionData.error}</p>}

                <div className={styles.form}>
                    <InputLabel type='text' nameId='name' content='Nom' />
                    <InputLabel type='text' nameId='firstName' content='Prénom' />
                    <InputLabel type='email' nameId='email' content='Email' />
                    <InputLabel type='password' nameId='password' content='Mot de passe' />
                    <div className={styles.wrapperRole}>
                        <label htmlFor="role" className={styles.labelRole}>Role :</label>
                        <select name="role" defaultValue="client" className={styles.role}>
                            <option value="client">User</option>
                            <option value="owner">Owner</option>
                        </select>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button content="S’inscrire" type="submit"/>
                    <KasaLink link="/login" >Déjà membre ? Se connecter</KasaLink>
                </div>
            </form>
        </div>
    )
}