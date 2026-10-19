# Partenariat simplifié — guide pour le testeur

16/10/2026 · Hanta

## Le projet en bref

Partenariat simplifié est un outil conçu pour France Travail. Il remplace la gestion sur Excel des **« actions d'insertion par le sport »** (des actions menées avec des clubs sportifs) par un document Grist et des widgets sur mesure.

L'outil a deux objectifs :

- **Optimisation interne** : donner aux équipes de France Travail, des agences locales jusqu'au siège national, un tableau de bord pour mieux suivre les actions, gagner du temps administratif et gérer tout au même endroit.
- **Cofinancement** : faciliter la recherche de financements externes (sponsors nationaux, entreprises locales) pour augmenter le nombre d'actions, en plus du financement de France Travail. Une page publique, inspirée des sites de financement participatif, permet de découvrir et de soutenir des actions.

Le cadre temporel est l'appel à projets « FT 2026 ». Le document Grist s'appelle « Partenariat Simplifié » et existe en deux environnements, DEV et PROD (version actuelle de DEV : DEV6).

## Les widgets à tester

Un widget est une petite application web (HTML, CSS, JavaScript) affichée dans une page du document Grist. Quatre widgets existent, un cinquième est en construction.

| Widget | Rôle | Qui l'utilise | Dépôt GitHub | État |
| --- | --- | --- | --- | --- |
| Page d'accueil | Page d'aiguillage vers le Dashboard et la Page publique | Équipes France Travail | page-accueil-partenariat-simplifi- | Réalisé ; le remplacement de son bandeau par le bandeau commun est en attente de décision |
| Dashboard « Actions d'insertion par le sport » | Tableau de bord : filtres, indicateurs, graphiques en camembert | Équipes France Travail | grist-qpv-widget | Première version [À CONFIRMER : niveau d'avancement] |
| Page publique « Les clubs sportifs engagés » | Présenter les actions et permettre de proposer un soutien financier | Visiteurs anonymes (financeurs) | Soutien_actions_widget-Grist | Réalisé |
| Bandeau de navigation France Travail | Bandeau commun affiché en haut de chaque widget | Tous | Bandeau_France-Travail | En construction (Nicolas Schena) |


Les pages de données du document (Actions, Soutiens, Cofinancements, Structures, Agences, etc.) sont des pages Grist classiques, pas des widgets. Elles servent à vérifier ce que les widgets lisent et écrivent.

## Chaque widget en détail

### Page d'accueil

Page d'aiguillage : un texte d'accueil et des cartes qui mènent vers le Dashboard et la Page publique.

- Les cartes mènent aux bonnes pages.
- Les noms de pages affichés selon le profil de l'utilisateur (voir les pièges connus).
- Il ne doit y avoir **qu'un seul bandeau** en haut de page (le bandeau propre ou le bandeau commun, selon la décision à venir).

### Dashboard « Actions d'insertion par le sport »

