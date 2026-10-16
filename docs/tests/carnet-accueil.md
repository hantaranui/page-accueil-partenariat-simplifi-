# Carnet de tests : page d'accueil (widget Grist, Partenariat simplifié)

**Statut : BROUILLON du recetteur, à valider par le chef de projet, puis à compléter par le développeur de la fonction.** Ce n'est pas un carnet définitif. Aucun test de ce fichier n'a été joué.

- Date du brouillon : 16/10/2026 (réorganisé en trois parties le même jour)
- Environnement de tous les tests : **DEV** uniquement, données fictives uniquement. Aucun test en PROD.
- Version testée : [À COMPLÉTER à chaque campagne]
- Sources lues : README.md, src/page-accueil/index.html, script.js, style.css, protocole et guide du testeur.
- Il n'existe pas de document de « fonctions détaillées » : les fonctions ci-dessous sont déduites du README et du code. **À valider.**

## Comment ce carnet est organisé

| Partie | Pour qui | Contenu | Nombre de tests |
| ------ | -------- | ------- | --------------- |
| 1. Préparation | La développeuse, **avant** le test | Ce qu'il faut mettre en place pour que le testeur puisse jouer ses tests | (pas de tests : 13 actions à faire, P-01 à P-13) |
| 2. Tests du testeur | Le testeur, **depuis l'écran** | Cliquer, regarder, comparer avec ce qui est écrit. Rien à modifier, aucun outil de développeur | **24** |
| 3. Tests de la développeuse | La développeuse | Tests tirés du code, simulations d'erreur, renommages et suppressions de pages, réseau lent, lecteur d'écran, etc. | **21** (dont 1 « Non applicable ») |

Total : 24 + 21 = **45 tests** (ACC-001 à ACC-045). Les numéros n'ont pas changé : un test garde son numéro, quelle que soit sa partie.

## Fonctions identifiées (à valider)

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

Profils de test (comptes de la table Utilisateurs) : **Propriétaire** du document, et utilisateurs à accès partiel **FT National, FT Régional, FT Départemental, ANS**.

Abréviations de la colonne « Module » : CARTES (F1, F3, F4), PAGES (F2), CONFIG (F5, F6), AFFICHAGE (F7), BANDEAU (F8).

---

# PARTIE 1 : Préparation (par la développeuse, avant le test)

À faire **avant** de donner le carnet au testeur. Une ligne par action. Le testeur ne peut rien préparer lui-même : il n'a ni accès à la configuration du document, ni accès au code.

## 1.1 Les trois situations de départ

Certains tests ont besoin que le document soit dans un état précis. Ces états ne vont pas ensemble : il faut les mettre en place **l'un après l'autre**, dans cet ordre, et prévenir le testeur à chaque changement.

| Situation | Ce qu'elle veut dire | Tests concernés |
| --------- | -------------------- | --------------- |
| **A** | Configuration du widget **non enregistrée**. Toutes les pages ont leur nom normal. | ACC-019 |
| **B** | Configuration **non enregistrée**. La page « Page publique » a été renommée « Soutien test ». | ACC-014, ACC-015 |
| **C** | Configuration **enregistrée** (carte 1 sur « Dashboard », carte 2 sur « Page publique »). Toutes les pages ont leur nom normal. | Tous les autres tests de la partie 2 |

## 1.2 Liste des actions

