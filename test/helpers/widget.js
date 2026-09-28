"use strict";

// script.js est un script de page, pas un module : il s'execute au chargement et
// parle au DOM et a l'API Grist. Pour tester sa logique pure, on l'evalue dans un
// bac a sable muni de doublures minimales, puis on recupere ses fonctions.
//
// Les declarations `function` deviennent des proprietes du global du bac a sable,
// mais pas les `const` : on ajoute donc une ligne d'export a la fin du code.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SCRIPT = path.join(__dirname, "..", "..", "src", "page-accueil", "script.js");
const EXPORTED = ["state", "TARGETS"];

function makeElement() {
  const attributes = {};
  return {
    textContent: "", hidden: false, value: "", innerHTML: "",
    attributes,
    setAttribute(name, value) { attributes[name] = String(value); },
    getAttribute(name) { return name in attributes ? attributes[name] : null; },
    removeAttribute(name) { delete attributes[name]; },
    addEventListener() {}, appendChild() {}, focus() {},
  };
}

// Sans grist fourni, le widget part d'un document sans page et sans jeton : il
// demarre, mais les tests fournissent ensuite leurs propres jeux d'essai.
function loadWidget(grist = {}) {
  const code = fs.readFileSync(SCRIPT, "utf8")
    + `\n;globalThis.__widget = {${EXPORTED.join(", ")}};\n`;
  const elements = new Map();
  const sandbox = {
    console: {log() {}, warn() {}, error() {}, info() {}},
    document: {
      // Un meme identifiant renvoie toujours le meme element, sans quoi un test
      // ne pourrait pas relire ce qu'un rendu vient d'ecrire.
      getElementById: (id) => elements.get(id) || elements.set(id, makeElement()).get(id),
      createElement: () => makeElement(),
    },
    grist: {
      ready() {},
      onOptions() {},
      onEditOptions() {},
      setOptions: () => Promise.resolve(),
      ...grist,
      docApi: {
        fetchTable: () => Promise.resolve({id: []}),
        getAccessToken: () => Promise.reject(new Error("pas de jeton en test")),
        ...grist.docApi,
      },
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, {filename: "script.js"});
  return Object.assign(Object.create(null), sandbox, sandbox.__widget);
}

module.exports = {loadWidget};
