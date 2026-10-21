# Kasa

Application web de location de logements (type Airbnb), développée avec **Next.js** dans le cadre de la formation OpenClassrooms (Développeur d'application full stack).

**Démo** : [kasaweb-drab.vercel.app](https://kasaweb-drab.vercel.app)

![Page d'accueil](docs/accueil.png)
<!-- À ajouter : 2 ou 3 captures dans docs/ (accueil, détail d'un logement, favoris) -->

## Fonctionnalités

- Page d'accueil avec la liste des logements
- Page « À propos »
- Page de détail d'un logement avec carrousel de photos
- Inscription et connexion
- Ajout d'un logement
- Gestion des favoris

## Stack technique

- **Next.js 16** (App Router, Server Components, Server Actions) et **React 19**, en JavaScript
- API backend séparée : [API_Kasa](https://github.com/Predatorium/API_Kasa) (Express + SQLite)
- Authentification par cookie JWT `httpOnly`
- Tests unitaires avec **Vitest** et **Testing Library**
- Documentation du code avec **JSDoc**
- ESLint

## Lancer le projet

Prérequis : [Node.js](https://nodejs.org/) (version LTS recommandée) et npm.

**1. Démarrer l'API**, en suivant le README de [API_Kasa](https://github.com/Predatorium/API_Kasa) (elle écoute par défaut sur le port 8000).

**2. Démarrer le front**

```bash
git clone https://github.com/Predatorium/Kasa.git
cd Kasa
npm install
cp .env.example .env
```

Dans `.env`, renseigne l'URL de l'API :

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Puis :

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Lance le build de production |
| `npm run lint` | Analyse du code avec ESLint |
| `npm test` | Tests Vitest en mode watch |
| `npx vitest run` | Lance les tests une seule fois |
| `npm run test:ui` | Tests avec l'interface graphique Vitest |
| `npm run test:coverage` | Tests avec rapport de couverture |
| `npm run docs` | Génère la documentation JSDoc dans `docs/` |

## Tests

Les tests couvrent notamment les contextes (`AuthContext`, `FavoritesContext`), les composants principaux (carrousels, carte de logement, formulaire d'ajout) et les pages de connexion et d'inscription.

## Authentification

- À la connexion, une Server Action appelle l'API puis pose un cookie JWT `httpOnly` côté serveur : le token n'est jamais accessible au JavaScript du navigateur.
- Un `AuthContext` expose l'utilisateur courant via `useAuth()` (`user`, `loading`, `error`, `refreshProfile`, `editProfile`, `clearUser`).
- Les actions `login` et `register` renvoient `{ success, user }` ; c'est le composant client (`useActionState`) qui met à jour le contexte puis redirige.
- Un proxy (`proxy.js`) gère les redirections : `/` renvoie vers `/home`, et seules `/home`, `/about`, `/login` et `/register` sont accessibles sans être connecté.

## Pages

| Route | Page |
|---|---|
| `/home` | Liste des logements |
| `/about` | Présentation |
| `/property/[id]` | Détail d'un logement |
| `/login`, `/register` | Connexion et inscription |
| `/property/add` | Ajout d'un logement |
| `/property/favourites` | Favoris |

## Choix et apprentissages

- Server Components pour charger les données, Server Actions pour les appels à l'API.
- Cookie `httpOnly` plutôt que `localStorage`, pour limiter l'exposition du token.
- Organisation des composants en dossiers avec un fichier `index.jsx`.
- Un journal des échanges avec l'IA utilisée pendant le projet est disponible dans le fichier [`Journal_IA`](Journal_IA).

> [À compléter : une ou deux phrases sur ce que tu as trouvé le plus difficile ou le plus formateur sur ce projet.]

## Compte de test

> [À compléter : e-mail et mot de passe d'un compte de démonstration. Crée un compte jetable avec de fausses données.]

## Auteur

Laurent Canonge · [GitHub](https://github.com/Predatorium) · [LinkedIn à ajouter]