| N° | À préparer | Détail | Tests qui en dépendent | Fait par / date |
| -- | ---------- | ------ | ---------------------- | --------------- |
| P-01 | Informations pour le testeur | Lien du document DEV, version à tester, personne à contacter, lieu de dépôt des anomalies (voir « À fournir avant le test » du guide du testeur). Aucun mot de passe écrit dans un fichier : les transmettre par un autre canal. | Tous les tests de la partie 2 | |
| P-02 | Compte de test **Propriétaire** | Un compte de test avec le droit de propriétaire sur le document DEV. Le testeur s'en sert seulement pour regarder et ouvrir le panneau, jamais pour enregistrer [À CONFIRMER : le testeur peut-il avoir ce compte ?]. | ACC-004, 007, 008, 013, 014, 015, 018, 026, 027, 029, 030, 031, 038, 039, 040, 041, 043, 045 | |
| P-03 | Compte de test **FT Départemental** | Compte à accès partiel, avec son département (fictif). | ACC-019, 020 | |
| P-04 | Compte de test **FT Régional** | Compte à accès partiel, avec sa direction régionale (fictive). | ACC-021, 025 | |
| P-05 | Compte de test **FT National** | Compte à accès partiel. | ACC-022 | |
| P-06 | Compte de test **ANS** | Compte à accès partiel. | ACC-023 | |
| P-07 | Droits d'accès aux pages visées | Vérifier que chaque compte à accès partiel a le droit d'ouvrir les pages « Dashboard » et « Page publique » [À CONFIRMER, surtout pour l'ANS]. | ACC-020, 021, 022, 023 | |
| P-08 | Pages qui doivent exister | Les pages « Dashboard », « Page publique » et « Page test A » existent, avec ces noms exacts, et apparaissent dans le menu des pages à gauche. | ACC-004, 007, 008, 013, 018, 020 à 023, 027 | |
| P-09 | Mettre en place la **situation A** | Le widget n'a aucune configuration enregistrée et les pages ont leur nom normal. [À CONFIRMER : comment remettre à zéro les options du widget sur DEV.] | ACC-019 | |
| P-10 | Mettre en place la **situation B** | Toujours sans configuration enregistrée, renommer la page « Page publique » en « Soutien test » (carte grisée à voir). | ACC-014, 015 | |
| P-11 | Mettre en place la **situation C** | Redonner à la page son nom « Page publique ». Ouvrir la configuration en tant que propriétaire, choisir « Dashboard » pour la carte 1 et « Page publique » pour la carte 2, puis cliquer sur « Enregistrer » du widget, **PUIS** sur le bouton « Enregistrer » que Grist affiche en haut. Recharger la page pour vérifier. | Tous les autres tests de la partie 2 | |
| P-12 | Décision sur le bandeau | Savoir quel bandeau doit s'afficher en haut de la page pendant la campagne (le bandeau propre à la page, ou le bandeau commun), pour écrire la bonne réponse attendue. [À CONFIRMER] | ACC-045 | |
| P-13 | Ordre de la campagne | Faire jouer la partie 2 **avant** la partie 3 : les tests de la partie 3 renomment, suppriment ou enregistrent des pages et changent la configuration. Après la partie 3, remettre le document dans l'état voulu. | Parties 2 et 3 | |

---

# PARTIE 2 : Tests du testeur (depuis l'écran)

## Avant de commencer : de quoi parle-t-on ?

**La page d'accueil** est la première page du document « Partenariat Simplifié » de France Travail. Elle est faite pour aiguiller : elle affiche un texte de bienvenue (« Bienvenue sur l'outil Partenariat simplifié… Que souhaitez-vous faire ? ») et **deux grandes cartes** sur lesquelles on clique, comme sur un bouton :

- la carte **« Accéder à la liste des actions »** (elle doit ouvrir la page « Dashboard », un tableau de bord) ;
- la carte **« Accéder à la page publique de soutien »** (elle doit ouvrir la page « Page publique »).

Une **carte grisée** est une carte qu'on ne peut pas utiliser : un petit message en dessous explique pourquoi.

À droite de l'écran, Grist affiche un bouton **« Ouvrir la configuration »**. Il sert à choisir quelle page ouvre chaque carte. Vous ne l'utiliserez que pour **regarder** : vous n'enregistrez jamais rien.

**Votre rôle** : faire ce qui est écrit, regarder l'écran, et dire si ce que vous voyez est bien ce qui est annoncé dans « Ce qu'on doit voir ». Vous n'avez pas besoin de comprendre comment la page est faite.

## Règles du jeu

