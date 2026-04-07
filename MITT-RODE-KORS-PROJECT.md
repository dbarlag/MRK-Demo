# Mitt Rode Kors - Project Plan

## Overview
A Norwegian Red Cross ("Rode Kors") volunteer member portal. Volunteers log in and can view their dashboard, profile, engagement, competence, schedule/timeplan, and useful links. Data will come from APIs later — for now we build with mock data and mock auth.

---

## Screens (from Figma)

### 1. Dashboard / Home (`1:4739`)
- Greeting: "Hei Ola Norman"
- Welcome text + feedback link ("Gi tilbakemelding")
- 4 quick-nav cards: Min side, Nytting, Min timeplan, Laering
- "Nytting" section with 2 content cards (image + title + description + heart/more actions)
- "Andre tjenester" section with link lists: Administrasjon, Varsling, Planlegging og rapportering, Kurs og laering

### 2. Min side - Profil (`2:12178`)
- Back button ("Tilbake")
- Tabs: **Profil** | Engasjement | Kompetanse
- Profile card: Avatar, name, birthdate, Red Cross email, RK nr, phone, personal email, address
- "Endre" (edit) button
- Parorende (next of kin) section with "Legge til +" button, cards showing name/relation/phone/email with Fjern/Endre actions
- Erkleringer (declarations) section: Etikkerklaeringen, Taushetserklaeringen, Politiattest with status/dates and "Les" links

### 3. Min side - Engasjement (`2:15368`)
- Same tabs, Engasjement active
- **Medlemskap** card: Medlem status (Pagaende), Forening, start/end dates, type, "Endre" button
- **Aktiviteter** cards: activity name, Tag (Pagaende/Fullfort), Forening, start/end dates, Gruppe
- **Roller** cards: role name + Tag, Forening, Aktivitet, dates, Gruppe
- **Verv** cards: title + Tag, Forening, dates

### 4. Membership Alert/CTA (`2:16978`)
- "Ikke Medlem" card with Inaktiv tag
- Forening info
- Description text about membership benefits
- Radio buttons: Medlemskap (300 kr pr. ar) / Familiemedlemskap (600 kr pr. ar)
- Contact info + "Bli medlem" CTA button

### 5. Min side - Kompetanse (`2:17254`)
- Same tabs, Kompetanse active
- **Kurser** cards: course name + Tag (Fullfort), Forening, Dato, Type
- **Spraker** card: language list (Norsk: morsmal, Engelsk: bra, Arabisk: nybegynner) + "Endre" button
- **Sertifikater** card: cert list (Personbil: B, Snoscooter: S) + "Endre" button

### 6. Min timeplan (`5:2048`)
- Tabs: **Kommende** | Mine pameldinger
- Calendar icon + filter chips (Arrangementer, Kurser, Vakter) with X to remove + "Filter" dropdown
- Week pagination: < Uke 1 | **Uke 2** | Uke 3 >
- Event cards: date (day/date/month), title, time, type chip (Arrangement/Kurs/Vakt), Frist date, capacity (325 av 325), status indicator (Apent for pamelding)

---

## Shared UI Components (from Code Connect)

These are already mapped in Figma and should be built as reusable components:

| Component | File | Usage |
|-----------|------|-------|
| Header | `src/components/Header.tsx` | Top nav bar with logo, nav links, dark mode toggle, language picker, user avatar |
| Button | `src/components/Button.tsx` | Primary, secondary, ghost, icon variants |
| Heading | `src/components/Heading.tsx` | h1-h4 typography |
| Paragraph | `src/components/Paragraph.tsx` | Body text |
| Badge | `src/components/Badge.tsx` | Notification badges |
| Avatar | `src/components/Avatar.tsx` | User profile image |
| Switch | `src/components/Switch.tsx` | Dark mode toggle |
| Link | `src/components/Link.tsx` | Styled links with external icon |
| Divider | `src/components/Divider.tsx` | Horizontal rule |
| Tag | `src/components/Tag.tsx` | Status tags (Pagaende, Fullfort, Inaktiv) |
| Tabs | `src/components/Tabs.tsx` | Tab navigation (Profil/Engasjement/Kompetanse, Kommende/Mine pameldinger) |
| Card | `src/components/Card.tsx` | Content card containers |
| Radio | `src/components/Radio.tsx` | Radio button (membership selection) |
| Chip | `src/components/Chip.tsx` | Filter chips (Arrangementer, Kurser, Vakter) |
| Suggestion | `src/components/Suggestion.tsx` | Suggestion cards |
| Pagination | `src/components/Pagination.tsx` | Week pagination for timeplan |

---

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build tool**: Vite
- **Routing**: React Router v6
- **Styling**: CSS Modules or Tailwind CSS (TBD)
- **State**: React Context for auth, local state for the rest (no Redux needed yet)
- **Mock data**: JSON files / in-memory, swappable with real API later

---

## Step-by-Step Implementation Plan

### Phase 1: Project Setup
1. Initialize Vite + React + TypeScript project
2. Install dependencies: react-router-dom
3. Set up folder structure:
   ```
   src/
     components/     # Reusable UI components (from Figma Code Connect)
     pages/          # Page-level components
     layouts/        # MainLayout with Header
     context/        # AuthContext
     data/           # Mock data JSON
     hooks/          # Custom hooks
     types/          # TypeScript interfaces
     assets/         # Icons, images, Rode Kors logo
   ```
4. Set up routing

