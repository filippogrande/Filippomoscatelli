# CV di Filippo Moscatelli

Sito statico single-page con il curriculum (IT/EN), servito da nginx dentro un container
Docker. Non c'e' backend e non c'e' build: i contenuti che cambiano (progetti, esperienze)
sono file JSON in `data/` che il browser legge con `fetch`.

- HTML/CSS/JavaScript vanilla: nessun build step, nessun bundler
- Lingua italiano/inglese, con rilevamento da URL (`/it`, `/en`), dal browser e da `localStorage`
- Analytics Umami self-hosted
- Immagine `filippogrande/cv-website` (multi-platform), health check su `/health`
- Pagina dedicata al progetto Food Delivery in `FoodDelivery/`
- CV scaricabile in PDF: i due file sono **generati**, non caricati a mano (vedi sotto)

## Avvio

```bash
make dev           # build dell'immagine + docker-compose up -d
# sito su http://localhost:8080

make logs          # log del container
make stop
make pdf           # rigenera i due PDF del CV (richiede Node 20+ e Chrome)
```

Alternative:

```bash
make build-github                                              # build multi-platform da GitHub
docker run -d -p 8080:80 filippogrande/cv-website:pre-release  # immagine gia' pubblicata
```

Le patch finiscono su `pre-release`; `latest` si muove solo sulle X.Y.0.

## Rilascio

Il numero di versione sta nel file `VERSION` (SemVer). A ogni push su `main` il workflow
crea il tag `vX.Y.Z` e un deployment `production` in stato **pending**: l'immagine e'
pubblicata, ma il sito non e' ancora stato aggiornato. Diventa **success** quando si lancia
a mano il workflow `Confirm production deploy` con la versione, dopo aver aggiornato il
container sul master:

```bash
cd /mnt/applicazioni/yml/docker/filippomoscatelli
docker compose pull && docker compose up -d
```

Il sito espone `/version.txt` con la versione in esecuzione: e' quella la prova che il
deploy e' avvenuto, non il check verde sulla PR.

## Struttura

```
index.html                 pagina unica (sezioni del CV)
print-cv.html              pagina sorgente dei PDF (layout A4, non in navigazione)
AGENTS.md                  radice della mappa: leggilo per primo
VERSION                    versione del rilascio (SemVer)
css/                       fogli di stile (caricati da js/css-manager.js; print-cv.css solo per la stampa)
js/                        moduli: main, config, language, projects, work, analytics, print-cv, ...
data/                      contenuti in JSON (progetti, esperienze; IT ed EN)
scripts/                   generatore dei PDF (puppeteer-core, unico package.json del repo)
FoodDelivery/              pagina del progetto Food Delivery (+ screenshot)
filippomoscatelli_it.pdf   CV scaricabile (italiano, generato)
filippomoscatelli_en.pdf   CV scaricabile (inglese, generato)
Dockerfile, nginx.conf, docker-compose.yml
Makefile, build-from-github.sh, test-deployment.sh
.github/                   workflow CI (html-validate, ESLint, doc check), build/release, dependabot
```

## Indice

| Vuoi... | Apri |
|---|---|
| Trovare un file o un simbolo | `docs/REFERENCE.md` |
| Capire come funziona il sito o il deploy | `docs/ARCHITECTURE.md` |
| Buildare, testare, rilasciare, cambiare i contenuti | `docs/OPERATIONS.md` |
| Conoscere le regole prima di toccare il repo | `docs/CONVENTIONS.md` |
| Sapere da dove partire | `AGENTS.md` |

## Documentazione

Quattro doc in `docs/`, uno per tipo: `REFERENCE.md` (la mappa richiesta -> file -> simbolo),
`ARCHITECTURE.md` (come funziona), `OPERATIONS.md` (i passi), `CONVENTIONS.md` (le regole).
La mappa si aggiorna nella stessa PR che sposta o rinomina qualcosa, e la CI la verifica
(`node scripts/check-docs.mjs`).

## Supporto

- Sito: https://filippomoscatelli.com
- Repository: https://github.com/filippogrande/Filippomoscatelli
- Immagine: https://hub.docker.com/r/filippogrande/cv-website

Licenza: MIT.