- Un seul document : le document **DEV** (jamais PROD).
- Chaque test dit **quel compte utiliser**. Changez de compte quand c'est demandé (Propriétaire, FT Départemental, FT Régional, FT National, ANS).
- **Ne cliquez jamais sur « Enregistrer »** dans le panneau de configuration. Ne modifiez, ne renommez et ne supprimez aucune page ni aucune donnée.
- **Ouvrir la page d'accueil** (étape 1 de beaucoup de tests) : connectez-vous avec le compte demandé, ouvrez le document DEV, puis cliquez sur la page d'accueil dans la liste des pages à gauche [À CONFIRMER : nom exact de la page d'accueil dans le menu].
- Pour chaque test, notez le résultat : **OK** (c'est comme annoncé), **KO** (ce n'est pas comme annoncé), **Bloqué** (impossible de jouer le test), **Non testé** ou **Non applicable**. Ajoutez votre nom, la date, la version et l'environnement (DEV).
- Si c'est KO : faites une **capture d'écran** et notez les étapes que vous avez suivies.
- La développeuse vous dit dans quelle **situation** (A, B ou C) se trouve le document avant chaque série. Jouez les séries dans l'ordre.

## Série A : situation A (configuration non enregistrée)

### ACC-019 · Un utilisateur à accès partiel voit une carte grisée tant que rien n'est enregistré

- Criticité : majeur · Module : CARTES · Tests voisins : CONFIG, PAGES
- **Compte** : FT Départemental · **Situation** : A
- **Étapes**
  1. Ouvrez la page d'accueil (voir « Règles du jeu »).
  2. Regardez les deux cartes.
- **Ce qu'on doit voir** : la carte « Accéder à la liste des actions » est **grisée** (on ne peut pas cliquer dessus) et affiche en dessous le message « Cible non enregistrée : un propriétaire du document doit la choisir dans la configuration du widget. » Le message peut être un peu différent si la liste des pages n'a pas pu être lue : notez ce que vous lisez.

## Série B : situation B (une page a été renommée)

### ACC-014 · Une carte dont la page n'existe pas est grisée

- Criticité : majeur · Module : CARTES · Tests voisins : PAGES, CONFIG
- **Compte** : Propriétaire · **Situation** : B
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Regardez les deux cartes.
- **Ce qu'on doit voir** : la carte « Accéder à la page publique de soutien » est **grisée**, sans qu'on puisse cliquer, avec le message « Page « Page publique » introuvable dans ce document. » L'autre carte (« Accéder à la liste des actions ») reste normale et utilisable.

### ACC-015 · On ne peut pas atteindre une carte grisée au clavier

- Criticité : mineur · Module : CARTES · Tests voisins : AFFICHAGE
- **Compte** : Propriétaire · **Situation** : B (comme ACC-014)
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Appuyez plusieurs fois sur la touche **Tab** (touche à gauche du clavier, avec deux flèches) pour passer d'un élément à l'autre.
  3. Cliquez avec la souris sur la carte grisée.
- **Ce qu'on doit voir** : le contour de sélection passe sur la carte « Accéder à la liste des actions » mais **jamais** sur la carte grisée. Le clic sur la carte grisée ne change pas de page.

## Série C : situation C (configuration enregistrée)

### Avec le compte Propriétaire

### ACC-007 · La carte « liste des actions » ouvre la page Dashboard

- Criticité : bloquant · Module : CARTES · Tests voisins : CONFIG, PAGES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Cliquez sur la carte « Accéder à la liste des actions ».
- **Ce qu'on doit voir** : la page « Dashboard » s'ouvre sur **tout l'écran** de Grist (elle ne reste pas enfermée dans le petit cadre de la carte). Dans la liste des pages à gauche, « Dashboard » est surlignée [À CONFIRMER : surlignage visible].

### ACC-008 · La carte « page publique » ouvre la Page publique

- Criticité : bloquant · Module : CARTES · Tests voisins : CONFIG, PAGES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Cliquez sur la carte « Accéder à la page publique de soutien ».
- **Ce qu'on doit voir** : la page « Page publique » s'ouvre sur tout l'écran de Grist.

### ACC-013 · La carte « liste des actions » est normale quand la page existe

- Criticité : majeur · Module : CARTES · Tests voisins : PAGES, CONFIG
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Regardez la carte « Accéder à la liste des actions ».
- **Ce qu'on doit voir** : la carte est de la même couleur que d'habitude (pas grisée) et **aucun message** n'apparaît en dessous.

### ACC-018 · Le propriétaire voit les deux cartes actives et le bouton de configuration

- Criticité : majeur · Module : CARTES · Tests voisins : CONFIG, PAGES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Regardez les deux cartes, puis la partie droite de l'écran.
- **Ce qu'on doit voir** : les deux cartes sont normales (non grisées). Le bouton « Ouvrir la configuration » est présent à droite.

### ACC-004 · Les listes du panneau de configuration contiennent toutes les pages

- Criticité : majeur · Module : PAGES · Tests voisins : CONFIG
- **Compte** : Propriétaire · **Situation** : C (le document contient « Dashboard », « Page publique » et « Page test A »)
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Cliquez sur « Ouvrir la configuration » (à droite).
  3. Cliquez sur la première liste déroulante, lisez les noms, refermez-la. Faites de même avec la seconde.
  4. Comparez avec la liste des pages à gauche de l'écran.
  5. Cliquez sur « Annuler ».
- **Ce qu'on doit voir** : chacune des deux listes contient « Dashboard », « Page publique » et « Page test A », **dans le même ordre** que la liste des pages à gauche.

### ACC-026 · Le panneau de configuration s'ouvre correctement

- Criticité : majeur · Module : CONFIG · Tests voisins : CARTES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Cliquez sur « Ouvrir la configuration » (à droite).
  3. Regardez l'écran. **Ne cliquez pas sur « Enregistrer ».** Terminez par « Annuler ».
- **Ce qu'on doit voir** : le texte de bienvenue et les cartes ont disparu. À la place s'affiche un panneau « Cible des cartes » avec **deux listes déroulantes**, un texte d'aide, et les boutons « Enregistrer » et « Annuler ». Le curseur est déjà placé dans la première liste.

### ACC-027 · Les listes montrent déjà la page de chaque carte

- Criticité : majeur · Module : CONFIG · Tests voisins : CARTES, PAGES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil, puis le panneau avec « Ouvrir la configuration ».
  2. Lisez ce qui est écrit dans chacune des deux listes (sans les ouvrir).
  3. Cliquez sur « Annuler ».
- **Ce qu'on doit voir** : la première liste affiche « Dashboard » et la deuxième « Page publique » : chaque liste est déjà sur la page que sa carte ouvre.

### ACC-029 · « Annuler » ne change rien

- Criticité : majeur · Module : CONFIG · Tests voisins : CARTES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil, puis le panneau avec « Ouvrir la configuration ».
  2. Dans la première liste, choisissez une autre page (par exemple « Page test A »). **Ne cliquez pas sur « Enregistrer ».**
  3. Cliquez sur « Annuler ».
  4. Cliquez sur la carte « Accéder à la liste des actions ».
- **Ce qu'on doit voir** : après « Annuler », le panneau se ferme et le texte de bienvenue et les cartes reviennent. La carte ouvre toujours la page « Dashboard » (et non « Page test A »).

### ACC-030 · Le panneau de configuration se manipule au clavier

- Criticité : majeur · Module : CONFIG · Tests voisins : AFFICHAGE
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil, puis le panneau avec « Ouvrir la configuration ».
  2. N'utilisez plus la souris. Appuyez sur **Tab** pour passer d'un élément à l'autre.
  3. Quand une liste est sélectionnée, appuyez sur les touches **flèche haut / flèche bas** pour changer de page dans la liste.
  4. Amenez la sélection sur le bouton « Annuler » et appuyez sur **Entrée**.
- **Ce qu'on doit voir** : l'ordre des éléments est : première liste, deuxième liste, « Enregistrer », « Annuler ». Un **contour bien visible** entoure l'élément sélectionné. Entrée sur « Annuler » ferme le panneau.
- **Ne faites pas** Entrée sur « Enregistrer » : ce point (et l'annonce des libellés par un lecteur d'écran) est rejoué par la développeuse en partie 3 (complément à ACC-030).

### ACC-031 · Le panneau de configuration tient sur un écran étroit

- Criticité : mineur · Module : CONFIG · Tests voisins : AFFICHAGE
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Réduisez la largeur de la fenêtre du navigateur le plus possible, en tirant son bord droit vers la gauche (ou ouvrez le document sur un téléphone). [À CONFIRMER : méthode pour obtenir environ 360 px sans outil de développeur.]
  2. Ouvrez la page d'accueil, puis le panneau avec « Ouvrir la configuration ».
  3. Regardez le panneau, puis cliquez sur « Annuler ».
- **Ce qu'on doit voir** : le panneau tient dans la largeur de l'écran, **sans barre de défilement horizontale** (on n'a pas besoin de faire glisser l'écran vers la droite), et les boutons « Enregistrer » et « Annuler » sont visibles et cliquables.

### ACC-038 · Mise en page sur un grand écran

- Criticité : mineur · Module : AFFICHAGE · Tests voisins : CARTES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Mettez la fenêtre du navigateur en **plein écran** sur un écran d'ordinateur.
  2. Ouvrez la page d'accueil.
  3. Regardez le texte, puis les cartes.
- **Ce qu'on doit voir** : le texte de bienvenue (« Bienvenue sur l'outil Partenariat simplifié… Que souhaitez-vous faire ? ») est **centré**. Les deux cartes sont **côte à côte sur la même ligne**, chacune avec son dessin à gauche et une petite flèche à droite.