### Phase 2: Mock Auth
5. Create `AuthContext` with mock login/logout
6. Create mock user data:
   ```ts
   {
     id: "1",
     name: "Ola Norman",
     birthDate: "21.12.1990",
     rkEmail: "kari.hansen@rodekors.org",
     email: "kari.hansen@gmail.com",
     rkNr: "34734758",
     phone: "+47 47 12 12 12",
     address: "Solveien 45c, 1256 Oslo",
     forening: "Volda Rode Kors",
     avatar: "/avatar.jpg"
   }
   ```
7. Create simple login page (email + password, no real validation)
8. Create `ProtectedRoute` wrapper that redirects to login if not authenticated

### Phase 3: Layout & Shared Components
9. Build `Header` component:
   - Rode Kors logo (left)
   - Nav links: Mitt Rode Kors, Min timeplan, Min side/Min profil, Nyttig, Laering
   - Right side: Nattmodus toggle (Switch), Sprak dropdown, user name + Avatar
10. Build base components: Button, Heading, Paragraph, Link, Divider, Tag, Badge, Avatar, Switch, Card, Tabs, Radio, Chip, Pagination
11. Build `MainLayout` that wraps Header + page content

### Phase 4: Dashboard Page
12. Build dashboard page (`/`)
    - Welcome greeting with user name
    - Welcome text + "Gi tilbakemelding" link
    - 4 quick-nav cards (Min side, Nytting, Min timeplan, Laering)
    - Nytting section with content cards
    - Andre tjenester section with categorized link lists

### Phase 5: Min side - Profile Tab
13. Build Min side page (`/min-side`) with tab navigation
14. Build Profil tab:
    - Profile info card with user details
    - "Endre" edit functionality
    - Parorende section (list + add/remove/edit)
    - Erkleringer section (declaration cards with status)

### Phase 6: Min side - Engasjement Tab
15. Build Engasjement tab:
    - Medlemskap card with status tag
    - Aktiviteter cards grid
    - Roller cards
    - Verv cards
16. Build "Ikke Medlem" variant (membership CTA with radio selection)

### Phase 7: Min side - Kompetanse Tab
17. Build Kompetanse tab:
    - Kurser cards with completion tags
    - Spraker card with language list + edit
    - Sertifikater card with cert list + edit

### Phase 8: Min timeplan
18. Build timeplan page (`/min-timeplan`):
    - Tabs: Kommende / Mine pameldinger
    - Filter bar with chips + filter dropdown
    - Week pagination (Uke 1/2/3 with arrows)
    - Event cards with date, title, time, type chip, deadline, capacity, status

---

## Mock API Endpoints (to be replaced with real API later)

These represent the data shape. For now, they'll be mock functions returning hardcoded data.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password, returns user + token |
| POST | `/api/auth/logout` | Logout, clears session |
| GET | `/api/auth/me` | Get current user |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile data |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/parorende` | Get next of kin list |
| POST | `/api/user/parorende` | Add next of kin |
| PUT | `/api/user/parorende/:id` | Update next of kin |
| DELETE | `/api/user/parorende/:id` | Remove next of kin |

### Declarations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/erklaringer` | Get declarations (Etikk, Taushet, Politi) |

### Engagement
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/medlemskap` | Get membership info |
| POST | `/api/user/medlemskap` | Sign up for membership |
| GET | `/api/user/aktiviteter` | Get activities list |
| GET | `/api/user/roller` | Get roles list |
| GET | `/api/user/verv` | Get positions list |

### Competence
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/kurser` | Get courses list |
| GET | `/api/user/spraker` | Get languages |
| PUT | `/api/user/spraker` | Update languages |
| GET | `/api/user/sertifikater` | Get certificates |
| PUT | `/api/user/sertifikater` | Update certificates |

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timeplan?week=2&type=arrangement,kurs,vakt` | Get events for week, filterable by type |
| GET | `/api/timeplan/pameldinger` | Get user's registrations |
| POST | `/api/timeplan/:eventId/meld-pa` | Register for event |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nyttig` | Get "useful" content cards |
| GET | `/api/tjenester` | Get external service links |

---

## Mock Data Files

```
src/data/
  mockUser.ts          # User profile, parorende, erkleringer
  mockEngagement.ts    # Medlemskap, aktiviteter, roller, verv
  mockCompetence.ts    # Kurser, spraker, sertifikater
  mockTimeplan.ts      # Events, pameldinger
  mockDashboard.ts     # Nyttig cards, andre tjenester links
```

---

## Routes

| Path | Page | Auth Required |
|------|------|---------------|
| `/login` | Login page | No |
| `/` | Dashboard | Yes |
| `/min-side` | Min side (redirects to /min-side/profil) | Yes |
| `/min-side/profil` | Profile tab | Yes |
| `/min-side/engasjement` | Engagement tab | Yes |
| `/min-side/kompetanse` | Competence tab | Yes |
| `/min-timeplan` | Schedule/Timeplan | Yes |

---

## Design Tokens (from Figma)

- **Primary red**: Rode Kors red (used in logo, buttons, links, tags)
- **Background**: Light pink/beige tint on some pages (#FFF5F5 approx)
- **Cards**: White with subtle border/shadow
- **Tags**: Green (Pagaende), Light green (Fullfort), Yellow/orange (Inaktiv), Red (Arrangement chip), Green (Kurs chip), Pink (Vakt chip)
- **Typography**: Clean sans-serif, hierarchy with bold headings
- **Dark mode**: Toggle in header (Nattmodus) - can be Phase 2

---

## Notes
- All text is in Norwegian (no i18n needed initially, but language switcher is in header)
- The "Gi tilbakemelding" link and "Andre tjenester" links are external
- Membership CTA (node `2:16978`) appears as an alert/card variant when user is not a member
- Mock login: any email/password combination works
