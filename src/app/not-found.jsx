import styles from "./not-found.module.css"
import { ButtonLink } from "@/components/Clickable/Button";
import Layout from "./(main)/(layout)/layout";
import GlobalLayout from "./(main)/layout";

export default function NotFound() {
  return (
    <GlobalLayout>
      <Layout>
        <div className={styles.notfound}>
          <div className={styles.head}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.content}>{"Il semble que la page que vous cherchez ait pris\ndes vacances… ou n’ait jamais existé."}</p>
          </div>
          <div className={styles.actions}>
            <ButtonLink link={"/"} content="Accueil" fitContainer={true} />
            <ButtonLink link={"/"} content="Logements" fitContainer={true} />
          </div>
        </div>
      </Layout>
    </GlobalLayout>
  );
}