### ACC-039 · Mise en page quand l'écran se réduit

- Criticité : majeur · Module : AFFICHAGE · Tests voisins : CARTES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil, fenêtre en plein écran.
  2. Réduisez la fenêtre à environ la **moitié** de la largeur de l'écran. Regardez les cartes.
  3. Réduisez-la encore le plus possible (ou ouvrez le document sur un téléphone). Regardez les cartes. [À CONFIRMER : méthode pour mesurer environ 800 px puis 360 px.]
- **Ce qu'on doit voir** : à largeur moyenne, les cartes sont sur **deux colonnes**. À largeur minimale, elles sont **l'une sous l'autre**, les titres restent lisibles, **rien n'est coupé** et il n'y a **pas de barre de défilement horizontale**.

### ACC-040 · Lisibilité en mode sombre

- Criticité : majeur · Module : AFFICHAGE · Tests voisins : CARTES, CONFIG
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Passez votre ordinateur en **mode sombre** (Mac : Réglages Système, Apparence, Sombre. Windows : Paramètres, Personnalisation, Couleurs, Mode sombre). Rechargez la page du navigateur.
  2. Ouvrez la page d'accueil. Regardez le texte et les cartes.
  3. Ouvrez le panneau avec « Ouvrir la configuration », regardez-le, puis cliquez sur « Annuler ».
  4. **Remettez votre ordinateur en mode clair** après le test.
