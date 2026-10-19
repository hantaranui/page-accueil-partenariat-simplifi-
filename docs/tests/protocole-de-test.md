# Protocole de test des applications — version révisée

16/10/2026 · Hanta

## Objectif

Livrer au client des applications qui fonctionnent techniquement avant sa recette métier, et garder la trace de ce qui a été vérifié, **par qui, sur quelle version et avec quelle preuve**.

Cette version reprend la proposition de synthèse d'octobre 2026 et y ajoute cinq éléments : une définition de la « version », des niveaux de gravité précis, des preuves automatiques pour les tests en code, le rôle de l'IA et un agent dédié aux tests humains (le recetteur).

## Trois niveaux de tests

Chaque niveau a sa preuve : un test sans preuve compte comme non fait.

| Niveau | Ce qu'on vérifie | Qui | Quand | Preuve |
| --- | --- | --- | --- | --- |
| Tests en code | Le bon fonctionnement du code, automatiquement | Développeur (l'IA peut proposer, le développeur relit) | À chaque modification, et avant chaque livraison | Journal d'exécution lié au commit |
| Tests fonctionnels | Chaque fonction, depuis l'écran, selon le carnet de tests | Rédigés par le chef de projet, joués par un autre développeur | Avant chaque livraison | Statut, testeur, date, version, capture si KO |
| Recette métier | L'adéquation aux usages et préférences du client | Client | Après la première livraison | Validation écrite du client |

**Version.** Une version est une étiquette Git (par exemple v1.2.0) ou, à défaut, les 7 premiers caractères du commit, toujours accompagnée de l'environnement : DEV ou PROD.

**Environnements.** Toutes les campagnes de test se font sur DEV, avec des données fictives. Seule exception : après une mise en production, le chef de projet rejoue en PROD les tests de fumée qui ne créent ni ne modifient de données. (Règle validée par le chef de projet le 16/10/2026.)

## Qui fait quoi

| Étape | Responsable | Pourquoi |
| --- | --- | --- |
| Rédiger le carnet de tests | Chef de projet, avec le brouillon du recetteur | Il a écrit les fonctions détaillées et connaît le besoin client |
| Relire le carnet | Développeur de la fonction | Il connaît les points fragiles du code et ajoute les cas limites |
| Écrire et lancer les tests en code | Développeur de la fonction | Il connaît le comportement attendu ; l'IA propose, il relit |
| Autocontrôle | Développeur de la fonction | Éviter les allers-retours évidents |
| Valider la fonction (test croisé) | Un autre développeur | On ne voit pas ses propres erreurs |
| Choisir les tests de fumée | Chef de projet, validés par un développeur référent | Parcours critiques, droits et saisie : une dizaine de tests |
| Rejouer les tests de fumée avant livraison | Chef de projet | S'ils échouent, on ne livre pas |
| Rejouer les tests de fumée après mise en production | Chef de projet | Vérifier que la production se comporte comme l'environnement de test (seulement les tests qui ne créent ni ne modifient de données) |
| Recette métier | Client | Il valide les usages |

**Si personne n'est disponible pour le test croisé** : un collègue d'un autre projet, ou à défaut le chef de projet. Jamais l'auteur de la fonction.

## Règles de rédaction

- **Rédiger tôt**, dès la validation des fonctions détaillées : les ambiguïtés apparaissent avant d'être codées.
- **Un test, un comportement**, au format « Étant donné / Quand / Alors », avec un résultat observable et exact. Exemple : Étant donné un visiteur anonyme sur la page publique, quand il envoie le formulaire sans adresse email, alors un message d'erreur s'affiche et aucune ligne n'est créée dans la table Soutiens.
- **Six angles par fonction** : cas normal, erreurs de saisie, limites, droits par profil, conservation des données, mobile et accessibilité.
- **Une criticité par test** (bloquant, majeur, mineur), pour tester d'abord ce qui compte.
- **Un identifiant stable et deux étiquettes par test** : le module testé et les modules voisins. Les « tests voisins » sont ainsi une liste, pas une impression.
- **Toute modification d'un test est historisée** (qui, quand, pourquoi).
- **Données fictives uniquement**, jamais de données personnelles réelles (RGPD).

## Règles d'exécution

- Suivre les étapes à la lettre et noter la **version et l'environnement** testés.
- Statuts fermés : **OK, KO, Bloqué, Non testé, Non applicable**. Chaque exécution porte le **nom du testeur et la date**.
- Tester chaque profil avec son **compte de test** (par exemple FT National, Régional, Départemental, ANS, visiteur anonyme pour Partenariat simplifié).
- Chaque KO crée une **anomalie** avec sa gravité, une capture et les étapes pour la reproduire.
- Compléter par **15 à 30 minutes de test libre** par module, en notant ce qu'on essaie ; ce qu'on y trouve enrichit le carnet.
- Après une correction, rejouer le test, **ses tests voisins** (mêmes étiquettes) et **toute la suite automatique**.

## Anomalies : gravité et cycle de vie

Trois niveaux de gravité, avec un exemple chacun (à valider par l'équipe) :

| Gravité | Définition | Exemple |
| --- | --- | --- |
| Bloquant | Une fonction essentielle est inutilisable, des données sont perdues ou exposées, un droit d'accès est contourné | Un utilisateur d'un profil régional voit les lignes d'une autre région |
| Majeur | Une fonction est dégradée et le contournement est difficile | Un filtre du tableau de bord affiche des totaux faux |
| Mineur | Une gêne sans conséquence sur le résultat | Un libellé mal aligné |

Une anomalie suit quatre états :

- **Ouverte** : créée par celui qui a trouvé le problème.
- **Corrigée** : le développeur indique la version qui contient la correction.
- **Vérifiée** : on rejoue le test sur cette version.
- **Fermée** : par celui qui l'avait trouvée, jamais par celui qui l'a corrigée.

## Preuves attendues

Une case cochée ne prouve rien : la preuve d'un test en code est produite par la machine et liée à une version.

| Niveau | Preuve | Où elle est conservée |
| --- | --- | --- |
| Tests en code | Journal d'exécution automatique (GitHub Actions), lié au commit : version, nombre de tests passés sur le total, lien vers l'exécution | Ligne d'exécution dans Grist |
| Tests fonctionnels et de fumée | Statut, testeur, date, version ; capture d'écran pour chaque KO | Ligne d'exécution dans Grist |
| Recette métier | Validation écrite du client (mail ou procès-verbal) | Pièce jointe dans Grist |

**Mise en œuvre des preuves automatiques.** Un petit fichier de configuration GitHub Actions (une quinzaine de lignes) lance les tests à chaque envoi de code. Il peut aussi vérifier que le fichier généré par le build est à jour. Tant qu'il n'est pas en place, la sortie de la commande de test est enregistrée avec le numéro de commit : c'est moins solide, car elle repose sur la bonne foi.

**Une affirmation de l'IA n'est pas une preuve.** Un agent qui écrit « tests passés » ne compte pas : seul le journal d'exécution compte.

## Applications no-code (Ksaar)

Sans code, il n'y a pas de commit : la preuve d'un changement est **le constat d'une seconde personne, conservé en dehors de l'application**. Elle est moins forte qu'un journal automatique, car elle repose sur quelqu'un qui note et sur quelqu'un d'autre qui vérifie.

- **Le journal des changements vit dans Grist, pas dans Ksaar.** Si on restaure une version précédente, les modifications disparaissent de l'application mais pas du journal, qui garde la ligne avec la mention « annulée ». Une ligne par version DEV : nom de la version (identique à celui de Ksaar), date, auteur, ce qui a été créé ou modifié.
- **Captures avant et après** pour chaque changement, prises dans la version nommée, avec la date visible.
- **Revue de version.** Avant la campagne de test, une seconde personne ouvre la version DEV et vérifie chaque ligne du journal : le changement annoncé est présent, et les écrans voisins n'ont pas bougé. Elle signe (nom, date).
- **Un changement non noté est détecté par les tests**, pas par le journal : tests voisins et tests de fumée après chaque version.
- **Gel pendant la campagne** : la version testée n'est plus modifiée.
- **Passage en PROD** : la version déployée est celle qui a été testée. Le journal note le nom de la version DEV, la date du déploiement et qui l'a fait ; les tests de fumée sont rejoués en PROD ensuite.
- **Revue de configuration** à la place des tests en code : une liste de contrôle (droits par profil, formules, automatisations, champs obligatoires) relue par une seconde personne, avec nom et date.

**Question ouverte** : comment la version passe-t-elle de DEV à PROD dans Ksaar (copie, publication) ? Si Ksaar propose un historique ou un export de configuration, il remplacera la déclaration manuelle du journal.

## Règle de passage en livraison

Une livraison part **seulement si les quatre conditions sont réunies** :

- Tous les tests en code sont OK sur le commit livré, preuve à l'appui.
- Les tests de fumée sont OK.
- Aucune anomalie bloquante ou majeure n'est ouverte.
- Les anomalies mineures encore ouvertes sont listées et connues du client.

Après le déploiement en production, les tests de fumée sont rejoués (seulement ceux qui ne créent ni ne modifient de données). S'ils échouent, on revient à la version précédente.

## Outillage dans Grist

Le carnet est intégré à l'outil de suivi de projet sur Grist. La **définition** d'un test (stable) est séparée de ses **exécutions** (une ligne par campagne), ce qui garde l'historique version par version.

| Table | Contenu | Champs clés |
| --- | --- | --- |
| Tests | La définition de chaque test | Identifiant, module, modules voisins, Étant donné / Quand / Alors, angle, criticité, auteur, historique |
| Exécutions | Une ligne par test et par campagne | Test, version, environnement, statut, testeur, date, capture ou lien de preuve, anomalie liée |
| Exécutions automatiques | Une ligne par lancement des tests en code | Version, tests passés sur total, lien vers le journal |
| Anomalies | Les problèmes trouvés | Gravité, étapes pour reproduire, capture, état, trouvée par, corrigée dans la version |
| Bibliothèque de tests types | Tests réutilisables d'un projet à l'autre | Formulaires, listes et filtres, droits par profil, imports, accessibilité |

## Rôle de l'IA et de l'agent recetteur

L'IA aide à préparer et à guider les tests, mais **un humain décide toujours du résultat**.

| Agent | Ce qu'il fait | Ce qu'il ne fait pas |
| --- | --- | --- |
| Testeur | Lance les tests en code et rapporte le journal d'exécution | Il ne remplace pas la preuve : le journal fait foi |
| Recetteur | Rédige le brouillon du carnet (six angles, criticité, Étant donné / Quand / Alors), propose les tests de fumée, guide le testeur étape par étape, met en forme les anomalies | Il ne coche jamais un test comme réussi, et il n'écrit que dans le dossier des tests, jamais dans le code |

Les tests rédigés par une IA sont toujours relus par un humain avant d'entrer dans le carnet.

## Ce que l'entreprise y gagne

- **Rentabilité** : moins d'allers-retours en recette, des corrections moins chères car détectées plus tôt.
- **Satisfaction client** : le client teste le métier, pas les bugs.
- **Compétences** : le test croisé forme les développeurs en insertion à une compétence valorisable.
- **Conformité** : RGPD et accessibilité (RGAA) deviennent vérifiables à chaque livraison, avec une preuve conservée.
- **Traçabilité** : on sait pour chaque livraison qui a vérifié quoi, sur quelle version et avec quel résultat.

## Prochaines étapes

- [ ] Valider ce protocole avec l'équipe et le chef de projet.
- [ ] Faire valider les définitions de gravité (bloquant, majeur, mineur).
- [ ] Choisir le mode de preuve des tests en code : GitHub Actions ou sortie enregistrée.
- [ ] Créer les tables de test dans l'outil de suivi Grist.
- [ ] Installer l'agent recetteur dans un premier projet.
- [ ] Tester le protocole sur le prochain projet, l'ajuster après la première campagne, puis constituer la bibliothèque de tests types.
