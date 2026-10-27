# CV di Filippo Moscatelli

Sito statico single-page con il curriculum (IT/EN), servito da nginx dentro un container Docker
e deployato su Kubernetes. Non c'e' backend e non c'e' build: i contenuti che cambiano
(progetti, esperienze) sono file JSON in `data/` che il browser legge con `fetch`.

- HTML/CSS/JavaScript vanilla: niente `package.json`, niente npm
- Lingue italiano/inglese, con rilevamento da URL (`/it`, `/en`), dal browser e da `localStorage`
- Analytics Umami self-hosted
- Immagine `filippogrande/cv-website:latest` (multi-platform), health check su `/health`
- Pagina dedicata al progetto Food Delivery in `FoodDelivery/`
- CV scaricabile in PDF: `filippomoscatelli_it.pdf`, `filippomoscatelli_en.pdf`

## Avvio

```bash
make dev          # build dell'immagine + docker-compose up -d
# sito su http://localhost:8080

make logs          # log del container
make stop
```

Alternative:

```bash
make build-github                                              # build multi-platform da GitHub
docker run -d -p 8080:80 filippogrande/cv-website:latest         # immagine gia' pubblicata
kubectl apply -f k8s/                                          # deploy su Kubernetes
```

## Struttura

```
index.html                 pagina unica (sezioni del CV)
AGENTS.md                  radice della mappa: leggilo per primo
css/                       fogli di stile (caricati da js/css-manager.js)
js/                        moduli: main, config, language, projects, work, analytics, ...
data/                      contenuti in JSON (progetti, esperienze; IT ed EN)
k8s/                       manifest Kubernetes
FoodDelivery/              pagina del progetto Food Delivery (+ screenshot)
filippomoscatelli_it.pdf   CV scaricabile (italiano)
filippomoscatelli_en.pdf   CV scaricabile (inglese)
Dockerfile, Dockerfile.multistage, nginx.conf, docker-compose.yml
Makefile, deploy.sh, build-from-github.sh, test-deployment.sh
.github/                   workflow CI (html-validate+ESLint), deploy, dependabot
```

## Indice

| Vuoi... | Apri |
|---|---|
| Trovare un file o un simbolo | `docs/REFERENCE.md` |
| Capire come funziona il sito o il deploy | `docs/ARCHITECTURE.md` |
| Buildare, testare, deployare, cambiare i contenuti | `docs/OPERATIONS.md` |
| Conoscere le regole prima di toccare il repo | `docs/CONVENTIONS.md` |
| Sapere da dove partire | `AGENTS.md` |

## Documentazione

Quattro doc in `docs/`, uno per tipo: `REFERENCE.md` (la mappa richiesta -> file -> simbolo),
`ARCHITECTURE.md` (come funziona), `OPERATIONS.md` (i passi), `CONVENTIONS.md` (le regole).
La mappa si aggiorna nella stessa PR che sposta o rinomina qualcosa.

## Supporto

- Sito: https://filippomoscatelli.com
- Repository: https://github.com/filippogrande/Filippomoscatelli
- Immagine: https://hub.docker.com/r/filippogrande/cv-website

Licenza: MIT.
