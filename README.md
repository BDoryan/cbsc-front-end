# CBSC Application

Web application (PWA) designed to simplify the management of the Club Bouliste Saint Couatais.

## Objective

Centralize member and event (convocation) management, with quick access (email/password or QR code) and push notifications.

## Main Features

* Authentication via email/password or QR code
* Dashboard with role-based navigation (member or admin)
* Member management (list, search, create, edit, delete)
* Convocation management (create, edit, delete, response tracking)
* Push notifications and in-app toasts

## User Flow

* Login via [src/views/SignIn.jsx](src/views/SignIn.jsx) (email/password or QR code)
* Dashboard and main navigation in [src/views/panel/Panel.tsx](src/views/panel/Panel.tsx)
* Home with quick actions and push subscription in [src/views/panel/Home.tsx](src/views/panel/Home.tsx)

## Roles

The application defines the following roles:

* Member: access to convocations and member list
* Admin (managing): full management of members and convocations

Logic is handled in [src/views/context/AppContext.tsx](src/views/context/AppContext.tsx).

## Main Routes

The router is defined in [src/AppRouter.jsx](src/AppRouter.jsx).

* `/signin`: login
* `/signup`: account creation (UI only, no API logic yet)
* `/`: dashboard (layout `Panel`)

  * `/members`: member list
  * `/members/new`: create member
  * `/members/edit/:id`: edit member
  * `/competitions`: competitions section (stub)
  * `/convocations`: convocations list/management
  * `/convocations/new`: create convocation
  * `/convocations/edit/:id`: edit convocation
  * `/convocations/:id`: details and response tracking

## API and Authentication

The client uses Axios and a JWT token stored in `localStorage`.

The server is automatically determined:

* If the host starts with `cbsc-app`, the API is `https://<host>/api/`
* Otherwise, the API is `http://<host>:8000/api/`

Main endpoints (used by the frontend):

* Auth: `user/login`, `user/me`, `user/logout`
* Members: `users`, `users/search`, `users/all`, `users/:id`, `users/:id/generate/token`
* Convocations: `convocations`, `convocations/search`, `convocations/:id`, `convocations/:id/accept`, `convocations/:id/decline`
* Push: `subscribe`

## Notifications and Dialogs

* Temporary toasts in [src/views/panel/notifications/Notification.tsx](src/views/panel/notifications/Notification.tsx)
* Confirmation/information dialogs via [src/views/context/DialogContext.tsx](src/views/context/DialogContext.tsx)

## PWA and Push Notifications

* Service worker registered in [src/index.js](src/index.js) (file: [public/service-worker.js](public/service-worker.js))
* Push subscription and permissions handled in [src/views/panel/Home.tsx](src/views/panel/Home.tsx)

## Project Structure

* [src/](src/): React code

  * [src/views/](src/views/): main screens and components
  * [src/views/context/](src/views/context/): app and dialog contexts
  * [src/views/panel/](src/views/panel/): dashboard pages
* [public/](public/): public files and service worker

## Tech Stack

* React 18 (CRA)
* React Router v6
* Tailwind CSS
* Axios
* react-qr-reader

## Run the Project

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm start
```

Production build:

```bash
npm run build
```

Tests:

```bash
npm test
```

## Notes

* The signup form [src/views/SignUp.tsx](src/views/SignUp.tsx) and the screen [src/views/RegisterClub.tsx](src/views/RegisterClub.tsx) are UI-only placeholders without API logic
* The competitions feature is a placeholder in [src/views/panel/competitions/Competitions.tsx](src/views/panel/competitions/Competitions.tsx)
