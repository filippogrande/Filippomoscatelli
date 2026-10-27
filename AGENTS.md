# CV di Filippo Moscatelli — repo `Filippomoscatelli`

<!-- Radice della mappa: leggi QUESTO file per primo, sempre. -->
<!-- Tutto cio' che non serve ad OGNI task e' a un link di distanza. -->

Sito statico single-page con il curriculum di Filippo Moscatelli (IT/EN), servito da
nginx dentro un container e deployato su Kubernetes. Non c'e' backend e non c'e' build:
i contenuti che cambiano (progetti, esperienze) sono file JSON in `data/` che il browser
legge con `fetch`.

- Stack: HTML/CSS/JavaScript vanilla, nginx, Docker; niente `package.json`, niente npm
- Deploy: immagine `filippogrande/cv-website:latest` (buildata da GitHub Actions), manifest in `k8s/`
- Mappa del codice: `docs/REFERENCE.md`

## Comandi

| Azione | Comando |
|---|---|
| Avvia in locale | `make dev` |
| Build dell'immagine da GitHub | `make build-github` |
| Test del container | `make test-full` |
| Deploy su Kubernetes | `make deploy` |
| Stato / rollback | `make status` / `make rollback` |
| Tutti i target | `make help` |

## Indice — richiesta -> dove

| Vuoi... | Apri |
|---|---|
| Trovare un file o un simbolo | `docs/REFERENCE.md` |
| Capire come funziona il sito o il deploy | `docs/ARCHITECTURE.md` |
| Buildare, testare, deployare, cambiare i contenuti | `docs/OPERATIONS.md` |
| Conoscere le regole prima di toccare il repo | `docs/CONVENTIONS.md` |

## Documenti

| Doc | Tipo | A cosa serve |
|---|---|---|
| `docs/REFERENCE.md` | reference | la mappa: richiesta -> file -> entry point |
| `docs/ARCHITECTURE.md` | explanation | moduli, eventi, i due script di build, i due Dockerfile |
| `docs/OPERATIONS.md` | how-to | build, test, deploy, contenuti |
| `docs/CONVENTIONS.md` | how-to | regole di codice e di repo |

## Regole

- Branch + PR, mai push su `main`.
- I doc si aggiornano NELLA STESSA PR che sposta, rinomina o rimuove qualcosa.
- Limiti: 50 righe/funzione, 500 righe/file, niente fallback silenziosi.
- In root solo: `README.md`, `AGENTS.md`, manifest, `Dockerfile`/`docker-compose.yml`, cartelle.
- Mappa onesta: una riga che indica un file o un simbolo sbagliato si corregge subito, non si annota.
