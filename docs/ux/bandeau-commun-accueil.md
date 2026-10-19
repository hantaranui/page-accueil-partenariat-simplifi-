# Page d'accueil : remplacer le bandeau propre par le bandeau commun

Fiche de conception pour dev-interface. Aucun code n'est modifié par cette fiche.
Sources : src/page-accueil/, test/, feuille du CDN France Travail (variables `--ft-spacer-*`), bandeau.js version 0.3.0 (lu pour savoir où il s'insère).

## 1. L'en-tête actuel à retirer

**HTML** : [src/page-accueil/index.html](../../src/page-accueil/index.html), lignes 13 à 17.

```html
<header class="home-banner">
  <img class="home-logo" src="…Logo_France_Travail_RVB_Horizontal_Coul_Positif.svg" alt="France Travail">
  <h1 class="t1 home-title">Partenariat simplifié</h1>
  <img class="home-logo home-logo-clubs" src="…logo-lcse.svg" alt="Les clubs sportifs engagés">
</header>
```

Il contient : le logo France Travail, le titre « Partenariat simplifié » (le seul `h1` de la page) et le logo « Les clubs sportifs engagés ».

**CSS** : [src/page-accueil/style.css](../../src/page-accueil/style.css)
- lignes 12 à 20 : `.home-banner` ;
- lignes 22 à 27 : `.home-logo` ;
- lignes 29 à 36 : `.home-logo-clubs` (et son commentaire) ;
- lignes 38 à 44 : `.home-title` (et son commentaire) ;
- dans `@media (max-width: 600px)`, lignes 123 à 133 : `.home-banner`, `.home-logo`, `.home-logo-clubs`, `.home-title`. Seules les lignes `.home-main` (134), `.home-cards` (135) et `.home-config` (136) restent.

**JavaScript** : [src/page-accueil/script.js](../../src/page-accueil/script.js) ne touche pas à l'en-tête (aucun accès à `.home-banner`, `.home-logo` ni `.home-title`). Rien à changer.

## 2. Ce qui reste inchangé

- Le texte d'accueil (`h2.t2.home-intro#intro`, ligne 20 du HTML) : texte et styles identiques.
- Les deux cartes (`nav.home-cards#cards`, lignes 21 à 42) : « Accéder à la liste des actions » et « Accéder à la page publique de soutien », avec leur CSS et leur script.
- Le panneau de configuration (`#config`).

## 3. La balise du bandeau commun

À ajouter dans le `<head>`, **juste après** la balise de l'API Grist (ligne 7), exactement :

```html
<script src="https://docs.getgrist.com/grist-plugin-api.js"></script>
<script src="https://hantaranui.github.io/Bandeau_France-Travail/bandeau.js" data-titre="Accueil"></script>
```

Le bandeau s'insère tout seul comme premier élément du `<body>` (bandeau.js le fait avec `insertBefore(…, body.firstChild)`). Il est collant en haut de page (`position: sticky`) et construit dans un Shadow DOM : **notre CSS ne l'atteint pas** et il n'hérite pas de nos règles. On n'ajoute aucun conteneur ni aucune classe pour lui.

## 4. Le niveau d'accès

Aujourd'hui, [script.js:212](../../src/page-accueil/script.js#L212) appelle déjà :

```js
grist.ready({requiredAccess: "full", onEditOptions: openConfig});
```

Le niveau « full » est donc déjà demandé : **rien à changer**. Garder `onEditOptions`.

## 5. L'espacement en haut de la page

Le bandeau commun gère son propre espacement interne (hauteur minimale 6,25 rem, marge interne 1,25 rem en haut et en bas ; 4 rem et 0,75 rem sous 575 px). Le contenu de la page commence juste dessous.

Valeurs du design system, relevées dans la feuille du CDN (variables de la feuille, définies sous `:root`) :

| Usage | Valeur actuelle | Variable du design system |
|---|---|---|
| Espace au-dessus du texte d'accueil (`.home-main`, haut) | 2rem | `--ft-spacer-l1` (2rem) |
| Côtés de la page | 1.5rem | `--ft-spacer-m2` (1.5rem) |
| Mobile (≤ 600 px) : haut | 1.5rem | `--ft-spacer-m2` |
| Mobile : côtés | 1rem | `--ft-spacer-s2` |

Recommandation : **ne rien changer** à `.home-main` (`padding: 2rem 1.5rem`, puis `1.5rem 1rem` en mobile). Le bandeau commun apporte déjà son espace, et l'ancien bandeau n'ajoutait rien au-dessus du `main`. Remplacer ensuite les valeurs en dur par les variables ci-dessus n'est pas demandé et ne fait pas partie de ce chantier.

À valider : le rendu réel (espace entre le bas du bandeau et le texte d'accueil, bureau et mobile), à regarder dans le document Grist DEV une fois le bandeau chargé. L'espace de 2 rem n'a pas été vérifié visuellement avec le bandeau commun.

## 6. Le titre principal (h1) : point à décider

Le bandeau commun écrit son titre dans un `div` (classe `ft-titre`), **pas dans un titre `h1`**. Une fois l'en-tête retiré, la page n'aurait plus de `h1` : elle commencerait par le `h2` du texte d'accueil. CLAUDE.md demande de garder un titre principal.

| Option | Ce que ça change | Avis |
|---|---|---|
| A. Garder un `h1` masqué à l'écran : `<h1 class="sr-only">Partenariat simplifié</h1>` en tête de `<main>` | Le titre n'est lu que par les lecteurs d'écran. Texte et cartes inchangés. `sr-only` existe dans le design system (test/design-system-classes.txt, ligne 2628). | **Recommandée** : aucun changement visible, aucune classe inventée. |
| B. Passer le texte d'accueil de `h2` à `h1` | Change le niveau du texte d'accueil, alors que la consigne est de n'y rien changer. | Non retenue. |

Décision à confirmer par la responsable du projet avant que dev-interface code. Le texte du `h1` (« Partenariat simplifié », identique à l'actuel) est lui aussi à valider, car le bandeau affichera « Accueil » dans son titre.

## 7. Les tests

Les tests à adapter sont dans [test/styles.test.js](../../test/styles.test.js) :

- **« la feuille declare bien des classes en tete de selecteur »** (ligne 49) : vérifie que `home-banner`, `home-cards` et `home-title` sont relevées dans le CSS (ligne 51). Après le retrait, `home-banner` et `home-title` n'existent plus et le test échoue. Remplacer la liste par des classes qui restent, par exemple `home-main`, `home-cards`, `home-intro`.

Aucun autre test ne vise l'en-tête : [test/links.test.js](../../test/links.test.js), [test/build.test.js](../../test/build.test.js) et [test/helpers/widget.js](../../test/helpers/widget.js) ne mentionnent ni `home-banner`, ni logos, ni `h1`. Le test de build échouera tant que `npm run build` n'a pas été relancé.

**test/design-system-classes.txt : rien à retirer.** Ce fichier est l'inventaire complet de la feuille du CDN (2844 lignes), pas la liste des classes que nous utilisons. `t1` y reste (la classe existe toujours chez le design system), même si elle ne sert plus dans notre HTML.

Test à ajouter (à confirmer) : vérifier que `src/page-accueil/index.html` contient un `h1` et la balise `bandeau.js` avec `data-titre="Accueil"`, placée après `grist-plugin-api.js`. Aucun test ne le couvre aujourd'hui.

## 8. Autres fichiers touchés par le retrait (hors périmètre de cette fiche)

- README.md : le paragraphe sur le « bandeau » comme écart au design system (lignes 3 et 121 à 125) est à mettre à jour (rôle de documentaliste).
- docs/tests/guide-testeur.md : lignes 22, 40 et 125 décrivent le bandeau propre ; à ajuster après la fusion.
- Page publique du projet : en production, ne fusionner dans main que lorsque le bandeau commun est prêt (CLAUDE.md, « Chantier en cours »).

## Questions ouvertes

1. h1 masqué (option A) : validé ?
2. Texte du h1 : « Partenariat simplifié » ?
3. Espace sous le bandeau : à regarder dans Grist DEV, bureau et mobile.
4. Les images des deux logos viennent du CDN France Travail ; le bandeau commun les charge de son côté (adresses du document). Vérifier qu'aucun logo n'apparaît en double.
