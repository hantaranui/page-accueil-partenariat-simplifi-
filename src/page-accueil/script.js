"use strict";

// Le widget vit dans une iframe d'une autre origine que Grist, et l'API plugin
// n'offre aucune methode pour changer de page. Chaque carte est donc un vrai lien
// en target="_top", dont l'adresse est construite ici a l'execution : l'hote et
// l'identifiant du document ne sont connus que du document lui-meme, et le depot
// etant public, aucun des deux ne doit y figurer.

// Le nom par defaut est celui de la page dans le document livre. Il ne sert que
// tant que personne n'a choisi de cible, et seulement pour qui voit les noms des
// pages : un proprietaire, pas un editeur a acces partiel (voir resolveTarget).
// Sur une copie fraiche, un proprietaire doit donc enregistrer la configuration
// une fois pour que les editeurs aient leurs liens.
const TARGETS = [
  {key: "dashboard", defaultName: "Dashboard"},
  {key: "soutien", defaultName: "Page publique"},
];

const state = {
  loaded: false,
  pagesKnown: true,
  pages: [],
  docUrl: null,
  options: null,
};

// Le jeton d'acces renvoie l'adresse de l'API du document, seule source fiable de
// son adresse : window.top.location est illisible depuis une autre origine, et
// document.referrer peut etre reduit a l'origine seule. Le prefixe eventuel
// d'organisation (« /o/<equipe> ») est conserve tel quel.
//
// Grist lit le chemin par paires cle/valeur. Sans le mot « doc », il prend
// l'identifiant pour la cle et ce qui suit pour le nom du document : dans
// « /<id>/p/38 », « p » devenait ce nom, le numero de page etait perdu et Grist
// ouvrait sa page par defaut.
function docUrlFromBaseUrl(baseUrl) {
  const match = /^(https?:\/\/[^?#]*?)\/api\/docs\/([^/?#]+)\/?$/.exec(String(baseUrl || ""));
  return match ? `${match[1]}/doc/${match[2]}` : null;
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
//
// Le numero est aussi la seule donnee sure chez qui n'a qu'un acces partiel :
// Grist efface le nom de toute page portant un widget sur une table que
// l'utilisateur ne peut pas lire, mais garde son numero. Un editeur sans droit
// sur la table des actions voit donc la page du tableau de bord sans nom. Et si
// la liste des pages est illisible, on se fie au numero enregistre plutot que de
// desactiver la carte.
function resolveTarget(option, pages, defaultName, pagesKnown = true) {
  const choice = option && typeof option === "object" ? option : {};
  const savedName = typeof choice.pageName === "string" ? choice.pageName.trim() : "";
  const id = Number(choice.pageId);
  if (Number.isInteger(id) && id > 0) {
    const byId = pages.find((page) => page.id === id);
    if (byId) {
      const name = byId.name || savedName;
      return {page: {id, name}, wanted: name || defaultName};
    }
    if (!pagesKnown) return {page: {id, name: savedName}, wanted: savedName || defaultName};
  }
  const wanted = savedName || defaultName;
  const byName = pages.find((page) => page.name && page.name.trim() === wanted);
  return {page: byName || null, wanted};
}

function buildLinks(options, pages, docUrl, pagesKnown = true) {
  return TARGETS.map(({key, defaultName}) => {
    const {page, wanted} = resolveTarget(options && options[key], pages, defaultName, pagesKnown);
    let problem = null;
    if (!page) problem = "page";
    else if (!docUrl) problem = "document";
    return {key, pageName: wanted, url: problem ? null : `${docUrl}/p/${page.id}`, problem};
  });
}

function statusMessage(link) {
  if (link.problem === "page" && !state.pagesKnown) {
    return "Accordez l'accès complet au widget pour qu'il trouve les pages du document.";
  }
  // Des noms effaces signalent un lecteur a acces partiel : il ne peut ni
  // retrouver la page par son nom, ni enregistrer la cible lui-meme.
  if (link.problem === "page" && state.pages.some((page) => !page.name)) {
    return "Cible non enregistrée : un propriétaire du document doit la choisir dans la configuration du widget.";
  }
  if (link.problem === "page") return `Page « ${link.pageName} » introuvable dans ce document.`;
  if (link.problem === "document") return "Adresse du document indisponible.";
  return "";
}

function render() {
  // Avant la premiere lecture du document, une carte sans cible n'est pas encore
  // une erreur : on n'affiche rien plutot qu'un « introuvable » fugace.
  const links = state.loaded ? buildLinks(state.options, state.pages, state.docUrl, state.pagesKnown) : [];
  for (const {key} of TARGETS) {
    const link = links.find((item) => item.key === key);
    const card = document.getElementById(`card-${key}`);
    if (link && link.url) card.setAttribute("href", link.url);
    else card.removeAttribute("href");
    // Seule une cible introuvable desactive la carte : pendant le chargement,
    // elle garde son aspect normal pour ne pas clignoter.
    card.classList.toggle("ds-card-link-disabled", Boolean(link && !link.url));
    document.getElementById(`status-${key}`).textContent = link ? statusMessage(link) : "";
  }
}

// Le panneau ne s'ouvre que par le bouton « Ouvrir la configuration » de Grist,
// reserve a qui peut modifier le document : les lecteurs n'en voient rien.
function openConfig() {
  for (const {key, defaultName} of TARGETS) {
    const select = document.getElementById(`config-${key}`);
    select.innerHTML = "";
    // Chaque liste presente la page que la carte vise deja, trouvee par son
    // numero ou par son nom par defaut : enregistrer fige alors son numero, seul
    // repere que voient les editeurs a acces partiel. Une liste sans page
    // retrouvee demande un choix explicite plutot que d'enregistrer du vide.
    const {page} = resolveTarget(state.options && state.options[key], state.pages, defaultName);
    if (!page) {
      const invite = makeOption("", "Choisir une page");
      invite.disabled = true;
      select.appendChild(invite);
    }
    for (const item of state.pages) {
      select.appendChild(makeOption(String(item.id), item.name || `Page n° ${item.id}`));
    }
    select.value = page ? String(page.id) : "";
  }
  // Le texte d'accueil part avec les cartes : sa question n'a pas de sens
  // au-dessus du formulaire.
  document.getElementById("intro").hidden = true;
  document.getElementById("cards").hidden = true;
  document.getElementById("config").hidden = false;
  document.getElementById("config-dashboard").focus();
}

function closeConfig() {
  document.getElementById("config").hidden = true;
  document.getElementById("intro").hidden = false;
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
    state.pagesKnown = false;
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