Tableau de bord de suivi des actions, avec des filtres (région, département, agence, type de sport [À CONFIRMER], statut), des indicateurs clés (nombre d'actions, budgets) et des graphiques en camembert.

- Les chiffres affichés correspondent à la table Actions (comparer avec la page Actions de Grist).
- Les filtres fonctionnent seuls puis combinés, et les indicateurs se mettent à jour.
- Chaque profil ne voit que son périmètre (voir la section sur les profils).
- Le cas sans résultat : l'écran reste lisible, sans erreur.


### Page publique « Les clubs sportifs engagés »

Page ouverte à un visiteur anonyme, qui découvre les actions et peut proposer un soutien financier en remplissant un formulaire (organisation, nom, prénom, email, téléphone, montant, message, action soutenue).

- Seules les actions non réalisées et non annulées sont visibles.
- Le formulaire : envoi valide, champs obligatoires vides, montant invalide, email invalide.
- Un soutien envoyé crée une ligne dans la table Soutiens ; le visiteur ne peut ni la relire ni la modifier.
- L'affichage des logos des structures (point à vérifier, voir les pièges connus).
- Faire ces tests **uniquement sur le document DEV**, avec des données fictives.

### Bandeau de navigation France Travail

En construction par Nicolas Schena. Il sera affiché en haut de chaque widget. Il sera à tester dès qu'il sera disponible, et on vérifiera alors dans chaque widget qu'un seul bandeau s'affiche.

## Les profils et leurs droits

Ce que voit un utilisateur dépend de son profil, enregistré dans la table Utilisateurs du document. **Chaque profil doit être testé avec son propre compte**, car c'est là que se cachent les anomalies les plus graves (une personne qui voit des données qui ne sont pas les siennes).

| Profil | Ce qu'il doit voir | Ce qu'il ne doit pas voir |
| --- | --- | --- |
| FT National | La plupart des tables, sur tout le territoire [À CONFIRMER : lesquelles] | — |
| FT Régional | Les lignes de sa direction régionale | Les lignes des autres régions |
| FT Départemental | Les lignes de son département | Les lignes des autres départements |
| ANS | Les lignes marquées « ANS » dans la colonne Vue | Les autres lignes |
| Visiteur anonyme (page publique) | Les actions non réalisées et non annulées, avec quelques colonnes seulement [À CONFIRMER : pour la table Actions, aucune limite de colonnes n'apparaît dans les règles d'accès ; à faire vérifier par l'auditeur sécurité] | Tout le reste. Il peut seulement créer une ligne dans Soutiens, sans la relire, la modifier ni la supprimer |

Le visiteur anonyme arrive par un lien qui contient un paramètre précis (pp = lcse-soutien) : sans ce paramètre, il n'a accès à rien.

Les utilisateurs ont aussi un rôle : Correspondant Sport ou Direction. [À CONFIRMER : les deux rôles ont-ils des droits différents ?]

## Les données

Le document Grist contient 24 tables. Les widgets s'appuient surtout sur les suivantes.

| Table | Contenu |
| --- | --- |
| Actions | Les actions d'insertion par le sport : intitulé, club, agence, dispositif, fédération, statut (A confirmer, Planifiée, Réalisée, Annulée), date, budget, public, lieu, ouverture au financement |
| Cofinancements | Les financements liés à une action : financement, montant, statut de versement (Non versé, En cours, Versé) |
| Financements, Financeurs, Périodes | Les enveloppes, les organismes qui financent et les périodes |
| Soutiens | Les propositions de soutien envoyées depuis la page publique |
| Structures | Les clubs et organismes (nom, SIRET, type, logo, nombre de licenciés…) |
| Agences, DD, DR | L'organisation territoriale de France Travail : agences locales, directions départementales, directions régionales |
| Utilisateurs | Les personnes, leur profil, leur direction et leur rôle |
| Journal des évolutions | Le suivi du chantier : chaque changement, son environnement (DEV ou PROD), son statut de livraison |

Les noms des tables et des colonnes sont écrits dans le code des widgets : **renommer une table ou une colonne peut casser un widget**. La table Actions contient une colonne « Corbeille » (case à cocher) qui sert à une suppression logique : quand on supprime une action depuis le dashboard, elle n'est pas effacée. Sa ligne reste dans la table Actions, avec toutes ses données, et la case "Corbeille" est cochée. L'action n'apparaît plus dans les widgets (Dashboard, liste des clubs, fiches des clubs, page publique), mais elle existe toujours dans la table Actions et peut être retrouvée .

## Comment tester

Le protocole complet est dans le document « Protocole de test des applications — version révisée » (docs/tests/protocole-de-test.md). L'essentiel :

- Un test = un comportement, au format **Étant donné / Quand / Alors**, avec un résultat observable et exact.
- Noter pour chaque test la **version et l'environnement** testés (DEV ou PROD), ton nom et la date.
- Statuts possibles : **OK, KO, Bloqué, Non testé, Non applicable**.
- Chaque KO devient une **anomalie** : titre court, gravité, capture d'écran, étapes pour la reproduire, résultat obtenu et résultat attendu.
- Gravité : **bloquant** (fonction essentielle inutilisable, données perdues ou exposées, droit contourné), **majeur** (fonction dégradée, contournement difficile), **mineur** (gêne sans conséquence sur le résultat).
- Prendre **15 à 30 minutes de test libre** par widget et noter ce qu'on essaie : ce qu'on y trouve enrichit le carnet.
- Tester aussi en **mode sombre** (réglage de l'ordinateur) et sur un **petit écran**.
- **Données fictives uniquement**, jamais de données personnelles réelles, et uniquement sur le document DEV.
- Tester chaque profil avec son compte de test.

Le carnet de tests de chaque widget sera placé dans le dossier docs/tests/ de son dépôt.

## Points d'attention et pièges connus

- **Noms de pages dans la Page d'accueil.** Pour un utilisateur à accès partiel, les noms de pages peuvent disparaître. Le propriétaire du document doit enregistrer la configuration du widget une fois.
- **Logos des structures.** Les structures ont une colonne Logo (pièce jointe). Le README du widget de la page publique évoque aussi une colonne facultative Logo_url, qui n'existe pas dans la version DEV5 du document. Le comportement du widget sans cette colonne reste à vérifier. Un visiteur anonyme n'obtient pas toujours le droit de télécharger un logo en pièce jointe.
- **Bandeau.** Seule la page d'accueil a son propre bandeau. Les autres widgets recevront le bandeau commun, ajouté un par un : pendant la transition, un widget peut n'avoir encore aucun bandeau.
- **Identifiants en dur.** Les identifiants du document sont écrits dans le code de la page publique, et son accès dépend du paramètre de lien pp = lcse-soutien et de colonnes précises : renommer l'une d'elles casse la page.
- **Environnements.** Toutes les campagnes de test se font sur DEV, avec des données fictives. Seule exception : après une mise en production, le chef de projet rejoue en PROD les tests de fumée qui ne créent ni ne modifient de données.

## Vocabulaire

| Terme | Sens |
| --- | --- |
| Actions d'insertion par le sport | Les actions menées avec des clubs sportifs, objet du projet |
| Cofinancement | Financement externe qui s'ajoute à celui de France Travail |
| QPV | Quartier prioritaire de la politique de la ville |
| ANCT | Agence nationale de la cohésion des territoires, source des contours des QPV |
| BAN | Base Adresse Nationale, utilisée pour retrouver une adresse |
| DR, DD | Directions régionales et directions départementales de France Travail (une DD dépend d'une DR) |
| Agence | Agence locale de France Travail, rattachée à une DD |
| ANS | Agence nationale du sport, l'un des profils utilisateurs |
| AAP | Appel à projets |
| FT 2026 | L'appel à projets France Travail 2026 |
| Osiris, Aurore | Numéros et codes internes à France Travail |
| DEV, PROD | Les deux environnements du document Grist : test et production |

## À fournir avant le test

Ces informations ne figurent pas dans ce document et doivent être complétées avant de le transmettre.

| À renseigner | Valeur |
| --- | --- |
| Lien du document Grist DEV | Document TEST |
| Version et date de la version à tester | TEST-JL 18/10/2026 |
| Compte de test FT National | [À COMPLÉTER] |
| Compte de test FT Régional (et sa direction régionale) | [À COMPLÉTER] |
| Compte de test FT Départemental (et son département) | [À COMPLÉTER] |
| Compte de test ANS | [À COMPLÉTER] |
| Lien de la page publique avec le paramètre d'accès | [À COMPLÉTER] |
| Personne à contacter en cas de blocage | Hanta |
| Où déposer les anomalies | [À COMPLÉTER] |

Ne jamais écrire de mot de passe dans ce document : les transmettre par un autre canal.
