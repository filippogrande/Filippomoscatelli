# CV di Filippo Moscatelli — repo `Filippomoscatelli`

<!-- Radice della mappa: leggi QUESTO file per primo, sempre. -->
<!-- Tutto cio' che non serve ad OGNI task e' a un link di distanza. -->

Sito statico single-page con il curriculum di Filippo Moscatelli (IT/EN), servito da
nginx dentro un container Docker. Non c'e' backend e non c'e' build: i contenuti che
cambiano (progetti, esperienze) sono file JSON in `data/` che il browser legge con `fetch`.

- Stack: HTML/CSS/JavaScript vanilla, nginx, Docker. Niente build del sito: l'unico
  `package.json` e' in `scripts/` e serve solo a generare i PDF.
- Rilascio: `VERSION` (SemVer) + tag `vX.Y.Z` + deployment `production` sulla pagina
  Deployments. L'immagine la pubblica la CI su Docker Hub; sul master si aggiorna con
  `docker compose pull`.
- Mappa del codice: `docs/REFERENCE.md`

## Comandi

| Azione | Comando |
|---|---|
| Avvia in locale | `make dev` |
| Build dell'immagine da GitHub | `make build-github` |
| Rigenera i PDF del CV | `make pdf` |
| Test del container | `make test-full` |
| Verifica che i doc siano allineati | `node scripts/check-docs.mjs` |
| Tutti i target | `make help` |

## Indice — richiesta -> dove

| Vuoi... | Apri |
|---|---|
| Trovare un file o un simbolo | `docs/REFERENCE.md` |
| Capire come funziona il sito o il deploy | `docs/ARCHITECTURE.md` |
| Buildare, testare, rilasciare, cambiare i contenuti | `docs/OPERATIONS.md` |
| Conoscere le regole prima di toccare il repo | `docs/CONVENTIONS.md` |

## Documenti

| Doc | Tipo | A cosa serve |
|---|---|---|
| `docs/REFERENCE.md` | reference | la mappa: richiesta -> file -> entry point |
| `docs/ARCHITECTURE.md` | explanation | moduli, eventi, build dell'immagine, generazione PDF |
| `docs/OPERATIONS.md` | how-to | build, test, rilascio, contenuti |
| `docs/CONVENTIONS.md` | how-to | regole di codice e di repo |

## Regole

- Branch + PR, mai push su `main`.
- I doc si aggiornano NELLA STESSA PR che sposta, rinomina o rimuove qualcosa.
- Limiti: 50 righe/funzione, 500 righe/file, niente fallback silenziosi.
- In root solo: `README.md`, `AGENTS.md`, manifest, `Dockerfile`/`docker-compose.yml`, cartelle.
- Mappa onesta: una riga che indica un file o un simbolo sbagliato si corregge subito, non si
  annota. Il job `docs` della CI lo verifica a ogni PR (`scripts/check-docs.mjs`): percorso
  inesistente, target `make` inesistente o pezzo di infrastruttura rimossa = PR rossa.
