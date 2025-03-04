/**
 * Un array cu rutele accesibile public;
 * Aceste rute nu necesita autentificare;
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * Un array cu rutele  protejate;
 * Aceste rute  necesita autentificare;
 * Aceste rute vor redirectiona loggedin users to /settings;
 * Acest rute sunt protejate deoarece daca un user este autentificat acesta va fii redirectionat catre settings, daca nu este acesta va fii redirectionat catre /login & /register;
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * Prefixul pentru API authentication routes;
 * Rutele ce incep cu acest prefix sunt folosite cu scopul autentificarii;
 * Aceste rute nu sunt protejate
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * Rutarea implicita dupa ce un user este logat;
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
