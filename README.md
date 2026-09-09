# Kasa

Kasa est une application web de location de logements (type Airbnb), développée avec **Next.js** dans le cadre d'un projet **OpenClassrooms**.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du projet](#lancement-du-projet)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Authentification](#authentification)

## Fonctionnalités

- Page d'accueil avec liste des logements
- Page "À propos"
- Page détail d'un logement
- Connexion / Inscription
- Ajout d'un logement
- Gestion des favoris

## Stack technique

- **Next.js** (JavaScript)
- API backend séparée (consommée via des Server Actions / fetch)
- Authentification par cookie JWT httpOnly
- Tests unitaires avec **Vitest** et **Testing Library**

## Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- npm

## Installation

Cloner le dépôt puis installer les dépendances :

```bash
git clone <url-du-repo>
cd kasa
npm install
```

## Lancement du projet

```bash
npm run dev
```

L'application est ensuite accessible sur [http://localhost:3000](http://localhost:3000).

> ⚠️ Le projet consomme une API backend séparée. Assure-toi que celle-ci est démarrée et accessible (voir sa configuration/URL dans les variables d'environnement du projet).
lien de l'api https://github.com/OpenClassrooms-Student-Center/dev-react-P12.

## Tests

Les tests unitaires sont écrits avec [Vitest](https://vitest.dev/) et [Testing Library](https://testing-library.com/).

```bash
npm run test            # lance les tests en une fois
npm run test:ui         # lance les tests avec l'interface graphique Vitest
npm run test:coverage   # lance les tests avec rapport de couverture
```

Ils couvrent notamment les contextes (`AuthContext`, `FavoritesContext`), les composants critiques (carrousels, carte de logement, formulaire d'ajout) et les pages de connexion/inscription.

## Structure du projet

Le projet s'articule autour des pages suivantes :

- `Home` – liste des logements
- `About` – présentation
- `Logement` – détail d'un logement
- `Login` – connexion
- `Register` – inscription
- `Ajouter un logement`
- `Favoris`

Toutes les pages partagent un layout global, à l'exception de la messagerie qui possède son propre affichage responsive.

Un proxy (`proxy.js`) gère les redirections et l'accès aux routes :
- `/` redirige vers `/home`
- Les routes `/home`, `/about`, `/register` et `/login` sont accessibles sans authentification

## Authentification

L'authentification repose sur un cookie JWT httpOnly posé côté serveur lors du login.

Le contexte d'authentification (`AuthContext`) expose via `useAuth()` :
- `user`
- `loading`
- `error`
- `refreshProfile`
- `editProfile`
- `clearUser`

Le `AuthProvider` reçoit un `initialUser` résolu côté Server Component (`getUserByIdAction`).

Les actions `login` et `register` renvoient `{ success, user }` (pas de redirection serveur) : c'est le composant client, via `useActionState`, qui met à jour le contexte (`setUser`) puis effectue la redirection côté client (`router.push`).