"use strict";

// Le design system France Travail est charge avant notre feuille : toute classe
// que nous redefinissons sous un de ses noms herite de ses regles en silence, et
// notre CSS ne l'emporte que sur les proprietes qu'il redeclare.
//
// La liste ci-dessous est l'inventaire des classes de sa feuille, et non celui
// de ses pages de composants, qui ne portent pas toujours les memes noms. Pour
// la regenerer :
//   curl -s https://cdn.francetravail.fr/studio/design-system/css/styles.css \
//     | grep -oE '\.[a-zA-Z_][a-zA-Z0-9_-]*' | sort -u

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const CSS = fs.readFileSync(
  path.join(__dirname, "..", "src", "page-accueil", "style.css"), "utf8");
const RESERVES = new Set(
  fs.readFileSync(path.join(__dirname, "design-system-classes.txt"), "utf8")
    .split("\n").map((ligne) => ligne.trim()).filter(Boolean));

// Classe posee en tete de selecteur, donc redefinie pour tout le document.
// « .home-banner .btn » ne compterait pas : ce serait notre contexte qui habille
// un composant du design system, ce qui est legitime. « a.home-card » compte :
// l'element ne change rien au fait que la classe est la notre.
function classesRedefinies(css) {
  const trouvees = new Set();
  const sansCommentaires = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const bloc of sansCommentaires.split("}")) {
    const selecteurs = bloc.split("{").slice(-2, -1)[0];
    if (!selecteurs || selecteurs.includes("@")) continue;
    for (const selecteur of selecteurs.split(",")) {
      const premier = selecteur.trim().match(/^[a-z]*\.([\w-]+)/);
      if (premier) trouvees.add(premier[1]);
    }
  }
  return trouvees;
}

test("l'inventaire du design system est bien charge", () => {
  // Un fichier vide ou tronque ferait passer le test suivant sans rien verifier.
  for (const nom of ["btn", "form-control", "title", "header", "container"]) {
    assert.ok(RESERVES.has(nom), `${nom} devrait figurer dans l'inventaire`);
  }
});

test("la feuille declare bien des classes en tete de selecteur", () => {
  const redefinies = classesRedefinies(CSS);
  for (const nom of ["home-banner", "home-card", "home-title"]) {
    assert.ok(redefinies.has(nom), `.${nom} doit etre releve par l'analyse`);
  }
});

test("aucune classe du widget ne reprend un nom du design system", () => {
  const conflits = [...classesRedefinies(CSS)].filter((nom) => RESERVES.has(nom));
  assert.deepEqual(conflits, [],
    `a renommer : ${conflits.join(", ")} — le design system definit deja ces classes`);
});