- **Ce qu'on doit voir** : tous les textes restent **lisibles** (pas de texte clair sur fond clair ni de texte foncé sur fond foncé). Les dessins des cartes restent visibles. [À CONFIRMER : le mode sombre est-il attendu pour ce widget, et que doit-on voir exactement ?]

### ACC-041 · Les cartes se manipulent au clavier

- Criticité : majeur · Module : AFFICHAGE · Tests voisins : CARTES
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. N'utilisez plus la souris. Appuyez sur **Tab** jusqu'à ce que la première carte soit entourée d'un contour.
  3. Appuyez encore sur **Tab** : regardez où va le contour.
  4. Revenez sur une carte et appuyez sur **Entrée**.
- **Ce qu'on doit voir** : le contour passe d'abord sur la 1re carte, puis sur la 2e, et il est **bien visible**. Entrée ouvre la page visée par la carte sélectionnée.

### ACC-043 · Page lisible avec un zoom à 200 %

- Criticité : mineur · Module : AFFICHAGE · Tests voisins : CARTES, CONFIG
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Zoomez le navigateur à **200 %** (touche Ctrl ou Cmd + la touche « + », plusieurs fois, jusqu'à lire « 200 % »).
  2. Ouvrez la page d'accueil. Regardez le texte et les cartes.
  3. Ouvrez le panneau avec « Ouvrir la configuration », regardez-le, puis cliquez sur « Annuler ».
  4. Remettez le zoom normal (Ctrl ou Cmd + 0).
- **Ce qu'on doit voir** : tout le contenu reste lisible et utilisable, **aucun texte n'est coupé**.

### ACC-045 · Un seul bandeau en haut de la page

- Criticité : majeur · Module : BANDEAU · Tests voisins : AFFICHAGE
- **Compte** : Propriétaire · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Regardez le haut de la page.
- **Ce qu'on doit voir** : **un seul** bandeau en haut (ni deux bandeaux l'un sous l'autre, ni aucun). [À CONFIRMER : bandeau propre à la page ou bandeau commun, et à quoi il doit ressembler.]

### Avec les comptes à accès partiel (chacun joue le même parcours)

### ACC-020 · FT Départemental : les deux cartes fonctionnent

- Criticité : bloquant · Module : CARTES · Tests voisins : CONFIG
- **Compte** : FT Départemental · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Cliquez sur la carte « Accéder à la liste des actions » et regardez la page qui s'ouvre. Revenez à la page d'accueil.
  3. Cliquez sur la carte « Accéder à la page publique de soutien » et regardez la page qui s'ouvre.
- **Ce qu'on doit voir** : les deux cartes sont **actives** (non grisées) et ouvrent les bonnes pages : « Dashboard » pour la première, « Page publique » pour la seconde.

### ACC-021 · FT Régional : les deux cartes fonctionnent

- Criticité : bloquant · Module : CARTES · Tests voisins : CONFIG
- **Compte** : FT Régional · **Situation** : C
- **Étapes** : les mêmes que ACC-020.
- **Ce qu'on doit voir** : les mêmes résultats que ACC-020 : cartes actives, bonnes pages.

### ACC-022 · FT National : les deux cartes fonctionnent

- Criticité : bloquant · Module : CARTES · Tests voisins : CONFIG
- **Compte** : FT National · **Situation** : C
- **Étapes** : les mêmes que ACC-020.
- **Ce qu'on doit voir** : les mêmes résultats que ACC-020 : cartes actives, bonnes pages.

### ACC-023 · ANS : les deux cartes fonctionnent

- Criticité : bloquant · Module : CARTES · Tests voisins : CONFIG
- **Compte** : ANS · **Situation** : C
- **Étapes** : les mêmes que ACC-020.
- **Ce qu'on doit voir** : les mêmes résultats que ACC-020 : cartes actives, bonnes pages. [À CONFIRMER : l'ANS a-t-elle le droit d'ouvrir le Dashboard ? Si non, que doit-on voir en cliquant ?] Si une page refuse de s'ouvrir, notez le message exact et faites une capture.

### ACC-025 · Un utilisateur à accès partiel ne peut pas enregistrer la configuration

- Criticité : majeur · Module : CONFIG · Tests voisins : CARTES
- **Compte** : FT Régional · **Situation** : C
- **Étapes**
  1. Ouvrez la page d'accueil.
  2. Cherchez le bouton « Ouvrir la configuration » à droite de l'écran. S'il existe, cliquez dessus.
  3. Regardez ce qui s'affiche. **Ne cliquez pas sur « Enregistrer » s'il est visible.**
- **Ce qu'on doit voir** : soit le bouton « Ouvrir la configuration » **n'existe pas** pour ce compte, soit le panneau affiche « Vos droits ne permettent pas de lire la liste des pages du document : ouvrez cette configuration en tant que propriétaire. » Dans les deux cas, on ne peut rien enregistrer. [À CONFIRMER]

---

# PARTIE 3 : Tests de la développeuse

Tous les tests qui ne se jouent pas depuis l'écran avec un compte de test : lecture du code ou de l'adresse, tables de Grist, renommage ou suppression de pages, création de pages, copie du document, enregistrements de la configuration, simulation d'erreur, outils du navigateur (réseau lent), lecteur d'écran.

**Complément à ACC-030** (test joué en partie 2, sauf deux points) : appuyer sur **Entrée** sur le bouton « Enregistrer » doit valider le choix, et chaque liste doit être annoncée avec son libellé par un lecteur d'écran. Ces deux points sont rejoués ici avec ACC-032 et ACC-042.

À jouer **après** la partie 2 (voir P-13).

### F1 : Adresse du document

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-001 | CARTES | CONFIG | Cas normal | bloquant | un propriétaire sur la page d'accueil du document DEV, configuration enregistrée | il survole la carte « Accéder à la liste des actions » et lit l'adresse affichée par le navigateur | l'adresse a la forme `<adresse du document DEV>/doc/<identifiant>/p/<n>`, avec le mot `doc` avant l'identifiant | Document DEV, compte propriétaire de test |
| ACC-002 | CARTES | CONFIG | Limites | majeur | le document DEV est ouvert dans un site d'équipe dont l'adresse contient `/o/<équipe>` [À CONFIRMER] | le testeur lit l'adresse d'une carte | le préfixe `/o/<équipe>` est conservé avant `/doc/` | Document DEV d'équipe fictive |
| ACC-003 | CARTES | CONFIG | Conservation | majeur | une copie du document DEV (nommée « Copie test accueil ») avec le widget | le propriétaire clique sur une carte de la copie | Grist ouvre la page de la **copie**, pas celle du document d'origine | Copie fictive du document DEV [À CONFIRMER : copie autorisée] |

### F2 : Liste des pages du document

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-005 | PAGES | CONFIG | Erreurs de saisie | mineur | une page nommée `Test <b>gras</b> & co` | le propriétaire ouvre la configuration | le nom apparaît à l'identique dans les listes, sans mise en gras ni caractère transformé | Page « Test <b>gras</b> & co » |
| ACC-006 | PAGES | CONFIG | Limites | mineur | un document de test avec une cinquantaine de pages | le propriétaire ouvre la configuration | toutes les pages sont listées, l'ouverture reste fluide, rien n'est tronqué | 50 pages fictives « Page test 01 » à « Page test 50 » |

### F3 : Page visée par chaque carte

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-009 | CARTES | CONFIG | Cas normal | majeur | une copie fraîche du widget, rien d'enregistré, un propriétaire connecté | il regarde puis clique sur chaque carte | les cartes visent les pages nommées « Dashboard » et « Page publique » | Document fictif sans configuration |
| ACC-010 | CARTES | CONFIG, PAGES | Limites | majeur | la configuration est enregistrée sur « Dashboard » | le propriétaire renomme cette page en « Tableau de bord test » dans Grist, puis recharge l'accueil et clique sur la carte | la carte mène toujours à la même page (suivie par son numéro) | Renommage fictif de « Dashboard » |
| ACC-011 | CARTES | CONFIG, PAGES | Limites | majeur | la configuration est enregistrée sur « Page publique » | le propriétaire supprime la page, en recrée une du même nom « Page publique », puis recharge et clique sur la carte | la carte mène à la page recréée (repli par le nom) | Page « Page publique » recréée |
| ACC-012 | CARTES | CONFIG | Conservation | majeur | un propriétaire sur l'accueil, compter les lignes des tables Actions et Soutiens avant le test | il clique sur chaque carte et revient à l'accueil trois fois | le nombre de lignes de Actions et de Soutiens n'a pas changé (le widget ne fait que lire) | Comptes de lignes notés avant / après |

### F4 : Affichage des cartes, états et messages

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-016 | CARTES | CONFIG | Limites | mineur | le document est lent à charger (réseau limité dans le navigateur) | le testeur recharge l'accueil | aucun message « introuvable » ne clignote avant l'affichage final des cartes | Réseau ralenti (outils du navigateur) [À CONFIRMER : outil] |
| ACC-017 | CARTES | PAGES | Limites | mineur | le jeton d'adresse du document est indisponible [À CONFIRMER : comment le simuler sur DEV] | le testeur ouvre l'accueil | les cartes sont grisées avec le message « Adresse du document indisponible. » | [À CONFIRMER] |

### Droits par profil : cas qui demandent une action sur la configuration

Piège connu : pour un accès partiel, Grist efface le nom des pages qui portent un widget sur une table que l'utilisateur ne voit pas. Tant qu'un propriétaire n'a pas enregistré la configuration (bouton du widget, PUIS bouton affiché en haut par Grist), les cartes de ces utilisateurs sont grisées.

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-024 | CONFIG | CARTES | Droits par profil | majeur | un propriétaire a cliqué sur le « Enregistrer » du widget mais **pas** sur celui de Grist en haut | un utilisateur à accès partiel (FT Départemental) recharge l'accueil | ses cartes restent grisées : le choix n'a pas été conservé | Comptes propriétaire et FT Départemental |

### F5 : Panneau de configuration (cas qui modifient des pages)

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-028 | CONFIG | CARTES, PAGES | Erreurs de saisie | majeur | aucune page « Dashboard » ni numéro enregistré (page renommée « Tableau test ») | le propriétaire ouvre la configuration | la première liste affiche « Choisir une page » (non sélectionnable ensuite) et aucune page n'est choisie à sa place | Page renommée « Tableau test » |

### F6 : Enregistrement de la configuration

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-032 | CONFIG | CARTES, PAGES | Cas normal | bloquant | le panneau est ouvert, la 2e liste est passée sur « Page test A » | le propriétaire clique sur « Enregistrer » du widget, puis sur le « Enregistrer » affiché en haut par Grist | le panneau se ferme et la 2e carte mène désormais à « Page test A » | Page « Page test A » |
| ACC-033 | CONFIG | CARTES | Conservation | bloquant | la configuration de ACC-032 est enregistrée | le propriétaire recharge la page du navigateur (F5), puis se reconnecte | le choix est conservé : la 2e carte mène toujours à « Page test A » | Même situation que ACC-032 |
| ACC-034 | CONFIG | CARTES | Conservation | majeur | le propriétaire a changé un choix et cliqué seulement sur l'« Enregistrer » du widget | il recharge la page sans cliquer sur le bouton de Grist en haut | l'ancien choix revient : c'est le comportement décrit dans le README (second clic nécessaire) | Changement de choix volontaire |
| ACC-035 | CONFIG | CARTES, PAGES | Limites | majeur | le propriétaire a enregistré « Page test A » puis la page est renommée en « Page test B » | il recharge et ouvre la configuration | la liste présélectionne « Page test B » (même numéro, nouveau nom) | Renommage « Page test A » vers « Page test B » |
| ACC-036 | CONFIG | CARTES | Erreurs de saisie | majeur | la 1re liste est sur « Choisir une page » (voir ACC-028), la 2e liste sur une vraie page | le propriétaire enregistre | seul le choix de la 2e carte est enregistré ; la 1re carte revient au nom par défaut « Dashboard » (grisée si introuvable) [À CONFIRMER : comportement voulu] | Page renommée « Tableau test » |
| ACC-037 | CONFIG | CARTES | Conservation | majeur | la configuration est enregistrée | le propriétaire consulte les tables Actions et Soutiens | aucune ligne n'a été créée ou modifiée par l'enregistrement : seules les options du widget changent | Comptes de lignes avant / après |

### F7 : Accessibilité (lecteur d'écran) et test sans objet

| ID | Module | Modules voisins | Angle | Criticité | Étant donné | Quand | Alors | Données fictives |
| -- | ------ | --------------- | ----- | --------- | ----------- | ----- | ----- | ---------------- |
| ACC-042 | AFFICHAGE | CARTES | Mobile et accessibilité | mineur | un lecteur d'écran actif [À CONFIRMER : lequel] | le testeur parcourt la page | la zone des cartes est annoncée « Accès rapides » ; chaque carte est lue avec son titre et son message d'état éventuel ; les illustrations et chevrons ne sont pas lus | Lecteur d'écran de test |
| ACC-044 | AFFICHAGE | CARTES | Erreurs de saisie | mineur | aucun champ de saisie sur l'accueil | (sans objet pour les cartes) | **Non applicable** pour l'accueil : il n'y a aucun champ à remplir sur la page d'accueil. L'erreur de saisie du panneau est couverte par ACC-028 et ACC-036 | Sans objet |

---

## Tests à rejouer après une correction (rappel)

- Rejouer le test concerné, puis tous les tests qui ont le même « Module » ou qui le citent dans « Modules voisins » (ils peuvent être dans la partie 2 ou la partie 3).
- Relancer **toute la suite automatique** (`npm test`) : c'est le journal d'exécution qui fait foi, pas ce carnet.
- Celui qui a trouvé l'anomalie est celui qui la ferme (Ouverte, Corrigée, Vérifiée, Fermée).

## Historique du carnet

| Date | Qui | Quoi | Pourquoi |
| ---- | --- | ---- | -------- |
| 16/10/2026 | Recetteur (IA), à relire par un humain | Création du brouillon, 45 tests (ACC-001 à ACC-045) | Mission 1 : premier brouillon, non validé |
| 16/10/2026 | Recetteur (IA), à relire par un humain | Réorganisation en trois parties : préparation, tests du testeur (24), tests de la développeuse (21). Aucun test supprimé ni renuméroté. Les tests du testeur sont réécrits en étapes simples. ACC-030 : la partie « Entrée sur Enregistrer » et « annonce par un lecteur d'écran » est retirée du test du testeur (elle modifierait la configuration ou demande un lecteur d'écran) et renvoyée à la développeuse (complément à ACC-030). ACC-044 reste « Non applicable ». | Le testeur n'est pas développeur et ne peut pas modifier la configuration ni les pages : le brouillon était trop difficile pour lui |

