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

## Tâche 1 — Inventaire de tout ce qui touche au bandeau

Date : 15/10/2026
Agent : @relecteur
Prompt : inventaire du bandeau et de ses logos dans tout le dépôt, lecture seule, sans solution
Note /5 :
Ce qui allait : inventaire précis avec fichiers et lignes ; rien modifié ; limites signalées. Points clés : le seul h1 est dans le bandeau ; texte d'accueil et cartes hors bandeau ; bloc @media mobile mélangé (ne pas le supprimer en entier) ; test/styles.test.js:49-54 cassera ; .t1 ne servira plus.
Ce que j'ai fait corriger : rien. Erreur relevée : il affirmait que REVIEW_LOG.md était absent, alors qu'il existe (vérifié avec ls).
Tests : aucun lancé (agent en lecture seule)
Fichiers modifiés : aucun
Build refait : pas nécessaire
Commit : aucun (inventaire seulement)


## Tâche 2 — Brouillon du carnet de tests de la page d'accueil

Date : 16/10/2026
Agent : @recetteur
Prompt : rédiger le brouillon du carnet (mission 1) dans docs/tests/carnet-accueil.md, fonctions déduites du README et du code, tests uniquement sur DEV
Note /5 :
Ce qui allait : un seul fichier créé ; 45 tests (ACC-001 à ACC-045) sur 8 fonctions identifiées ; profils et piège des noms de pages couverts ; 14 [À CONFIRMER] listés ; aucun test présenté comme réussi.
Ce que j'ai fait corriger : rien pour l'instant. À revoir : ACC-001 à ACC-003 tirés du code, difficiles à jouer depuis l'écran.
Tests : aucun lancé (agent sans commande), 45 proposés
Fichiers modifiés : docs/tests/carnet-accueil.md (créé)
Build refait : pas nécessaire (src/ non modifié)
Commit : docs: brouillon du carnet de tests de la page d'accueil
