import styles from "./layout.module.css"
import Header from "@/components/Layout/Header"
import Footer from "@/components/Layout/Footer"
import PropertiesProvider from "@/contexts/PropertiesContext"
import { getPropertiesAction } from "@/actions/propertiesActions"

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
            <PropertiesProvider initialProperties={initialProperties}>
                {children}
            </PropertiesProvider>
            <Footer/>
        </div>
    )
}