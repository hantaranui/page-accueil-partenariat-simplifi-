# Widget Grist - Page d'accueil Partenariat simplifié

Page d'aiguillage du projet : un bandeau aux logos France Travail et « Les clubs
sportifs engagés », et deux cartes qui ouvrent chacune une page du document :

- **Tableau de bord des actions** ;
- **Page publique de soutien**.

## Navigation et configuration

Un widget Grist vit dans une iframe d'une autre origine que Grist, et l'API
plugin n'a pas de méthode pour changer de page. Chaque carte est donc un vrai
lien en `target="_top"` : cliquer recharge Grist sur la page visée.

Aucune adresse n'est écrite dans le code. Le widget la construit à l'exécution :

1. l'adresse du document vient du jeton d'accès (`grist.docApi.getAccessToken`) ;
2. la liste des pages vient des tables `_grist_Pages` et `_grist_Views` ;
3. la page visée par chaque carte vient des options du widget.

Tant que personne n'a rien configuré, les cartes visent les pages nommées
`Dashboard` et `Page publique`. Une copie fraîche du document fonctionne donc
sans réglage. Pour changer de cible, ouvrir la configuration du widget (bouton
« Ouvrir la configuration » du panneau de droite) et choisir une page dans chaque
liste. Le widget enregistre le numéro de la page, qui survit aux renommages, et
son nom, qui sert de repli si la page est supprimée puis recréée.

Les options sont stockées dans le document, avec le widget : rien ne transite
par ce dépôt.

## Installation dans Grist

1. Ajouter à une page un widget personnalisé, sur n'importe quelle table.
2. Renseigner l'URL du widget (GitHub Pages, ou le serveur local ci-dessous).
3. Accorder l'**accès complet** : c'est le seul niveau qui permet de lire la
   liste des pages du document. Le widget n'écrit rien dans les tables.

URL GitHub Pages, une fois le dépôt publié :

```text
https://<compte>.github.io/<depot>/page-accueil.html
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

La page charge la feuille et l'autoloader du design system, avec le thème
`outil-agent` du tableau de bord. Règles suivies :

- vérifier les noms de classes dans la feuille livrée par le CDN, jamais dans
  les pages de composants, qui ne portent pas toujours les mêmes noms ;
- ne jamais reprendre un de ses noms de classe : les nôtres portent toutes le
  préfixe `home-`. L'inventaire de ses classes est gardé dans
  `test/design-system-classes.txt` ; la commande pour le régénérer est en tête
  de `test/styles.test.js` ;
- ne pas colorer un texte posé sur un fond de couleur : les cartes restent sur
  fond blanc, y compris au survol ;
- contrastes mesurés sur les couleurs calculées par le navigateur : le plus
  faible pour du texte est celui du titre d'une carte, 5,8:1.
