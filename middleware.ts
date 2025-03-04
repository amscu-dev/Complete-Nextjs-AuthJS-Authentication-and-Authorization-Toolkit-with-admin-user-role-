import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Middleware-ul va intercepta toate rutele.
// Handler-ul provenit de la AuthJs va folosi o functie middlware customizata, pentru a gestionata permisiunea rutelor.
// In aceasta situatia considera intreaga aplicatie ca fiind protejata(deoarece in mod normal intr-o aplicatie exista mai multe rute protejate)
// auth() nu execută efectiv autentificarea, ci doar gestionează permisiunile și direcționează cererea către server action-ul de autentificare (acesta din urmă efectuează logica de validare a datelor).
export default auth((req) => {
  console.log("------- SE EXECUTA MIDDLEWARE -------");
  // Dupa gestionarea auth()-fie cel gestionat de authorization(Credentials) fie cel implicit din OAuth, req va avea auth si se va apela (3)
  console.log(req.auth);
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  //  Dupa ce se efectueaza autentificarea ion login + authorization din Credetial provider, aici se redirectioneaza
  // Rutele ce includ logica autentificarii sunt gestionate special
  // (3)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // nextUrl este obligatoriu, plasarea lui in constructor ajuta la constructia unui URL absolut
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    console.log("las cererea sa treaca sper server action");
    // De aici request ul de autentificare este lasat sa mearga la server action login(1)
    return NextResponse.next();
  }
  // Acesta clauza imi protejeaza toate rutele ce nu sunt specificate ca fiind public route
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // în contextul middleware-ului din NextAuth, return null permite request-ului să continue mai departe, adică nu intervine și nu modifică fluxul cererii. Nu se modifica headers/cookie-uri
  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
