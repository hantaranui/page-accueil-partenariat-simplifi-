# Carnet de tests : page d'accueil (widget Grist, Partenariat simplifié)

**Statut : BROUILLON du recetteur, à valider par le chef de projet, puis à compléter par le développeur de la fonction.** Ce n'est pas un carnet définitif. Aucun test de ce fichier n'a été joué.

- Date du brouillon : 16/10/2026
- Environnement de tous les tests : **DEV** uniquement, données fictives uniquement. Aucun test en PROD.
- Version testée : [À COMPLÉTER à chaque campagne]
- Sources lues : README.md, src/page-accueil/index.html, script.js, style.css, protocole et guide du testeur.
- Il n'existe pas de document de « fonctions détaillées » : les fonctions ci-dessous sont déduites du README et du code. **À valider.**

## 1. Fonctions identifiées (à valider)

| N° | Fonction | Où je l'ai trouvée |
| -- | -------- | ------------------ |
| F1 | Calcul de l'adresse du document (lien construit à l'exécution, sans adresse dans le code) | script.js l. 27-39 (`docUrlFromBaseUrl`), l. 199-204 (lecture du jeton d'accès) ; README « Navigation et configuration » |
| F2 | Lecture de la liste des pages du document (`_grist_Pages`, `_grist_Views`) | script.js l. 41-51 (`listPages`), l. 189-198 |
| F3 | Choix de la page visée par chaque carte : numéro enregistré, sinon nom enregistré, sinon nom par défaut « Dashboard » / « Page publique » | script.js l. 9-17 (`TARGETS`), l. 53-87 (`resolveTarget`, `buildLinks`) |
| F4 | Affichage des cartes : lien actif, carte grisée si page introuvable, messages d'état | script.js l. 89-120 (`statusMessage`, `render`) ; index.html l. 21-42 |
| F5 | Panneau de configuration : ouverture (bouton Grist « Ouvrir la configuration »), listes préremplies, aide, annulation | script.js l. 122-170, 209-212 ; index.html l. 44-61 |
| F6 | Enregistrement de la configuration (numéro et nom de chaque page, via les options du widget) | script.js l. 172-184, 213-216 ; README (deux clics « Enregistrer ») |
| F7 | Mise en page et accessibilité : texte d'accueil, grille de cartes (4, 2 ou 1 par ligne), mode sombre, clavier, lecteur d'écran | index.html l. 19-42 ; style.css l. 46-137 |
| F8 | Bandeau en haut de page (décision en attente : bandeau propre ou bandeau commun) | index.html l. 13-17 ; style.css l. 12-44 ; CLAUDE.md « Chantier en cours » |

Profils de test utilisés ci-dessous (comptes de la table Utilisateurs) : **Propriétaire** du document, et utilisateurs à accès partiel **FT National, FT Régional, FT Départemental, ANS**.

Abréviations de colonne « Module » : CARTES (F1, F3, F4), PAGES (F2), CONFIG (F5, F6), AFFICHAGE (F7), BANDEAU (F8).

## 2. Carnet

### F1 : Adresse du document

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-001 | CARTES | CONFIG | Cas normal | bloquant | un propriétaire sur la page d'accueil du document DEV, configuration enregistrée | il survole la carte « Accéder à la liste des actions » et lit l'adresse affichée par le navigateur | l'adresse a la forme `<adresse du document DEV>/doc/<identifiant>/p/<n>`, avec le mot `doc` avant l'identifiant | Document DEV, compte propriétaire de test |
| ACC-002 | CARTES | CONFIG | Limites | majeur | le document DEV est ouvert dans un site d'équipe dont l'adresse contient `/o/<équipe>` [À CONFIRMER] | le testeur lit l'adresse d'une carte | le préfixe `/o/<équipe>` est conservé avant `/doc/` | Document DEV d'équipe fictive |
| ACC-003 | CARTES | CONFIG | Conservation | majeur | une copie du document DEV (nommée « Copie test accueil ») avec le widget | le propriétaire clique sur une carte de la copie | Grist ouvre la page de la **copie**, pas celle du document d'origine | Copie fictive du document DEV [À CONFIRMER : copie autorisée] |

### F2 : Liste des pages du document

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-004 | PAGES | CONFIG | Cas normal | majeur | un propriétaire, le document contient les pages « Dashboard », « Page publique » et « Page test A » | il ouvre la configuration du widget | chacune des deux listes contient les trois pages, dans l'ordre du panneau de pages de Grist | Page « Page test A » créée pour le test |
| ACC-005 | PAGES | CONFIG | Erreurs de saisie | mineur | une page nommée `Test <b>gras</b> & co` | le propriétaire ouvre la configuration | le nom apparaît à l'identique dans les listes, sans mise en gras ni caractère transformé | Page « Test <b>gras</b> & co » |
| ACC-006 | PAGES | CONFIG | Limites | mineur | un document de test avec une cinquantaine de pages | le propriétaire ouvre la configuration | toutes les pages sont listées, l'ouverture reste fluide, rien n'est tronqué | 50 pages fictives « Page test 01 » à « Page test 50 » |

### F3 : Page visée par chaque carte

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-007 | CARTES | CONFIG, PAGES | Cas normal | bloquant | un propriétaire, configuration enregistrée avec « Dashboard » pour la 1re carte | il clique sur « Accéder à la liste des actions » | la page « Dashboard » s'ouvre dans la fenêtre entière de Grist (pas dans le cadre du widget) | Page « Dashboard » |
| ACC-008 | CARTES | CONFIG, PAGES | Cas normal | bloquant | un propriétaire, configuration enregistrée avec « Page publique » pour la 2e carte | il clique sur « Accéder à la page publique de soutien » | la page « Page publique » s'ouvre dans la fenêtre entière de Grist | Page « Page publique » |
| ACC-009 | CARTES | CONFIG | Cas normal | majeur | une copie fraîche du widget, rien d'enregistré, un propriétaire connecté | il regarde puis clique sur chaque carte | les cartes visent les pages nommées « Dashboard » et « Page publique » | Document fictif sans configuration |
| ACC-010 | CARTES | CONFIG, PAGES | Limites | majeur | la configuration est enregistrée sur « Dashboard » | le propriétaire renomme cette page en « Tableau de bord test » dans Grist, puis recharge l'accueil et clique sur la carte | la carte mène toujours à la même page (suivie par son numéro) | Renommage fictif de « Dashboard » |
| ACC-011 | CARTES | CONFIG, PAGES | Limites | majeur | la configuration est enregistrée sur « Page publique » | le propriétaire supprime la page, en recrée une du même nom « Page publique », puis recharge et clique sur la carte | la carte mène à la page recréée (repli par le nom) | Page « Page publique » recréée |
| ACC-012 | CARTES | CONFIG | Conservation | majeur | un propriétaire sur l'accueil, compter les lignes des tables Actions et Soutiens avant le test | il clique sur chaque carte et revient à l'accueil trois fois | le nombre de lignes de Actions et de Soutiens n'a pas changé (le widget ne fait que lire) | Comptes de lignes notés avant / après |

### F4 : Affichage des cartes, états et messages

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-013 | CARTES | PAGES, CONFIG | Cas normal | majeur | un propriétaire, la page « Dashboard » existe | il ouvre l'accueil | la carte « Accéder à la liste des actions » est normale (non grisée), sans message d'état | Document DEV |
| ACC-014 | CARTES | PAGES, CONFIG | Erreurs de saisie | majeur | aucune configuration enregistrée et la page « Page publique » n'existe pas (renommée en « Soutien test ») | un propriétaire ouvre l'accueil | la carte « Accéder à la page publique de soutien » est grisée, sans lien, avec le message « Page « Page publique » introuvable dans ce document. » ; l'autre carte reste active | Page renommée « Soutien test » |
| ACC-015 | CARTES | AFFICHAGE | Mobile et accessibilité | mineur | la carte grisée de ACC-014 | le testeur essaie de l'atteindre avec la touche Tab et de cliquer dessus | elle n'est pas atteignable au clavier et le clic ne change pas de page | Même situation que ACC-014 |
| ACC-016 | CARTES | CONFIG | Limites | mineur | le document est lent à charger (réseau limité dans le navigateur) | le testeur recharge l'accueil | aucun message « introuvable » ne clignote avant l'affichage final des cartes | Réseau ralenti (outils du navigateur) [À CONFIRMER : outil] |
| ACC-017 | CARTES | PAGES | Limites | mineur | le jeton d'adresse du document est indisponible [À CONFIRMER : comment le simuler sur DEV] | le testeur ouvre l'accueil | les cartes sont grisées avec le message « Adresse du document indisponible. » | [À CONFIRMER] |

### Droits par profil (F3, F4, F5)

Piège connu : pour un accès partiel, Grist efface le nom des pages qui portent un widget sur une table que l'utilisateur ne voit pas. Tant qu'un propriétaire n'a pas enregistré la configuration (bouton du widget, PUIS bouton affiché en haut par Grist), les cartes de ces utilisateurs sont grisées.

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-018 | CARTES | CONFIG, PAGES | Droits par profil | majeur | profil **Propriétaire** (compte de test), configuration enregistrée | il ouvre l'accueil | les deux cartes sont actives et le bouton « Ouvrir la configuration » de Grist est disponible | Compte propriétaire de test |
| ACC-019 | CARTES | CONFIG, PAGES | Droits par profil | majeur | configuration **non** enregistrée, profil **FT Départemental** (accès partiel) | il ouvre l'accueil | la carte du Dashboard est grisée avec « Cible non enregistrée : un propriétaire du document doit la choisir dans la configuration du widget. » (ou le message équivalent si la liste est illisible) | Compte FT Départemental de test |
| ACC-020 | CARTES | CONFIG | Droits par profil | bloquant | un propriétaire a enregistré la configuration (les **deux** « Enregistrer »), profil **FT Départemental** | l'utilisateur ouvre l'accueil et clique sur chaque carte | les deux cartes sont actives et mènent aux bonnes pages | Compte FT Départemental de test |
| ACC-021 | CARTES | CONFIG | Droits par profil | bloquant | même situation que ACC-020, profil **FT Régional** | idem | idem : cartes actives, bonnes pages | Compte FT Régional de test |
| ACC-022 | CARTES | CONFIG | Droits par profil | bloquant | même situation que ACC-020, profil **FT National** | idem | idem : cartes actives, bonnes pages | Compte FT National de test |
| ACC-023 | CARTES | CONFIG | Droits par profil | bloquant | même situation que ACC-020, profil **ANS** | idem | idem : cartes actives, bonnes pages [À CONFIRMER : l'ANS a-t-il le droit d'ouvrir le Dashboard ?] | Compte ANS de test |
| ACC-024 | CONFIG | CARTES | Droits par profil | majeur | un propriétaire a cliqué sur le « Enregistrer » du widget mais **pas** sur celui de Grist en haut | un utilisateur à accès partiel (FT Départemental) recharge l'accueil | ses cartes restent grisées : le choix n'a pas été conservé | Comptes propriétaire et FT Départemental |
| ACC-025 | CONFIG | CARTES | Droits par profil | majeur | profil à accès partiel (FT Régional) | il cherche à ouvrir la configuration du widget | soit le bouton n'existe pas pour lui, soit le panneau affiche « Vos droits ne permettent pas de lire la liste des pages du document : ouvrez cette configuration en tant que propriétaire. » ; aucun enregistrement n'est possible [À CONFIRMER] | Compte FT Régional de test |

### F5 : Panneau de configuration

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-026 | CONFIG | CARTES | Cas normal | majeur | un propriétaire sur l'accueil | il clique sur « Ouvrir la configuration » (panneau de droite) | le texte d'accueil et les cartes disparaissent, le panneau « Cible des cartes » s'affiche, avec deux listes, l'aide et les boutons Enregistrer / Annuler ; le curseur est dans la première liste | Compte propriétaire |
| ACC-027 | CONFIG | CARTES, PAGES | Cas normal | majeur | les cartes visent « Dashboard » et « Page publique » | le propriétaire ouvre la configuration | chaque liste présélectionne la page que sa carte vise déjà | Document DEV |
| ACC-028 | CONFIG | CARTES, PAGES | Erreurs de saisie | majeur | aucune page « Dashboard » ni numéro enregistré (page renommée « Tableau test ») | le propriétaire ouvre la configuration | la première liste affiche « Choisir une page » (non sélectionnable ensuite) et aucune page n'est choisie à sa place | Page renommée « Tableau test » |
| ACC-029 | CONFIG | CARTES | Cas normal | majeur | le panneau est ouvert | le propriétaire clique sur « Annuler » | le panneau se ferme, texte et cartes reviennent, rien n'est modifié (les cartes visent les mêmes pages qu'avant) | Changement de choix puis annulation |
| ACC-030 | CONFIG | AFFICHAGE | Mobile et accessibilité | majeur | le panneau est ouvert | le testeur utilise uniquement le clavier : Tab, flèches dans les listes, Entrée sur « Enregistrer » | l'ordre est liste 1, liste 2, Enregistrer, Annuler ; le focus est visible ; Entrée sur « Enregistrer » valide ; chaque liste est annoncée avec son libellé | Clavier seul |
| ACC-031 | CONFIG | AFFICHAGE | Mobile et accessibilité | mineur | un écran de 360 px de large | le propriétaire ouvre la configuration | le panneau tient dans la largeur, sans défilement horizontal, et les boutons restent utilisables | Fenêtre redimensionnée à 360 px |

