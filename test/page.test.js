"use strict";

// La page d'accueil est statique : un texte, une photo, plus aucune carte.
// Ces tests lisent index.html et script.js, sans rien afficher : le rendu
// (couleurs, mise en page, mode sombre) reste a verifier dans un navigateur.
// Cas proposes par docs/ux/nouvelle-page-accueil.md, section 7.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {loadWidget} = require("./helpers/widget");

const DIR = path.join(__dirname, "..", "src", "page-accueil");
const HTML = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
const IMG = HTML.match(/<img\b[^>]*class="home-photo"[^>]*>/);

test("la page a exactement un h1, de classe sr-only", () => {
  const titres = HTML.match(/<h1\b[^>]*>/g) || [];
  assert.equal(titres.length, 1);
  assert.match(titres[0], /class="sr-only"/);
});

test("la page ne contient plus de carte ni de panneau de configuration", () => {
  assert.doesNotMatch(HTML, /ds-card-link/);
  assert.doesNotMatch(HTML, /home-config/);
});

test("la photo a un alt vide, une largeur et une hauteur", () => {
  assert.ok(IMG, "une balise <img class=\"home-photo\"> doit exister");
  assert.match(IMG[0], /\balt=""/);
  assert.match(IMG[0], /\bwidth="\d+"/);
  assert.match(IMG[0], /\bheight="\d+"/);
});

test("le fichier de la photo existe a cote des sources", () => {
  assert.ok(IMG, "une balise <img class=\"home-photo\"> doit exister");
  const src = IMG[0].match(/\bsrc="([^"]+)"/);
  assert.ok(src, "la photo doit avoir un src");
  assert.ok(fs.existsSync(path.join(DIR, src[1])), `${src[1]} introuvable dans src/page-accueil/`);
});

test("la photo pese moins de 200 000 octets", () => {
  // Garde-fou : l'original de 3,7 Mo ne doit jamais etre commite.
  const src = IMG && IMG[0].match(/\bsrc="([^"]+)"/);
  assert.ok(src, "la photo doit avoir un src");
  const octets = fs.statSync(path.join(DIR, src[1])).size;
  assert.ok(octets < 200000, `${src[1]} pese ${octets} octets`);
});

test("la phrase d'accueil est un paragraphe .t1", () => {
  const phrase = "Bienvenue sur l'outil Partenariat simplifié qui vous aidera à gérer et piloter les actions d'insertion par le sport.";
  const paragraphes = [...HTML.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)]
    .filter((p) => /\bclass="[^"]*\bt1\b[^"]*"/.test(p[1]) && p[2].trim() === phrase);
  assert.equal(paragraphes.length, 1);
});

test("la balise du bandeau commun est presente", () => {
  const url = "https://hantaranui.github.io/Bandeau_France-Travail/bandeau.js";
  const balises = HTML.match(/<script\b[^>]*>/g) || [];
  const bandeau = balises.filter((b) => b.includes(`src="${url}"`));
  assert.equal(bandeau.length, 1, "une seule balise <script> doit charger bandeau.js");
  assert.match(bandeau[0], /\bdata-titre="Partenariat simplifié"/);
  const posApi = HTML.indexOf("grist-plugin-api.js");
  assert.ok(posApi !== -1, "la balise de grist-plugin-api.js doit exister");
  assert.ok(HTML.indexOf(bandeau[0]) > posApi, "le bandeau doit venir apres grist-plugin-api.js");
});

test("script.js demande l'acces complet a Grist", () => {
  const appels = [];
  loadWidget({ready: (options) => appels.push(options)});
  assert.equal(appels.length, 1);
  assert.equal(appels[0].requiredAccess, "full");
});
