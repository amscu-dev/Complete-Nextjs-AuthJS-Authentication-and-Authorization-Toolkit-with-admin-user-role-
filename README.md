# Next-Auth Toolkit

**Puteți încerca o versiune complet funcțională a acestui feature :** https://complete-nextjs-auth-js-alexandru-marinescus-projects-24c51d30.vercel.app/

**Sursa video pentru prezentarea toolkit-ului :**

## Descriere

Un toolkit complet pentru gestionarea autentificării și autorizării în aplicațiile NextJS. Acest proiect oferă o soluție robustă și scalabilă pentru implementarea funcționalităților de înregistrare, autentificare (inclusiv 2FA), resetare parolă, verificare email și administrarea setărilor utilizatorului, toate acestea cu suport pentru controlul accesului bazat pe roluri (de exemplu, ADMIN și USER).

## Cuprins

- [Funcționalități](#funcționalități)
- [Tehnologii folosite](#tehnologii-folosite)
- [Arhitectura Aplicației](#arhitectura-aplicației)
- [Integrare și Personalizare](#integrare-și-personalizare)
- [Instalare și Configurare](#instalare-și-configurare)

## Funcționalități

- **Înregistrare și Verificare Email:**

  - Formular de înregistrare validat cu Zod.
  - Criptarea parolelor folosind bcryptjs.
  - Generarea unui token unic de verificare și trimiterea acestuia prin email folosind Resend.

- **Autentificare (Login) cu Suport 2FA:**

  - Validarea credentialelor prin schema `LoginSchema`.
  - Integrare cu NextAuth pentru gestionarea sesiunilor.
  - Suport pentru autentificare cu doi factori (2FA):
    - Generarea și verificarea token-urilor 2FA.
    - Expirarea automată a token-urilor și curățarea acestora din baza de date.

- **Resetare Parolă:**

  - Generarea unui token securizat pentru resetarea parolei.
  - Flux de resetare a parolei cu notificare prin email.

- **Verificare Email:**

  - Verificare bazată pe token pentru confirmarea email-ului utilizatorului.
  - Actualizarea statutului de verificare în baza de date după confirmare.

- **Setări Utilizator:**

  - Actualizarea informațiilor de profil (nume, email, parolă).
  - Schimbarea parolei și gestionarea opțiunii de 2FA.
  - Administrarea rolurilor (ADMIN/USER) pentru cazuri de utilizare avansate.

- **Controlul Accesului Bazat pe Roluri:**

  - Acțiuni server și rute API protejate pe baza rolurilor utilizatorilor.
  - Componenta `RoleGate` pentru redare condiționată în componentele client.
  - Middleware pentru securizarea rutelor și redirecționarea utilizatorilor neautentificați sau neautorizați.

- **Interfață Modernă și Responsivă:**
  - UI construit cu Tailwind CSS și componente reutilizabile (Carduri, Butoane, Formulare, Input-uri etc.).
  - Suport pentru notificări prin Sonner și feedback vizual cu loaders și iconițe.

## Tehnologii folosite

- **Framework & Biblioteci:**

- [NextJS 15.1.7](https://nextjs.org/): Framework pentru React folosit pentru a construi aplicații full-stack cu server-side rendering și static site generation.
- [NextAuth v5](https://next-auth.js.org/): Bibliotecă pentru gestionarea autentificării utilizatorilor, bazată pe OAuth, credentials și sesiunile utilizatorilor.
- [Prisma](https://www.prisma.io/): ORM (Object-Relational Mapping) pentru interacțiunea cu baza de date.
- [shadcn/ui](https://ui.shadcn.com/) : Component library folosită pentru UI-ul aplicației, cu componente accesibile și personalizabile.
- [Tailwind CSS](https://tailwindcss.com/): Framework CSS pentru a crea un design responsive și ușor de personalizat.
- [React 19](https://react.dev/): Biblioteca principală pentru construirea interfețelor de utilizator.
- [React Hook Form](https://react-hook-form.com/): Folosit pentru gestionarea formularelor și validarea acestora în aplicație (client-side).
- [Zod](https://github.com/colinhacks/zod): Biblioteca pentru validarea schemelor.
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js): Folosit pentru criptarea parolelor utilizatorilor.
- [UUID](https://www.npmjs.com/package/uuid): Generarea de identificatori unici pentru utilizatori.
- [Resend](https://resend.com/): Serviciu pentru trimiterea de e-mailuri, utilizat pentru validarea conturilor de email, two factor authentification si resetare parolei.
- [Prisma Adapter](https://next-auth.js.org/v3/adapters/prisma): Permite integrarea cu Prisma pentru gestionarea autentificării.
- [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) – pentru iconițe.

- **Instrumente de Dezvoltare:**
  - TypeScript pentru siguranța tipurilor.
  - ESLint pentru verificarea stilului de cod.
  - Migrate Prisma pentru gestionarea schemei bazei de date.
  - PostCSS și Tailwind CSS pentru stilizare.

## Arhitectura Aplicației

Aplicația se bazează pe o arhitectură clasică Client-Server, în care:

### Frontend

- **Next.js & React:**

  - Interfața este construită cu Next.js, permițând renderizarea atât pe server, cât și pe client pentru performanță optimă.
  - Componentele React sunt structurate modular, facilitând reutilizarea și scalabilitatea.
  - **Componente Reutilizabile:**  
    UI-ul este compus din componente reutilizabile (ex.: carduri, butoane, formulare, input-uri), care asigură un design consistent și o dezvoltare rapidă.

- **Tailwind CSS & Iconografie:**

  - Stilizarea se realizează cu Tailwind CSS.
  - Iconurile sunt furnizate de Lucide React și React Icons.

- **Formulare și Validare:**
  - React Hook Form și Zod asigură gestionarea și validarea eficientă a datelor în formulare.

### Backend

- **NextAuth & Middleware:**

  - NextAuth.js gestionează autentificarea și sesiunile, integrând diverse fluxuri de login (credentiale, OAuth, 2FA).
  - Middleware-ul protejează rutele, redirecționând utilizatorii neautentificați către pagina de login .

- **Prisma & Baza de Date:**

  - Prisma se ocupă de interacțiunea cu baza de date PostgreSQL, gestionând entități precum utilizatori, token-uri de verificare și 2FA.
  - Migrațiile Prisma asigură o schemă de date coerentă și scalabilă.

- **Acțiuni Server Personalizate:**
  - Funcțiile de server (în folderul `/actions`) implementează logica de business pentru autentificare, resetare parolă și actualizarea setărilor utilizatorului.

## Integrare și Personalizare

Pentru a integra acest toolkit în proiectul tău, ia în considerare următoarele aspecte de personalizare:

1. **Variabile de Mediu:**

   - Configurează variabilele necesare într-un fișier `.env`:
     - `DATABASE_URL` și `DATABASE_URL_UNPOOLED` pentru PostgreSQL.
     - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` pentru OAuth Google.
     - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` pentru OAuth GitHub.
     - `NEXTAUTH_SECRET` pentru sesiunile NextAuth.
     - `RESEND_API_KEY` pentru serviciul de email.
     - `NEXT_PUBLIC_APP_URL` pentru construcția link-urilor din emailuri.

2. **Schema Bazei de Date:**

   - Revizuiește și, dacă este necesar, modifică schema Prisma (`prisma/schema.prisma`).
   - Rulează migrațiile după modificări:
     ```bash
     npx prisma migrate dev
     ```

3. **Rute și Middleware:**

   - Personalizează rutele publice și protejate definite în `/routes` conform nevoilor aplicației tale.
   - Ajustează logica middleware-ului dacă cerințele de rutare diferă.

4. **Personalizarea UI:**

   - UI-ul este construit cu Tailwind CSS. Poți modifica stilurile sau structura componentelor după necesitate.
   - Actualizează elementele de branding (logo, scheme de culori, fonturi) în fișierele CSS globale și în componente.

5. **Logica de Autentificare:**
   - Fluxurile de autentificare (înregistrare, login, 2FA, resetare parolă, verificare email) sunt implementate folosind NextAuth și acțiuni server personalizate.
   - Poți modifica logica din folderul `/actions` sau configurația NextAuth (`auth.config.ts` și middleware) pentru a se potrivi cerințelor tale.

## Instalare și Configurare

1. Clonează repository-ul:

   ```bash
   git clone https://github.com/amscu-dev/Complete-Nextjs-AuthJS-Authentication-and-Authorization-Toolkit-with-admin-user-role-
   cd next-auth-toolkit
   ```

2. Instalează Dependențele:

   ```bash
   npm install
   ```

3. Configurează Variabilele de Mediu:

Creează un fișier .env în rădăcina proiectului și adaugă variabilele necesare (a se vedea secțiunea de Integrare și Personalizare).

4. Generează Prisma Client și Rulează Migrațiile:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Pornește Serverul de Dezvoltare:

   ```bash
   npm run dev
   ```
