"use strict";

// Les fichiers assembles a la racine sont versionnes et servis tels quels par
// GitHub Pages : aucune CI ne les reconstruit. Oublier `npm run build` avant de
// commiter livrerait donc du code source a jour et un widget perime. Ce test
// refait l'assemblage en memoire et le compare a ce qui est sur le disque.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const STYLE_TAG = /<link rel="stylesheet" href="style\.css">/;
const SCRIPT_TAG = /<script src="script\.js"><\/script>/;

function assemble(widget) {
  const dir = path.join(SRC, widget);
  const template = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(dir, "style.css"), "utf8").trimEnd();
  const js = fs.readFileSync(path.join(dir, "script.js"), "utf8").trimEnd();
  return template
    .replace(STYLE_TAG, `<style>\n${css}\n</style>`)
    .replace(SCRIPT_TAG, `<script>\n${js}\n</script>`);
}

const widgets = fs.readdirSync(SRC).filter((name) => fs.statSync(path.join(SRC, name)).isDirectory());

test("des widgets sont bien presents dans src/", () => {
  assert.ok(widgets.length > 0);
});

for (const widget of widgets) {
  test(`${widget}.html est a jour par rapport a ses sources`, () => {
    const built = fs.readFileSync(path.join(ROOT, `${widget}.html`), "utf8");
    assert.equal(built, assemble(widget), `lancer \`npm run build\` puis commiter ${widget}.html`);
  });
}

// build.js copie les photos du widget a cote de la page : si la copie manque ou
// est perimee, l'image ne s'affiche pas en ligne.
for (const widget of widgets) {
  const photos = fs.readdirSync(path.join(SRC, widget)).filter((name) => name.endsWith(".jpg"));
  for (const photo of photos) {
    test(`${photo} est publiee a cote de ${widget}.html, identique a la source`, () => {
      const copie = path.join(ROOT, photo);
      assert.ok(fs.existsSync(copie), `lancer \`npm run build\` : ${photo} absente de la racine`);
      assert.ok(
        fs.readFileSync(copie).equals(fs.readFileSync(path.join(SRC, widget, photo))),
        `lancer \`npm run build\` : ${photo} differe de la source`);
    });
  }
}
