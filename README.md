# Widget Grist - Page d'accueil Partenariat simplifié

Page d'aiguillage du projet : un bandeau aux logos France Travail et « Les clubs
sportifs engagés », un texte d'accueil et une grille de cartes (quatre par
ligne) qui ouvrent chacune une page du document :

- **Accéder à la liste des actions** ;
- **Accéder à la page publique de soutien**.

## Navigation et configuration

Un widget Grist vit dans une iframe d'une autre origine que Grist, et l'API
plugin n'a pas de méthode pour changer de page. Chaque carte est donc un vrai
lien en `target="_top"` : cliquer recharge Grist sur la page visée.

Aucune adresse n'est écrite dans le code. Le widget la construit à l'exécution :

1. l'adresse du document vient du jeton d'accès (`grist.docApi.getAccessToken`) ;
2. la liste des pages vient des tables `_grist_Pages` et `_grist_Views` ;
3. la page visée par chaque carte vient des options du widget.

Tant que personne n'a rien configuré, les cartes visent les pages nommées
`Dashboard` et `Page publique`, mais **pour les propriétaires seulement**. Pour
un utilisateur à accès partiel (un éditeur que les règles d'accès privent d'une
table), Grist efface le nom de toute page qui porte un widget sur cette table,
et ne laisse que son numéro. Le tableau de bord, posé sur la table des actions,
perd ainsi son nom chez un éditeur sans profil, et sa carte resterait grisée.

Un propriétaire doit donc **enregistrer la configuration une fois** : bouton
« Ouvrir la configuration » du panneau de droite, vérifier la page présélectionnée
dans chaque liste, puis cliquer sur **les deux** boutons « Enregistrer » : celui
du widget, puis celui que Grist affiche tout en haut du widget. Sans ce second
clic, Grist ne conserve pas le choix. Le widget stocke le numéro de chaque
page, que tout le monde voit et qui survit aux renommages, avec son nom, qui sert
de repli si la page est supprimée puis recréée.

Les options sont stockées dans le document, avec le widget : une copie du
document les emporte, et rien ne transite par ce dépôt.

## Installation dans Grist

1. Ajouter à une page un widget personnalisé, sur n'importe quelle table.
2. Renseigner l'URL du widget (GitHub Pages, ou le serveur local ci-dessous).
3. Accorder l'**accès complet** : c'est le seul niveau qui permet de lire la
   liste des pages du document. Le widget n'écrit rien dans les tables.
4. En tant que propriétaire, ouvrir la configuration du widget, puis cliquer sur
   « Enregistrer » dans le widget **et** sur celui que Grist affiche en haut.

URL GitHub Pages :

```text
https://hantaranui.github.io/page-accueil-partenariat-simplifi-/page-accueil.html
```

## Structure

```text
src/page-accueil/index.html, style.css, script.js
build.js          assemble le dossier en page-accueil.html à la racine
test/             tests Node, sans dépendance
```

Grist et GitHub Pages ne chargent qu'un seul fichier HTML. Après toute
modification dans `src/`, relancer le build puis commiter à la fois les sources
et `page-accueil.html` : aucune CI ne fait ce build.

```text
npm run build
```

## Tester en local

```text
python3 -m http.server 8765
```

puis renseigner `http://localhost:8765/page-accueil.html` comme URL du widget
dans Grist. Les navigateurs acceptent qu'une page HTTPS affiche une iframe
servie en HTTP par `localhost`.

## Tests

```text
npm test
```

Lanceur intégré de Node, sans dépendance. Les tests couvrent :

- la construction des liens à partir de la configuration, y compris absente,
  incomplète ou périmée ;
- la fraîcheur de `page-accueil.html` par rapport à ses sources ;
- l'absence de collision entre nos classes et celles du design system.

`script.js` étant un script de page et non un module, il est évalué dans un bac
à sable `vm` muni de doublures du DOM et de l'API Grist : voir
`test/helpers/widget.js`.

## Design system France Travail

La page charge la feuille et l'autoloader du design system, dans l'univers
« Outils agent » (classe `outil-agent` sur `<body>`), comme le tableau de bord.
Composants et classes repris tels quels :

- les vignettes sont le composant **Card link** en variante large
  (`ds-card-link ds-card-link-lg`), avec les illustrations « spot » du design
  system (`dashboard.svg`, `handshake.svg`) et son état désactivé
  (`ds-card-link-disabled`) quand la page visée est introuvable. En univers
  agent, son titre a la taille du texte courant (14 px) et ne s'en distingue que
  par la police et la graisse : c'est voulu par le design system, on ne le
  grossit pas ;
- les titres prennent `.t1` et `.t2`, qui fixent police, taille et graisse ;
- le panneau de configuration utilise `form-label`, `form-control`,
  `btn btn-primary` et `btn btn-secondary`.

Les cartes gardent la disposition du composant (illustration à gauche, titre à
droite), sans description ni chevron. Notre grille ne règle que leur nombre par
ligne (quatre, puis deux, puis une selon la largeur) et la largeur totale.

Un écart subsiste volontairement, validé avec le responsable du projet : le
bandeau. L'en-tête agent du design system
(`ft-header-agent`) n'affiche qu'un logo d'application et son nom, alignés à
gauche ; il ne permet ni le logo France Travail, ni le titre centré entre les
deux logos que demande la maquette.

Règles suivies :

- vérifier les noms de classes dans la feuille livrée par le CDN, jamais dans
  les pages de composants, qui ne portent pas toujours les mêmes noms ni les
  mêmes valeurs (la documentation annonce une graisse de 400 pour les titres, la
  feuille applique 500) ;
- ne jamais reprendre un de ses noms de classe pour une classe à soi : les
  nôtres portent toutes le préfixe `home-`. L'inventaire de ses classes est gardé
  dans `test/design-system-classes.txt` ; la commande pour le régénérer est en
  tête de `test/styles.test.js` ;
- ne pas colorer un texte posé sur un fond de couleur ;
- contrastes mesurés sur les couleurs calculées par le navigateur : le plus
  faible pour du texte est celui d'une carte désactivée, 5,5:1.
