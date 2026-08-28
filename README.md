# ESMAD Eco-Escolas — Frontend

The mobile and web app for the **ESMAD Eco-Escolas** project. It's the face of an
environmental program at ESMAD (Escola Superior de Media Artes e Design, part of the
Politécnico do Porto), where students, professors and staff keep an eye on how the
school uses resources and how it can do better.

This repo is the **client**. The server it talks to lives in the
[`ecoescolas-backend`](https://github.com/thiagocmps/ecoescolas-backend) repo.

## What the app does

Three things, really:

1. **Atividades** — professors create eco/environmental activities for students to sign
   up to, and the whole lifecycle happens in-app: register, get validated as a member, and
   report monthly utilities (gás, água, luz) against the activity.
2. **Ocorrências** — anyone at the school can flag an eco issue (leaking tap, broken
   light, mold, waste in the gardens, ...) with a location and photos, and the workers
   manage it from start to finish.
3. **Contas & roles** — four roles with different screens, and admins keep the accounts
   themselves in check.

## Roles

The UI adapts based on the logged-in user's role:

| Role | What they see |
|------|---------------|
| **student** | Browse activities, sign up, view subscriptions, track monthly expenses, report occurrences |
| **professor** | Everything a student does, plus "Minhas Atividades" — create, edit, delete and manage their own activities |
| **worker** | A leaner experience focused on "Ocorrências" and their account |
| **admin** | "Validar contas" — approve or reject pending account registrations |

## How authentication works

Only **ESMAD addresses** can register. The backend checks the email against
`@esmad.ipp.pt`: the typical student format `12345678@esmad.ipp.pt` becomes a *student*,
any other ESMAD address becomes a *professor*. Anything else is rejected outright.

Once you log in, the backend hands back a **JWT**. On native (Android/iOS) it's stored in
[`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/); on web it
lands in `localStorage`. An axios interceptor attaches it to every request as a
`Bearer` token, and a small decoded-token hook (`useGetDecodedToken`) tells the app who's
logged in.

New accounts start as `pending` — an admin has to validate you before you can do much.

## How an activity lifecycle works

This is the part I'm honestly most proud of, because it's a real multi-step flow, not just
a CRUD:

```
professor creates activity ─► students discover & sign up
        │                                │
        ▼                                ▼
 página de informações        registration (pending)
 (enquadramento, objetivos,        │
  prazos, critérios, júri,         ▼
  prémios, cover)          professor validates member
        ▲                                │
        │                                ▼
   professor can edit           member reports gás / água / luz
        └─── monthly expenses against the activity (once per month)
```

- **Creation** — a professor fills in the full pitch: `enquadramento`, `objetivos`,
  `atividade`, `info_solicitada`, `prazos`, `criterio_de_avaliacao`, `juri`,
  `premios_mencoes_honrosas` and a `cover` image. The `activity-info-page` renders all of it.
- **Sign up** — a student opens an activity and taps to register. The backend guards against
  duplicates per user per activity.
- **Validation** — the professor sees the list of members (`/activities/members/:id`),
  validates them one by one, and can remove them.
- **Monthly expenses** — each validated member can log their monthly utility consumption,
  one entry per month per resource (gas / water / light). The backend refuses to store a
  second entry for the same month — that check runs server-side.

## How reports (occurrences) work

On `report.tsx` a user can create an "ocorrência": pick a **category** — water, electricity,
outdoor environments, each with a friendly label — pick a **location** (Bloco A–G, a room,
a bathroom, patios, ...) and optionally attach **photos** via the image picker.

The report then sits as `pending`, and a **worker** can update its status to keep track
until it's resolved. Users can only delete their own reports; workers can clear any.

## Tech stack

- [Expo](https://expo.dev) (~SDK 53) with **React Native** — one codebase for Android, iOS and web
- [React Navigation](https://reactnavigation.org) — native stack, bottom tabs and a drawer
  (the drawer drives the web layout, tabs drive mobile)
- [axios](https://axios-http.com) — the API client
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — report & cover photos
- [react-native-paper](https://reactnativepaper.com) — UI components, plus
  `react-native-toast-message` for feedback
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) — JWT storage on native

## Project structure

```
src/
├── app/App.tsx                     # root components + navigation container
├── navigation/
│   ├── routes.tsx                  # stack + per-role drawers
│   ├── bottom-navigator.tsx        # bottom tabs (mobile)
│   ├── auth/                       # login.tsx, register.tsx
│   └── screens/                    # activities, reports, subscriptions, account, ...
├── services/
│   ├── base-api-url.tsx            # axios instance (base URL + headers)
│   └── api-requests.tsx            # every request to the backend, one function each
├── utilities/                      # jwt helpers, types, image-picker, fetch-on-focus
└── components/                     # button, input, modal, list-card, image-carrousel,
                                    # monthly-expense-inputs, dropdown-select, tag, ...
```

Everything that talks to the server is concentrated in `services/api-requests.tsx`, so the
screens stay thin and just call typed helpers.

## Running it

```bash
npm install

npm run start        # Expo dev server
npm run web          # launch in the browser
npm run android      # launch on Android
npm run ios          # launch on iOS
```

By default the client points at the live backend
(`https://ecoescolas-backend.onrender.com`). If you're developing against a local server,
flip the `isLocalhost` flag at the top of `src/services/base-api-url.tsx`.

### Deploying

```bash
npm run deploy        # builds the web export + pushes dist/ to GitHub Pages
```

`deploy` runs the `web-build` script first (`expo export --platform web` + a small path
fixer), then hands `dist/` to `gh-pages`. The app also has an EAS setup (`eas.json`) if you
want to ship proper Android/iOS builds.

## The backend

The API lives in the **`ecoescolas-backend`** repo — a Node/Express + MongoDB service.
Worth mentioning a few endpoints you'll see referenced from here:

```
POST   /users/login                 -> JWT
POST   /users/register              -> new account
GET    /activities                  -> list activities
POST   /activities/add              -> professor creates
POST   /activities/registrations/add -> student signs up
PUT    /activities/registrations/update -> validate member / add images / add monthly expense
POST   /reports/create              -> new occurrence
GET    /reports/all                 -> all occurrences (worker only)
```

The full contract — routes, controllers and models — is documented in that repo's README.

---

That's it. It's a small team-built student project, but the activity flow and the
role-aware UI are what make it feel like a real product rather than a to-do list.
