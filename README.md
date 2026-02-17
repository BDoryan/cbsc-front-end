# CBSC Application

Application web (PWA) pour simplifier la gestion du Club Bouliste Saint Couatais.

## Objectif
Centraliser la gestion des membres et des convocations, avec un accès rapide (email/mot de passe ou QR code) et des notifications push.

## Fonctionnalites principales
- Authentification par email/mot de passe ou QR code.
- Tableau de bord avec navigation par role (membre ou bureau).
- Gestion des membres (liste, recherche, creation, edition, suppression).
- Gestion des convocations (creation, edition, suppression, suivi des reponses).
- Notifications push et toasts internes.

## Parcours utilisateur
- Connexion via [src/views/SignIn.jsx](src/views/SignIn.jsx) (email/mot de passe ou QR code).
- Tableau de bord et navigation principale dans [src/views/panel/Panel.tsx](src/views/panel/Panel.tsx).
- Accueil avec actions rapides et abonnement push dans [src/views/panel/Home.tsx](src/views/panel/Home.tsx).

## Roles
Le contexte applicatif distingue les profils suivants:
- Membre: acces aux convocations et a la liste des membres.
- Bureau (managing): gestion complete des membres et des convocations.

La logique est dans [src/views/context/AppContext.tsx](src/views/context/AppContext.tsx).

## Routes principales
Le routeur est defini dans [src/AppRouter.jsx](src/AppRouter.jsx).
- `/signin`: connexion.
- `/signup`: creation de compte (UI en place, pas de logique API pour l'instant).
- `/`: tableau de bord (layout `Panel`).
	- `/members`: liste des membres.
	- `/members/new`: creation d'un membre.
	- `/members/edit/:id`: edition d'un membre.
	- `/competitions`: espace competitions (stub).
	- `/convocations`: liste/gestion des convocations.
	- `/convocations/new`: creation d'une convocation.
	- `/convocations/edit/:id`: edition d'une convocation.
	- `/convocations/:id`: details et suivi des reponses.

## API et authentification
Le client utilise Axios et un token JWT stocke dans `localStorage`.

Le serveur est derive automatiquement:
- Si l'hote commence par `cbsc-app`, l'API est `https://<host>/api/`.
- Sinon, l'API est `http://<host>:8000/api/`.

Endpoints principaux (consommes par le front):
- Auth: `user/login`, `user/me`, `user/logout`.
- Membres: `users`, `users/search`, `users/all`, `users/:id`, `users/:id/generate/token`.
- Convocations: `convocations`, `convocations/search`, `convocations/:id`, `convocations/:id/accept`, `convocations/:id/decline`.
- Push: `subscribe`.

## Notifications et dialogs
- Toasts temporaires dans [src/views/panel/notifications/Notification.tsx](src/views/panel/notifications/Notification.tsx).
- Dialogs de confirmation/information via [src/views/context/DialogContext.tsx](src/views/context/DialogContext.tsx).

## PWA et push notifications
- Service worker enregistre dans [src/index.js](src/index.js) (fichier: [public/service-worker.js](public/service-worker.js)).
- Abonnement push et permissions dans [src/views/panel/Home.tsx](src/views/panel/Home.tsx).

## Structure du projet
- [src/](src/): code React.
	- [src/views/](src/views/): ecrans et composants principaux.
	- [src/views/context/](src/views/context/): contextes app et dialogs.
	- [src/views/panel/](src/views/panel/): pages du tableau de bord.
- [public/](public/): fichiers publics et service worker.

## Stack technique
- React 18 (CRA)
- React Router v6
- Tailwind CSS
- Axios
- react-qr-reader

## Lancer le projet
Installer les dependances:
```bash
npm install
```

Demarrer en local:
```bash
npm start
```

Build de production:
```bash
npm run build
```

Tests:
```bash
npm test
```

## Notes
- Le formulaire d'inscription [src/views/SignUp.tsx](src/views/SignUp.tsx) et l'ecran [src/views/RegisterClub.tsx](src/views/RegisterClub.tsx) sont des squelettes UI sans logique API.
- La gestion des competitions est un placeholder dans [src/views/panel/competitions/Competitions.tsx](src/views/panel/competitions/Competitions.tsx).
