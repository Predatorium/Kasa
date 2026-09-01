'use client'

import styles from "./login.module.css"
import Login from "./action"
import { useActionState, useEffect } from "react";
import KasaLink from "@/components/Clickable/Link";
import InputLabel from "@/components/Utils/InputLabel";
import { Button } from "@/components/Clickable/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [actionData, formAction, isPending] = useActionState(Login, null);
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
            <form action={formAction} className={styles.login}>
                <div className={styles.head}>
                    <h1 className={styles.title}>Heureux de vous revoir</h1>
                    <p className={styles.subsection}>
                        Connectez-vous pour retrouver vos réservations, 
                        vos annonces et tout ce qui rend vos séjours uniques.</p>
                </div>

                {actionData?.error && <p className={styles.error}>{actionData.error}</p>}

                <div className={styles.form}>
                    <InputLabel type='email' nameId='email' content='Email' />
                    <InputLabel type='password' nameId='password' content='Mot de passe' />
                </div>
                <div className={styles.actions}>
                    <Button content="Se connecter" type="submit"/>
                    <div className={styles.links}>
                        <KasaLink link="/login" >Mot de passe oublié</KasaLink>
                        <KasaLink link="/register" >Pas encore de compte ? Inscrivez-vous</KasaLink>
                    </div>
                </div>
            </form>
        </div>
    )
}