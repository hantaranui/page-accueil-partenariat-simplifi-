"use strict";

// La page est statique : elle n'affiche plus que le texte d'accueil et une photo,
// et ne lit ni n'ecrit aucune table du document. Le niveau « full » est conserve
// tel quel, car le retirer est hors demande et pourrait priver le bandeau commun
// de ce dont il a besoin.
grist.ready({requiredAccess: "full"});
