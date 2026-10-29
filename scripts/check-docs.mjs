/**
 * check-docs.mjs — la documentazione non puo' derivare dal codice.
 *
 * Perche' esiste: i doc citano file, comandi e pezzi di infrastruttura. Quando
 * una cosa viene rimossa (una cartella, uno script, un target) le righe che la
 * citano restano, continuano a sembrare vere, e chi legge la mappa perde tempo
 * dietro a file che non esistono. E' successo con la cartella dei manifest del
 * cluster e con lo script di deploy.
 *
 * Tre controlli, tutti deterministici:
 *   1. un percorso in backtick che non esiste nel repo;
 *   2. un target `make <x>` che non esiste nel Makefile;
 *   3. un termine della vecchia infrastruttura rimossa.
 *
 * Uso: node scripts/check-docs.mjs   (stesso comando del job `docs` della CI)
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

// File che non stanno nel repo: li crea la build. Non sono errori.
const ALLOWED_PATHS = new Set(['version.txt']);

// La lista dei termini vietati: ognuno e' un pezzo di infrastruttura che non
// esiste piu'. Se un doc deve citarne uno per motivi storici, si aggiunge qui
// sotto con la ragione — meglio un'eccezione scritta che un controllo spento.
const FORBIDDEN = [
  [/\bkubernetes\b/i, 'la produzione e\' un container sul master, non un cluster'],
  [/\bk8s\b/i, 'cartella e manifest rimossi dal repo'],
  [/\bkubectl\b/i, 'nessun cluster da pilotare'],
  [/\bdeploy\.sh\b/, 'script rimosso (la CI pubblica, il master fa il pull)'],
  [/\bmake (deploy|deploy-build|prod|status|rollback|k8s-cleanup)\b/, 'target rimosso dal Makefile'],
  [/\bstyles\.css\b/, 'foglio inesistente: i moduli sono in css/'],
  [/\bjs\/language\.js\b/, 'il modulo vivo e\' js/language.v2.js'],
];

const WITH_EXTENSION = /\.(md|json|js|mjs|css|html|yml|yaml|sh|pdf|png|svg|txt|conf)$/;

function inlineCode(line) {
  return [...line.matchAll(/`([^`\n]+)`/g)].map((match) => match[1]);
}

/**
 * Solo i percorsi con una directory: un nome di file nudo (`main.css`) e' spesso
 * citato in prosa e verificarlo produrrebbe solo falsi positivi.
 */
function isPathToken(token) {
  if (!/^[\w.@/-]+$/.test(token)) return false;
  if (!token.includes('/')) return false;
  if (token.startsWith('/') || token.includes('://')) return false;
  return true;
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
    const where = `${file}:${index + 1}`;

    for (const [pattern, reason] of FORBIDDEN) {
      if (pattern.test(line)) found.push(`${where}  termine obsoleto — ${reason}`);
    }

    for (const token of inlineCode(line)) {
      if (isPathToken(token) && !pathExists(token)) {
        found.push(`${where}  percorso inesistente: ${token}`);
      }
    }

    for (const [, target] of line.matchAll(/\bmake ([a-z][a-z0-9-]*)/g)) {
      if (!targets.has(target)) found.push(`${where}  target inesistente nel Makefile: make ${target}`);
    }
  });

  return found;
}

const targets = readMakeTargets();
const problems = DOC_FILES.flatMap((file) => checkFile(file, targets));

if (problems.length > 0) {
  console.error(`❌ doc non allineati alla realta' (${problems.length}):`);
  for (const problem of problems) console.error(`   ${problem}`);
  console.error('\nCorreggi la riga: un doc che mente e\' peggio di nessun doc.');
  process.exit(1);
}

console.log(`✅ doc allineati: ${DOC_FILES.length} file, nessun riferimento rotto.`);
