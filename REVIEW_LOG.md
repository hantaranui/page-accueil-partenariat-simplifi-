# Journal de revue — Page d'accueil Partenariat simplifié (widget Grist)

## Tâche 0 — Sprint 0 : installation de la squad d'agents

Date : 15/10/2026
Agent : aucun (installation faite à la main, guidée pas à pas)
Prompt : aucun

Note /5 :
Ce qui allait : copie depuis _squad-base sans rien écraser (cp -n) ; _squad-base non modifiée ; aucun fichier de code touché (git status).
Ce que j'ai fait corriger : CLAUDE.md rempli avec le contexte du widget ; fiche docs/design-system-france-travail.md créée ; section « Dans ce projet » ajoutée à designer-ux (avec WebFetch pour le site du design system), dev-interface (sans WebFetch : il passe par les maquettes de docs/ux/), testeur et auditeur-securite.
Tests : aucun lancé (aucun code modifié)
Commit : chore: installe la squad d'agents et le CLAUDE.md du widget (Sprint 0)

## Tâche 2 — Fiche de conception : bandeau commun sur la page d'accueil

Date : 17/10/2026
Agent : @designer-ux
Prompt : décrire le retrait de l'en-tête propre de la page d'accueil et l'ajout du bandeau commun (data-titre « Accueil »), le niveau d'accès, l'espacement et les tests à adapter

Note /5 : 5
Ce qui allait : fichiers et lignes exacts ; niveau d'accès déjà « full » vérifié dans le code ; espacement relié aux variables du design system ; test à adapter repéré ; a trouvé que la page perdrait son titre principal (h1) et a proposé un h1 sr-only du design system au lieu de décider seul
Ce que j'ai fait corriger : rien. Décision : h1 sr-only « Partenariat simplifié – Accueil » accepté ; README et guide du testeur à mettre à jour après le code
Tests : 0 lancés, 0 réussis (fiche de conception)
Fichiers modifiés : docs/ux/bandeau-commun-accueil.md (créé)
Build refait : pas nécessaire
Commit : à faire avec le code

## Tâche 3 — Bandeau commun sur la page d'accueil (code)

Date : 17/10/2026
Agent : @dev-interface
Prompt : retirer l'en-tête propre (index.html et style.css), ajouter la balise du bandeau commun (data-titre « Accueil ») et un h1 sr-only, sans toucher au texte, aux cartes, au script ni à l'espacement

Note /5 : 4
Ce qui allait : uniquement les fichiers prévus ; lignes avant / après listées ; build refait ; seul le test attendu en échec ; a signalé l'écart avec la fiche sur la place du h1
Ce que j'ai fait corriger : rien (h1 laissé avant

## Tâche 4 — Adapter le test des classes après le retrait de l'en-tête

Date : 17/10/2026
Agent : @testeur
Prompt : remplacer home-banner et home-title dans le test « la feuille declare bien des classes en tete de selecteur » par des classes qui existent encore, puis lancer tous les tests

Note /5 : [ta note]
Ce qui allait : une seule ligne modifiée (test/styles.test.js:51, home-main et home-intro) ; but du test inchangé ; a vérifié qu'aucun autre test ne dépend des anciennes classes ; résultat exact donné
Ce que j'ai fait corriger : rien. Restent : commentaire obsolète ligne 25 ; test du h1 et de la balise bandeau.js proposé par la fiche, à écrire plus tard
Tests : 18 lancés, 18 réussis
Fichiers modifiés : test/styles.test.js
Build refait : pas nécessaire (déjà à jour)
Commit : feat: remplacer l'en-tête propre par le bandeau commun

<main></main>

, choix accepté)
Tests : 18 lancés, 17 réussis (1 échec attendu : test à adapter par le testeur)
Fichiers modifiés : src/page-accueil/index.html, src/page-accueil/style.css, page-accueil.html (régénéré)
Build refait : oui
Commit : à faire après le testeur


