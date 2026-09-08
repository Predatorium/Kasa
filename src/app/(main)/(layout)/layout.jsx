export const dynamic = 'force-dynamic';

import styles from "./layout.module.css"
import Header from "@/components/Layout/Header"
import Footer from "@/components/Layout/Footer"
import PropertiesProvider from "@/contexts/PropertiesContext"
import { getPropertiesAction } from "@/actions/propertiesActions"

// Layout applicatif : Header/Footer + PropertiesProvider hydraté côté serveur
// avec la liste des logements. force-dynamic car les données dépendent du cookie/API à chaque requête.
export default async function Layout({children}) {
    let initialProperties = null;

    try {
        const propertiesResult = await Promise.all([
            getPropertiesAction(),
        ]);
        initialProperties = propertiesResult[0];
    } catch (error) {
        console.log('Error: ', error)
    }

    return (
        <div className={styles.layout}>
            <Header/>
            <main>
                <PropertiesProvider initialProperties={initialProperties}>
                    {children}
                </PropertiesProvider>
            </main>
            <Footer/>
        </div>
    )
}