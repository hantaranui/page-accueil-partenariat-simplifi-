
# Projet : Page d'accueil « Partenariat simplifié » (widget Grist, France Travail)

## Objectif

Page d'aiguillage du document Grist « Partenariat Simplifié » de France Travail. Elle affiche aujourd'hui un bandeau (logos France Travail et « Les clubs sportifs engagés », titre), un texte d'accueil et des cartes qui ouvrent les pages « Dashboard » et « Page publique ».
Pour les équipes France Travail connectées au document (propriétaires et utilisateurs à accès partiel).

Ce widget fait partie d'un ensemble (dépôts page-accueil-partenariat-simplifi-, grist-qpv-widget, Soutien_actions_widget-Grist, et d'autres à venir) qui partagent le même document Grist. Renommer une table ou une colonne peut casser plusieurs widgets. Modèle de données de référence : dépôt model-de-donnees-aucarre.

## Technologies

- HTML, CSS et JavaScript sans framework, dans le navigateur, avec l'API de widget de Grist.
- Tests : lanceur de tests de Node. Aucune dépendance npm. Docker : non.
- Design system France Travail, chargé par CDN (feuille de style et autoloader).
- Aucune dépendance, aucun framework, aucun outil de build sans mon accord : le proposer avec avantages, risques et effort.

## Fichiers

- src/page-accueil/index.html, style.css, script.js : les sources. On ne modifie que celles-ci.
- build.js : assemble src/page-accueil/ en page-accueil.html, à la racine.
- page-accueil.html : fichier généré, le seul chargé par Grist. Ne jamais le modifier à la main.
- test/ : les tests. test/helpers/widget.js évalue script.js dans un bac à sable vm, avec des doublures du DOM et de l'API Grist. test/design-system-classes.txt : inventaire des classes du design system (la commande pour le régénérer est en tête de test/styles.test.js).
- README.md : documentation du widget. REVIEW_LOG.md : journal des relectures. docs/backlog.md : backlog.

## Commandes

- Construire le fichier final : npm run build (obligatoire après tout changement dans src/)
- Lancer les tests : npm test (un test vérifie que page-accueil.html est à jour : il échoue si le build n'a pas été refait)
- Lancer l'application en local : python3 -m http.server 8765, puis http://localhost:8765/page-accueil.html comme URL du widget dans le document Grist DEV

## Fonctionnement du widget

- Chaque carte est un vrai lien en target="_top" : l'API de widget ne sait pas changer de page.
- Aucune adresse n'est écrite dans le code. L'adresse du document vient de grist.docApi.getAccessToken, la liste des pages des tables _grist_Pages et _grist_Views, la page visée par chaque carte des options du widget.
- Le widget lit seulement _grist_Pages, _grist_Views et ses propres options. Il n'écrit dans aucune table. Niveau d'accès requis : accès complet.
- Publication : GitHub Pages, https://hantaranui.github.io/page-accueil-partenariat-simplifi-/page-accueil.html. Ce qui est fusionné dans main est en ligne pour tous les utilisateurs.

## Design system France Travail (obligatoire)

- Site : https://designsystem.francetravail.io/ — univers « Outils agent » (classe outil-agent sur body).
- Fiche de référence : docs/design-system-france-travail.md (liens, règles, et ordre des sources : pour un nom de classe ou une valeur, test/design-system-classes.txt fait foi ; le site sert à comprendre un composant).
- Utiliser uniquement ses composants et ses variables CSS. Ne jamais inventer de couleur, de police, d'espacement ni de composant. Si un composant manque : le dire et proposer le plus proche, sans le fabriquer.
- Vérifier les noms de classes dans la feuille livrée par le CDN, jamais dans les pages de documentation (elles diffèrent parfois : la documentation annonce une graisse de 400 pour les titres, la feuille applique 500).
- Nos propres classes portent toutes le préfixe home- et ne reprennent jamais un nom de classe du design system.
- Composants utilisés : Card link en variante large (ds-card-link ds-card-link-lg), état désactivé ds-card-link-disabled, illustrations « spot » dashboard.svg et handshake.svg ; titres .t1 et .t2 ; panneau de configuration avec form-label, form-control, btn btn-primary, btn btn-secondary.
- En univers agent, le titre d'une carte a la taille du texte courant (14 px) : c'est voulu, ne pas le grossir.
- Ne pas colorer un texte posé sur un fond de couleur. Respecter l'accessibilité (contrastes, titres, textes pour les lecteurs d'écran).

## Mode de travail : PAS À PAS (ne jamais changer)

- Je suis débutante en code. Explique simplement, en français.
- Un seul agent travaille à la fois : celui que j'appelle avec @.
- Un agent ne lance JAMAIS un autre agent de lui-même. Celui qui inspecte ne répare pas.
- Fais uniquement la tâche demandée. N'ajoute rien de non demandé.
- Si tu veux t'écarter de la demande ou d'un document fourni, dis-le AVANT d'agir et attends mon accord.
- N'invente jamais un nom de fichier, de classe, de table ou de colonne : vérifie-le dans le dépôt, ou dis que tu ne sais pas.
- « Tests proposés » ne veut pas dire « tests passés » : donne le résultat réellement affiché.
- À la fin de chaque tâche, ARRÊTE-TOI et termine par :
  1. Fichiers lus
  2. Fichiers modifiés ou créés
  3. Tests lancés et résultat (ou "aucun test lancé")
  4. Risques restants
- Ne fais jamais de commit ni de push : c'est moi qui les fais, sur une branche (jamais sur main). Aucun livrable généré par l'IA n'est commité sans ma relecture.

## Sécurité

- Aucun secret (mot de passe, clé, token, jeton Grist) dans le code : uniquement dans .env. Le dépôt est public.
- Ne lis pas et n'affiche pas le contenu de .env.
- Aucune donnée personnelle réelle : uniquement des données de test.
- Aucune adresse ni identifiant de document Grist écrit dans le code.

## Conventions

- Noms de fichiers et de variables en anglais, commentaires en français. Garder les noms qui existent déjà dans le dépôt : ne rien renommer sans demande.
- Textes de l'interface en français.
- Messages de commit : feat:, fix:, test:, docs:, chore:

## Pièges connus

- Pour un utilisateur à accès partiel, Grist efface le nom des pages qui portent un widget sur une table qu'il ne voit pas. Un propriétaire doit enregistrer la configuration une fois : le bouton « Enregistrer » du widget, PUIS celui que Grist affiche en haut du widget.
- page-accueil.html se régénère avec npm run build, jamais à la main.
- Les tables et colonnes Grist sont partagées entre tous les widgets du projet.

## Chantier en cours

Retrait du bandeau propre à ce widget (logos et titre). Un collègue construit un bandeau de navigation commun (titre, logo, personne connectée, menu de liens) qui sera affiché dans tous les widgets.

- Ce travail reste sur sa branche et n'est pas fusionné dans main tant que le bandeau commun n'est pas prêt.
- Le README décrit le bandeau actuel comme un écart au design system validé avec le responsable du projet : à mettre à jour avec le retrait.
- Sans le bandeau, vérifier que la page garde un titre principal (h1) pour l'accessibilité.
