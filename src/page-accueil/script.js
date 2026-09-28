"use strict";

// Le widget vit dans une iframe d'une autre origine que Grist, et l'API plugin
// n'offre aucune methode pour changer de page. Chaque carte est donc un vrai lien
// en target="_top", dont l'adresse est construite ici a l'execution : l'hote et
// l'identifiant du document ne sont connus que du document lui-meme, et le depot
// etant public, aucun des deux ne doit y figurer.

// Le nom par defaut est celui de la page dans le document livre. Il ne sert que
// tant que personne n'a choisi de cible, ce qui evite de reconfigurer le widget a
// chaque copie fraiche du document.
const TARGETS = [
  {key: "dashboard", defaultName: "Dashboard"},
  {key: "soutien", defaultName: "Page publique"},
];

const state = {
  loaded: false,
  accessDenied: false,
  pages: [],
  docUrl: null,
  options: null,
};

// Le jeton d'acces renvoie l'adresse de l'API du document, seule source fiable de
// son adresse : window.top.location est illisible depuis une autre origine, et
// document.referrer peut etre reduit a l'origine seule. Le prefixe eventuel
// d'organisation (« /o/<equipe> ») est conserve tel quel.
function docUrlFromBaseUrl(baseUrl) {
  const match = /^(https?:\/\/[^?#]*?)\/api\/docs\/([^/?#]+)\/?$/.exec(String(baseUrl || ""));
  return match ? `${match[1]}/${match[2]}` : null;
}

// Grist renvoie ses tables par colonnes. L'adresse d'une page (« /p/<n> ») porte
// le numero de sa vue, et non celui de la ligne de _grist_Pages.
function listPages(pagesTable, viewsTable) {
  const names = new Map();
  (viewsTable.id || []).forEach((id, i) => names.set(id, viewsTable.name[i]));
  return (pagesTable.id || [])
    .map((_, i) => ({id: pagesTable.viewRef[i], name: names.get(pagesTable.viewRef[i]), pos: pagesTable.pagePos[i]}))
    .filter((page) => typeof page.name === "string")
    .sort((a, b) => a.pos - b.pos)
    .map(({id, name}) => ({id, name}));
}

// Le numero de vue survit aux renommages comme aux copies du document ; le nom
// ne sert que de repli, quand la page choisie a ete supprimee puis recreee.
function resolveTarget(option, pages, defaultName) {
  const choice = option && typeof option === "object" ? option : {};
  const byId = pages.find((page) => page.id === Number(choice.pageId));
  if (byId) return {page: byId, wanted: byId.name};
  const wanted = typeof choice.pageName === "string" && choice.pageName.trim()
    ? choice.pageName.trim() : defaultName;
  const byName = pages.find((page) => page.name.trim() === wanted);
  return {page: byName || null, wanted};
}

function buildLinks(options, pages, docUrl) {
  return TARGETS.map(({key, defaultName}) => {
    const {page, wanted} = resolveTarget(options && options[key], pages, defaultName);
    let problem = null;
    if (!page) problem = "page";
    else if (!docUrl) problem = "document";
    return {key, pageName: wanted, url: problem ? null : `${docUrl}/p/${page.id}`, problem};
  });
}

function statusMessage(link) {
  if (state.accessDenied) return "Accordez l'accès complet au widget pour qu'il trouve les pages du document.";
  if (link.problem === "page") return `Page « ${link.pageName} » introuvable dans ce document.`;
  if (link.problem === "document") return "Adresse du document indisponible.";
  return "";
}

function render() {
  // Avant la premiere lecture du document, une carte sans cible n'est pas encore
  // une erreur : on n'affiche rien plutot qu'un « introuvable » fugace.
  const links = state.loaded ? buildLinks(state.options, state.pages, state.docUrl) : [];
  for (const {key} of TARGETS) {
    const link = links.find((item) => item.key === key);
    const card = document.getElementById(`card-${key}`);
    if (link && link.url) card.setAttribute("href", link.url);
    else card.removeAttribute("href");
    document.getElementById(`status-${key}`).textContent = link ? statusMessage(link) : "";
  }
}

// Le panneau ne s'ouvre que par le bouton « Ouvrir la configuration » de Grist,
// reserve a qui peut modifier le document : les lecteurs n'en voient rien.
function openConfig() {
  for (const {key, defaultName} of TARGETS) {
    const select = document.getElementById(`config-${key}`);
    select.innerHTML = "";
    // La valeur vide ne fige aucune page : la carte continue de viser la page
    // de son nom par defaut, ce qui suit le document d'une copie a l'autre.
    select.appendChild(makeOption("", `Par défaut : page « ${defaultName} »`));
    for (const page of state.pages) select.appendChild(makeOption(String(page.id), page.name));

    const option = state.options && state.options[key];
    const {page} = resolveTarget(option, state.pages, defaultName);
    select.value = option && page ? String(page.id) : "";
  }
  document.getElementById("cards").hidden = true;
  document.getElementById("config").hidden = false;
  document.getElementById("config-dashboard").focus();
}

function closeConfig() {
  document.getElementById("config").hidden = true;
  document.getElementById("cards").hidden = false;
}

// textContent et non innerHTML : un nom de page vient du document et peut
// contenir n'importe quoi.
function makeOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

async function saveConfig(event) {
  event.preventDefault();
  const options = {};
  for (const {key} of TARGETS) {
    const id = document.getElementById(`config-${key}`).value;
    const page = state.pages.find((item) => String(item.id) === id);
    // Le nom est garde avec le numero pour le cas ou la page serait supprimee
    // puis recreee : le numero change alors, pas le nom.
    if (page) options[key] = {pageId: page.id, pageName: page.name};
  }
  await grist.setOptions(options);
  closeConfig();
}

async function load() {
  // Lire la liste des pages suppose l'acces complet : avec un acces limite a une
  // table, les tables de metadonnees sont refusees.
  try {
    const [pagesTable, viewsTable] = await Promise.all([
      grist.docApi.fetchTable("_grist_Pages"),
      grist.docApi.fetchTable("_grist_Views"),
    ]);
    state.pages = listPages(pagesTable, viewsTable);
  } catch (error) {
    console.warn("Pages du document illisibles :", error);
    state.accessDenied = true;
  }
  try {
    const {baseUrl} = await grist.docApi.getAccessToken({readOnly: true});
    state.docUrl = docUrlFromBaseUrl(baseUrl);
  } catch (error) {
    console.warn("Adresse du document indisponible :", error);
  }
  state.loaded = true;
  render();
}

document.getElementById("config-form").addEventListener("submit", saveConfig);
document.getElementById("config-cancel").addEventListener("click", closeConfig);

grist.ready({requiredAccess: "full", onEditOptions: openConfig});
grist.onOptions((options) => {
  state.options = options;
  render();
});
load();