### F6 : Enregistrement de la configuration

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-032 | CONFIG | CARTES, PAGES | Cas normal | bloquant | le panneau est ouvert, la 2e liste est passée sur « Page test A » | le propriétaire clique sur « Enregistrer » du widget, puis sur le « Enregistrer » affiché en haut par Grist | le panneau se ferme et la 2e carte mène désormais à « Page test A » | Page « Page test A » |
| ACC-033 | CONFIG | CARTES | Conservation | bloquant | la configuration de ACC-032 est enregistrée | le propriétaire recharge la page du navigateur (F5), puis se reconnecte | le choix est conservé : la 2e carte mène toujours à « Page test A » | Même situation que ACC-032 |
| ACC-034 | CONFIG | CARTES | Conservation | majeur | le propriétaire a changé un choix et cliqué seulement sur l'« Enregistrer » du widget | il recharge la page sans cliquer sur le bouton de Grist en haut | l'ancien choix revient : c'est le comportement décrit dans le README (second clic nécessaire) | Changement de choix volontaire |
| ACC-035 | CONFIG | CARTES, PAGES | Limites | majeur | le propriétaire a enregistré « Page test A » puis la page est renommée en « Page test B » | il recharge et ouvre la configuration | la liste présélectionne « Page test B » (même numéro, nouveau nom) | Renommage « Page test A » vers « Page test B » |
| ACC-036 | CONFIG | CARTES | Erreurs de saisie | majeur | la 1re liste est sur « Choisir une page » (voir ACC-028), la 2e liste sur une vraie page | le propriétaire enregistre | seul le choix de la 2e carte est enregistré ; la 1re carte revient au nom par défaut « Dashboard » (grisée si introuvable) [À CONFIRMER : comportement voulu] | Page renommée « Tableau test » |
| ACC-037 | CONFIG | CARTES | Conservation | majeur | la configuration est enregistrée | le propriétaire consulte les tables Actions et Soutiens | aucune ligne n'a été créée ou modifiée par l'enregistrement : seules les options du widget changent | Comptes de lignes avant / après |