## Liste des [À CONFIRMER]

1. Les fonctions F1 à F8 ci-dessus : sont-elles bien le découpage voulu ?
2. Bandeau : propre ou commun ? Tant que ce n'est pas décidé, seul ACC-045 existe. Si le bandeau propre est retiré, la page doit garder un titre principal (h1, le grand titre de la page) pour l'accessibilité : test à ajouter à ce moment-là.
3. Mode sombre (ACC-040) : le widget n'a aucune règle propre pour le mode sombre, il dépend des variables du design system. Le mode sombre est-il attendu et que doit-on voir exactement ?
4. Rôle Grist de chaque compte de test (FT National, Régional, Départemental, ANS) : sont-ils tous des utilisateurs à accès partiel (éditeur) ? Les comptes de test restent à fournir (guide du testeur).
5. L'ANS a-t-il le droit d'ouvrir la page Dashboard et la Page publique depuis la carte ? Que voit un utilisateur qui clique sur une carte vers une page qu'il n'a pas le droit de voir (ACC-023) ?
6. Comportement attendu quand un des deux choix est laissé sur « Choisir une page » à l'enregistrement (ACC-036).
7. Comment simuler « Adresse du document indisponible » sur DEV (ACC-017) ? Sinon ce test reste couvert par les tests automatiques seulement.
8. Le document DEV est-il dans un site d'équipe (préfixe `/o/`) (ACC-002) ? Une copie du document DEV est-elle autorisée pour ACC-003 ?
9. ACC-025 : un utilisateur à accès partiel voit-il le bouton « Ouvrir la configuration » ?
10. Lecteur d'écran à utiliser pour ACC-042, et outil pour ralentir le réseau (ACC-016).
11. Comportement si les images du design system (CDN, le serveur qui fournit les dessins et styles) ne se chargent pas : à tester ? (aucun test écrit)
12. Comment reconnaître sur l'écran que la configuration est bien conservée, en dehors du comportement des cartes (pas d'indicateur visible dans le widget) ?
13. Valeurs de [À COMPLÉTER] du guide du testeur : lien du document DEV, version, comptes de test, personne à contacter, lieu de dépôt des anomalies.
14. Les fiches de campagne (`docs/tests/executions/`) et la liste de fumée (`docs/tests/fumee.md`) ne sont pas créées dans cette tâche.
15. (Nouveau) Le testeur peut-il recevoir un compte **Propriétaire** de test, pour des tests où il ne fait que regarder et ouvrir le panneau (P-02) ? Sinon, 18 tests de la partie 2 passent à la développeuse.
16. (Nouveau) Comment remettre à zéro la configuration du widget sur DEV pour la situation A (P-09) ?
17. (Nouveau) Nom exact de la page d'accueil dans le menu de gauche, et le testeur à accès partiel voit-il le menu des pages et le surlignage de la page ouverte (ACC-007, 020 à 023) ?
18. (Nouveau) Comment le testeur obtient-il, sans outil de développeur, une fenêtre d'environ 800 px puis 360 px de large (ACC-031, ACC-039) ? Un téléphone ou une taille de fenêtre donnée par la développeuse ?
19. (Nouveau) Les situations A, B et C (partie 1) sont-elles acceptables, ou préfère-t-on un document DEV séparé pour chaque situation ?
