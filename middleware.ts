import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

// NOTE IMPORTANTE:
// 1. Middleware-ul va intercepta toate rutele.
// 2. Handler-ul provenit de la AuthJs va folosi o functie middlware customizata, pentru a gestionata permisiunea rutelor.
// 3. In aceasta situatie se considera intreaga aplicatie ca fiind protejata(deoarece in mod normal intr-o aplicatie exista mai multe rute protejate).

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req; // URL-ul curent al cererii
  const isLoggedIn = !!req.auth; // Verificăm dacă utilizatorul este autentificat

  // Verificăm dacă cererea se face către o rută API de autentificare
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // Verificăm dacă cererea este către o rută publică
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  // Verificăm dacă cererea este către o rută ce necesită autentificare
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Dacă este o rută de autentificare API, continuăm cererea
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Dacă cererea este către o rută care necesită autentificare
  if (isAuthRoute) {
    // Dacă utilizatorul este deja autentificat, redirecționăm către ruta de redirect după login
    if (isLoggedIn) {
      // nextUrl este obligatoriu, plasarea lui in constructor ajuta la constructia unui URL absolut
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    console.log("Las cererea să treacă pentru server action");

    // Permitem continuarea cererii pentru rutele care necesită autentificare
    return NextResponse.next();
  }

  // Dacă utilizatorul nu este autentificat și cererea nu este către o rută publică
  if (!isLoggedIn && !isPublicRoute) {
    // Construim URL-ul de redirecționare pentru login, păstrând URL-ul original ca callback
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallback = encodeURIComponent(callbackUrl);
    // Redirecționăm utilizatorul către pagina de login cu URL-ul original ca callback
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallback}`, nextUrl)
    );
  }

  // Dacă cererea trece toate condițiile, lăsăm cererea să continue fără modificări
  return NextResponse.next();
});

// Configurăm middleware-ul pentru a se aplica la toate rutele, exceptând fișierele statice și rutele interne Next.js
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
