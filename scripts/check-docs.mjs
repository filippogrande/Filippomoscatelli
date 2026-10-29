/**
 * check-docs.mjs — la documentazione non puo' derivare dal codice.
 *
 * Perche' esiste: i doc citano file, comandi e pezzi di infrastruttura. Quando
 * una cosa viene rimossa (una cartella, uno script, un target) le righe che la
 * citano restano, continuano a sembrare vere, e chi legge la mappa perde tempo
 * dietro a file che non esistono.
 *
 * Tre controlli, tutti deterministici:
 *   1. un percorso in backtick che non esiste nel repo;
 *   2. un target `make <x>` che non esiste nel Makefile;
 *   3. un termine della vecchia infrastruttura rimossa.
 *
 * In CI ogni problema diventa un'annotazione (`::error file=...,line=...`): i log
 * dei job non sono pubblici, le annotazioni si', quindi il rosso e' diagnosticabile
 * anche senza accesso al repository.
 *
 * Uso: node scripts/check-docs.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const DOC_FILES = [
  'README.md',
  'AGENTS.md',
  'docs/REFERENCE.md',
  'docs/ARCHITECTURE.md',
  'docs/OPERATIONS.md',
  'docs/CONVENTIONS.md',
];

// Token che sembrano percorsi ma non lo sono. Ognuno deve avere il motivo accanto:
// la lista e' l'unico posto dove un'eccezione e' ammessa.
const ALLOWED_PATHS = new Map([
  ['version.txt', 'lo crea il Dockerfile copiando VERSION, non sta nel repo'],
  ['linux/amd64', 'piattaforma Docker, non un percorso'],
  ['linux/arm64', 'piattaforma Docker, non un percorso'],
  ['filippogrande/cv-website', 'nome dell\'immagine Docker, non un percorso'],
]);

// Ogni voce e' un pezzo di infrastruttura che non esiste piu'. Se un doc deve
// citarne uno per motivi storici, si aggiunge qui con la ragione accanto: meglio
// un'eccezione scritta che un controllo spento.
const FORBIDDEN = [
  [/\bkubernetes\b/i, 'la produzione e\' un container sul master, non un cluster'],
  [/\bk8s\b/i, 'cartella e manifest rimossi dal repo'],
  [/\bkubectl\b/i, 'nessun cluster da pilotare'],
  [/\bdeploy\.sh\b/, 'script rimosso (la CI pubblica, il master fa il pull)'],
  [/\bmake (deploy|deploy-build|prod|status|rollback|k8s-cleanup)\b/, 'target rimosso dal Makefile'],
  [/\bstyles\.css\b/, 'foglio inesistente: i moduli sono in css/'],
  [/\bjs\/language\.js\b/, 'il modulo vivo e\' js/language.v2.js'],
];

function inlineCode(line) {
  return [...line.matchAll(/`([^`\n]+)`/g)].map((match) => match[1]);
}

/**
 * Un percorso verificabile e' un token con una directory **e** un'estensione (o la
 * barra finale, se e' una cartella). Senza questa seconda condizione passano per
 * percorsi i nomi di branch (`docs/repo-navigation-map`) e le piattaforme Docker,
 * che sono prosa.
 */
function isPathToken(token) {
  if (!/^[\w.@/-]+$/.test(token)) return false;
  if (!token.includes('/')) return false;
  if (token.startsWith('/') || token.includes('://')) return false;
  if (token.endsWith('/')) return true;
  return /\.[a-z0-9]{1,5}$/i.test(token);
}

function pathExists(token) {
  const clean = token.replace(/\/+$/, '');
  if (ALLOWED_PATHS.has(clean)) return true;
  return existsSync(join(root, clean));
}

function readMakeTargets() {
  const makefile = readFileSync(join(root, 'Makefile'), 'utf8');
  return new Set([...makefile.matchAll(/^([a-zA-Z0-9_-]+):/gm)].map((match) => match[1]));
}

function checkFile(file, targets) {
  const lines = readFileSync(join(root, file), 'utf8').split('\n');
  const found = [];

  lines.forEach((line, index) => {
    const report = (message) => found.push({ file, line: index + 1, message });

    for (const [pattern, reason] of FORBIDDEN) {
      if (pattern.test(line)) report(`termine obsoleto — ${reason}`);
    }

    for (const token of inlineCode(line)) {
      if (isPathToken(token) && !pathExists(token)) report(`percorso inesistente: ${token}`);
    }

    for (const [, target] of line.matchAll(/\bmake ([a-z][a-z0-9-]*)/g)) {
      if (!targets.has(target)) report(`target inesistente nel Makefile: make ${target}`);
    }
  });

  return found;
}

const targets = readMakeTargets();
const problems = DOC_FILES.flatMap((file) => checkFile(file, targets));

if (problems.length > 0) {
  console.error(`❌ doc non allineati alla realta' (${problems.length}):`);
  for (const problem of problems) {
    console.error(`   ${problem.file}:${problem.line}  ${problem.message}`);
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::error file=${problem.file},line=${problem.line}::${problem.message}`);
    }
  }
  console.error('Correggi la riga: un doc che mente e\' peggio di nessun doc.');
  process.exit(1);
}

console.log(`✅ doc allineati: ${DOC_FILES.length} file, nessun riferimento rotto.`);
