"use strict";

// Les cartes n'ont d'adresse que celle construite a l'execution, a partir des
// options du widget, des pages du document et de l'adresse de son API. Une
// configuration absente ou perimee est le cas courant : chaque livraison repart
// d'une copie fraiche du document.

const test = require("node:test");
const assert = require("node:assert/strict");
const {loadWidget} = require("./helpers/widget");

const widget = loadWidget();
const DOC = "https://grist.example.org/o/equipe/doc/DocTest";
const PAGES = [
  {id: 35, name: "Dashboard"},
  {id: 38, name: "Page publique"},
  {id: 40, name: "Tableau de bord 2027"},
];

// Les objets du bac a sable viennent d'un autre royaume : deepEqual les
// jugerait differents des litteraux du test sans cette copie.
const plain = (value) => JSON.parse(JSON.stringify(value));
const links = (options, pages = PAGES, docUrl = DOC) =>
  Object.fromEntries(plain(widget.buildLinks(options, pages, docUrl)).map((link) => [link.key, link]));

// Reprise de la lecture du chemin par Grist (decodeUrl, app/common/gristUrls.ts
// de grist-core) : des paires cle/valeur, apres le prefixe d'organisation.
function lireCommeGrist(url) {
  const parts = new URL(url).pathname.slice(1).split("/");
  const paires = new Map();
  for (let i = 0; i < parts.length; i += 2) paires.set(parts[i], parts[i + 1]);
  return {org: paires.get("o"), doc: paires.get("doc"), page: paires.get("p")};
}

test("l'adresse du document se deduit de celle de son API", () => {
  assert.equal(widget.docUrlFromBaseUrl("https://docs.getgrist.com/api/docs/Abc123"),
    "https://docs.getgrist.com/doc/Abc123");
  assert.equal(widget.docUrlFromBaseUrl("https://grist.example.org/o/equipe/api/docs/Abc123/"),
    "https://grist.example.org/o/equipe/doc/Abc123", "le prefixe d'organisation est garde");
  assert.equal(widget.docUrlFromBaseUrl("https://h.org/api/docs/Abc~fork~u5"),
    "https://h.org/doc/Abc~fork~u5", "une copie de travail reste adressable");
  for (const invalide of [undefined, null, "", "https://h.org/Abc123", "/api/docs/Abc"]) {
    assert.equal(widget.docUrlFromBaseUrl(invalide), null, `${invalide} n'est pas une adresse d'API`);
  }
});

test("les pages se lisent dans l'ordre du document, adressees par leur vue", () => {
  const pages = widget.listPages(
    {id: [1, 2, 3], viewRef: [38, 35, 99], pagePos: [10.5, 7, 1]},
    {id: [35, 38], name: ["Dashboard", "Page publique"]});
  assert.deepEqual(plain(pages), [{id: 35, name: "Dashboard"}, {id: 38, name: "Page publique"}],
    "une page sans vue connue est ecartee");
  assert.deepEqual(plain(widget.listPages({}, {})), []);
});

test("Grist retrouve le document et la page dans chaque lien", () => {
  // Sans le mot « doc », Grist lisait « /<id>/p/38 » comme un document nomme « p »
  // et ouvrait sa page par defaut : les deux cartes menaient au tableau de bord.
  for (const baseUrl of ["https://docs.getgrist.com/api/docs/Abc123",
                         "https://grist.example.org/o/equipe/api/docs/Abc123"]) {
    const {dashboard, soutien} = links(null, PAGES, widget.docUrlFromBaseUrl(baseUrl));
    assert.deepEqual(lireCommeGrist(dashboard.url).doc, "Abc123");
    assert.equal(lireCommeGrist(dashboard.url).page, "35");
    assert.equal(lireCommeGrist(soutien.url).page, "38");
  }
  assert.equal(lireCommeGrist(links(null, PAGES, widget.docUrlFromBaseUrl(
    "https://grist.example.org/o/equipe/api/docs/Abc123")).soutien.url).org, "equipe");
});

