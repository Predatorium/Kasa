import styles from "./not-found.module.css"
import KasaLink from "@/components/Clickable/Link";

export default function NotFound() {
  return (
    <div className={styles.notfound}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.content}>Page introuvable</p>
      <KasaLink link={"/"}>Retour</KasaLink>
    </div>
  );
}