### F7 : Mise en page, mode sombre, clavier, accessibilité

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-038 | AFFICHAGE | CARTES | Cas normal | mineur | un grand écran (plus de 1000 px de large), un propriétaire | il ouvre l'accueil | le texte « Bienvenue sur l'outil Partenariat simplifié ... Que souhaitez-vous faire ? » est centré, puis les deux cartes s'alignent sur la même ligne, avec leur illustration à gauche et le chevron à droite | Fenêtre 1280 px |
| ACC-039 | AFFICHAGE | CARTES | Mobile et accessibilité | majeur | une fenêtre de 800 px puis de 360 px de large | le testeur redimensionne et regarde la page | à 800 px : deux colonnes ; à 360 px : une colonne, titres de cartes lisibles, aucun défilement horizontal, rien de coupé | Fenêtres 800 px et 360 px |
| ACC-040 | AFFICHAGE | CARTES, CONFIG | Mobile et accessibilité | majeur | le réglage de l'ordinateur est en mode sombre [À CONFIRMER : le widget gère-t-il le mode sombre ?] | le testeur ouvre l'accueil, puis la configuration | tous les textes restent lisibles (pas de texte clair sur fond clair ni foncé sur foncé), y compris la carte grisée et le message d'état ; les illustrations restent visibles | Mode sombre du système |
| ACC-041 | AFFICHAGE | CARTES | Mobile et accessibilité | majeur | les deux cartes sont actives | le testeur utilise uniquement le clavier : Tab, puis Entrée | le focus passe d'abord à la 1re carte puis à la 2e, avec un contour visible ; Entrée ouvre la page visée | Clavier seul |
| ACC-042 | AFFICHAGE | CARTES | Mobile et accessibilité | mineur | un lecteur d'écran actif [À CONFIRMER : lequel] | le testeur parcourt la page | la zone des cartes est annoncée « Accès rapides » ; chaque carte est lue avec son titre et son message d'état éventuel ; les illustrations et chevrons ne sont pas lus | Lecteur d'écran de test |
| ACC-043 | AFFICHAGE | CARTES, CONFIG | Limites | mineur | le navigateur est zoomé à 200 % | le testeur ouvre l'accueil et la configuration | tout le contenu reste lisible et utilisable, sans texte coupé | Zoom 200 % |
| ACC-044 | AFFICHAGE | CARTES | Erreurs de saisie | mineur | aucun champ de saisie sur l'accueil | (sans objet pour les cartes) | **Non applicable** pour l'accueil. L'erreur de saisie du panneau est couverte par ACC-028 et ACC-036 | Sans objet |