test("sans configuration, les cartes visent les pages de meme nom", () => {
  for (const options of [null, undefined, {}]) {
    const {dashboard, soutien} = links(options);
    assert.equal(dashboard.url, `${DOC}/p/35`);
    assert.equal(soutien.url, `${DOC}/p/38`);
  }
});

test("le numero de page choisi l'emporte, meme apres un renommage", () => {
  const renommees = [{id: 35, name: "Pilotage"}, {id: 38, name: "Page publique"}];
  const {dashboard} = links({dashboard: {pageId: 35, pageName: "Dashboard"}}, renommees);
  assert.equal(dashboard.url, `${DOC}/p/35`);
  assert.equal(dashboard.pageName, "Pilotage");
});

test("une configuration incomplete retombe sur ce qu'elle precise", () => {
  // Numero perime : on se rabat sur le nom enregistre avec lui.
  assert.equal(links({dashboard: {pageId: 12, pageName: "Tableau de bord 2027"}}).dashboard.url, `${DOC}/p/40`);
  // Nom seul, eventuellement entoure d'espaces.
  assert.equal(links({dashboard: {pageName: " Tableau de bord 2027 "}}).dashboard.url, `${DOC}/p/40`);
  // Numero en texte, tel qu'un select le rendrait.
  assert.equal(links({dashboard: {pageId: "40"}}).dashboard.url, `${DOC}/p/40`);
  // Une carte configuree ne change rien a l'autre.
  assert.equal(links({dashboard: {pageId: 40}}).soutien.url, `${DOC}/p/38`);
  // Valeur inattendue : on la traite comme une absence de choix.
  assert.equal(links({dashboard: "Dashboard", soutien: 38}).dashboard.url, `${DOC}/p/35`);
});

test("une cible introuvable laisse la carte sans adresse et dit laquelle manque", () => {
  const {dashboard, soutien} = links({dashboard: {pageId: 12, pageName: "Ancien tableau"}});
  assert.deepEqual([dashboard.url, dashboard.problem, dashboard.pageName], [null, "page", "Ancien tableau"]);
  assert.equal(soutien.url, `${DOC}/p/38`);

  const vide = links(null, []);
  assert.deepEqual([vide.dashboard.problem, vide.dashboard.pageName], ["page", "Dashboard"]);
});

test("sans adresse de document, aucune carte ne recoit de lien", () => {
  const {dashboard, soutien} = links(null, PAGES, null);
  assert.deepEqual([dashboard.url, dashboard.problem], [null, "document"]);
  assert.deepEqual([soutien.url, soutien.problem], [null, "document"]);
});

test("les cartes recoivent leur lien une fois le document lu", async () => {
  const w = loadWidget({docApi: {
    fetchTable: async (table) => table === "_grist_Pages"
      ? {id: [1, 2], viewRef: [35, 38], pagePos: [1, 2]}
      : {id: [35, 38], name: ["Dashboard", "Page publique"]},
    getAccessToken: async () => ({baseUrl: "https://h.org/api/docs/Abc123", token: "t"}),
  }});
  const carte = w.document.getElementById("card-dashboard");
  assert.equal(carte.getAttribute("href"), null, "pas de lien avant la lecture");
  await w.load();
  assert.equal(carte.getAttribute("href"), "https://h.org/doc/Abc123/p/35");
  assert.equal(carte.classList.contains("ds-card-link-disabled"), false);
  assert.equal(w.document.getElementById("status-dashboard").textContent, "");
});

test("un acces refuse aux pages est signale sur les cartes", async () => {
  const w = loadWidget({docApi: {fetchTable: async () => { throw new Error("acces refuse"); }}});
  await w.load();
  assert.equal(w.document.getElementById("card-soutien").getAttribute("href"), null);
  assert.ok(w.document.getElementById("card-soutien").classList.contains("ds-card-link-disabled"),
    "une carte sans cible prend l'aspect desactive du design system");
  assert.match(w.document.getElementById("status-soutien").textContent, /accès complet/);
});