## Tâche 5 — Nouvelle page d'accueil : sans cartes, texte et photo

Date : 19/10/2026
Agent : @dev-interface
Prompt : retirer les cartes et leur code ; phrase d'accueil en .t1 ; fond blanc et texte définis ensemble ; deux colonnes à partir de 768 px ; photo allégée à côté de page-accueil.html (build.js modifié)

Note /5 : 5
Ce qui allait : photo allégée de 3,7 Mo à 187 Ko (1200 × 800, métadonnées retirées), commande donnée ; variables vérifiées dans la feuille du design system ; script.js réduit à grist.ready ; seuls les tests attendus en échec ; aucun git add
Ce que j'ai fait corriger : rien. Photo fournie par le chef de projet (droits assurés par lui ; crédit à confirmer). Original conservé hors du dépôt. À contrôler à l'œil : qualité 50 de la photo
Tests : 6 lancés, 4 réussis (2 échecs attendus : tests des cartes, à reprendre par le testeur)
Fichiers modifiés : src/page-accueil/index.html, style.css, script.js, photo-accueil.jpg (allégée), build.js, page-accueil.html et photo-accueil.jpg (générés)
Build refait : oui
Commit : à faire après le testeur

## Tâche 6 — Tests de la nouvelle page d'accueil

Date : 19/10/2026
Agent : @testeur
Prompt : supprimer les tests des cartes, adapter le test des classes, ajouter les tests de la fiche (h1 masqué, absence de cartes, photo, accès complet, copie de la photo par le build), puis la phrase d'accueil et la balise du bandeau commun

Note /5 : 5
Ce qui allait : s'en est tenu à la fiche et a signalé les deux tests qu'elle ne listait pas ; helper gardé et adapté au minimum, avec sa raison ; risques honnêtes (la copie de la photo n'est pas prouvée venir du build)
Ce que j'ai fait corriger : ajout des tests de la phrase d'accueil et de la balise du bandeau commun
Tests : 14 lancés, 14 réussis
Fichiers modifiés : test/links.test.js (supprimé), test/helpers/widget.js, test/styles.test.js, test/build.test.js, test/page.test.js (créé)
Build refait : pas nécessaire
Commit : à faire


## Tâche 7 — Mise en scène de la zone d'accueil

Date : 19/10/2026
Agent : @dev-interface
Prompt : appliquer la section 9 de la fiche : titre display-3 sur deux lignes (seul h1), paragraphe t2, bande strip with-bg-blue avec bas en courbe, photo arrondie et deux disques, couleurs du design system

Note /5 : 5
Ce qui allait : classes du gabarit « Landing Page Template » du design system ; aucune couleur écrite en dur ; bande teintée retirable en enlevant une seule classe (commentaire dans le code) ; seuls les deux tests attendus en échec
Ce que j'ai fait corriger : rien. Bande teintée, courbe et disques validés par le chef de projet
Tests : 14 lancés, 12 réussis (2 échecs attendus : h1 et phrase d'accueil, à reprendre par le testeur)
Fichiers modifiés : src/page-accueil/index.html, src/page-accueil/style.css, page-accueil.html (généré)
Build refait : oui
Commit : à faire après le testeur


## Tâche 8 — Tests de la zone d'accueil

Date : 19/10/2026
Agent : @testeur
Prompt : adapter les tests du h1 et de la phrase d'accueil à la nouvelle zone d'accueil, compléter la liste de classes, ajouter les tests de la section 9 de la fiche

Note /5 : 5
Ce qui allait : deux tests modifiés, un complété, sept ajoutés (fiche 9.6), tous cités ; le test de la taille de la photo écrit sans dépendance ; risques honnêtes (les tests ne voient pas le rendu)
Ce que j'ai fait corriger : rien ; test n°7 conservé
Tests : 21 lancés, 21 réussis
Fichiers modifiés : test/page.test.js, test/styles.test.js
Build refait : pas nécessaire (test de fraîcheur réussi)
Commit : à faire