### F8 : Bandeau (décision en attente)

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-045 | BANDEAU | AFFICHAGE | Cas normal | majeur | [À CONFIRMER : bandeau propre ou bandeau commun] un utilisateur ouvre la page d'accueil | il regarde le haut de la page | un seul bandeau est affiché en haut de page, ni deux, ni aucun | Compte propriétaire de test |

## 3. Tests à rejouer après une correction (rappel)

- Rejouer le test concerné, puis tous les tests qui ont le même « Module » ou qui le citent dans « Modules voisins ».
- Relancer **toute la suite automatique** (`npm test`) : c'est le journal d'exécution qui fait foi, pas ce carnet.
- Celui qui a trouvé l'anomalie est celui qui la ferme (Ouverte, Corrigée, Vérifiée, Fermée).

## 4. Historique du carnet

| Date | Qui | Quoi | Pourquoi |
| ---- | --- | ---- | -------- |
| 16/10/2026 | Recetteur (IA), à relire par un humain | Création du brouillon, 45 tests (ACC-001 à ACC-045) | Mission 1 : premier brouillon, non validé |

## 5. Liste des [À CONFIRMER]

1. Les fonctions F1 à F8 ci-dessus : sont-elles bien le découpage voulu ?
2. Bandeau : propre ou commun ? Tant que ce n'est pas décidé, seul ACC-045 existe. Si le bandeau propre est retiré, la page doit garder un titre principal (h1) pour l'accessibilité : test à ajouter à ce moment-là.
3. Mode sombre (ACC-040) : le widget n'a aucune règle propre pour le mode sombre, il dépend des variables du design system. Le mode sombre est-il attendu et que doit-on voir exactement ?
4. Rôle Grist de chaque compte de test (FT National, Régional, Départemental, ANS) : sont-ils tous des utilisateurs à accès partiel (éditeur) ? Les comptes de test restent à fournir (guide du testeur).
5. L'ANS a-t-il le droit d'ouvrir la page Dashboard et la Page publique depuis la carte ? Que voit un utilisateur qui clique sur une carte vers une page qu'il n'a pas le droit de voir (ACC-023) ?
6. Comportement attendu quand un des deux choix est laissé sur « Choisir une page » à l'enregistrement (ACC-036).
7. Comment simuler « Adresse du document indisponible » sur DEV (ACC-017) ? Sinon ce test reste couvert par les tests automatiques seulement.
8. Le document DEV est-il dans un site d'équipe (préfixe `/o/`) (ACC-002) ? Une copie du document DEV est-elle autorisée pour ACC-003 ?
9. ACC-025 : un utilisateur à accès partiel voit-il le bouton « Ouvrir la configuration » ?
10. Lecteur d'écran à utiliser pour ACC-042, et outil pour ralentir le réseau (ACC-016).
11. Comportement si les images du design system (CDN) ne se chargent pas : à tester ? (aucun test écrit)
12. Comment reconnaître sur l'écran que la configuration est bien conservée, en dehors du comportement des cartes (pas d'indicateur visible dans le widget) ?
13. Valeurs de [À COMPLÉTER] du guide du testeur : lien du document DEV, version, comptes de test, personne à contacter, lieu de dépôt des anomalies.
14. Les fiches de campagne (`docs/tests/executions/`) et la liste de fumée (`docs/tests/fumee.md`) ne sont pas créées dans cette tâche.
