# OPERATIONS — passi per un obiettivo

<!-- Tipo: HOW-TO. I passi, non le ragioni (quelle sono in ARCHITECTURE.md). -->

## Prerequisiti

- Docker e git
- `make` (i comandi principali sono target del `Makefile`)
- Per la CI: i secrets `DOCKER_USERNAME` e `DOCKER_PASSWORD` nel repository
- Per i PDF in locale: Node 20+ e Chrome/Chromium installati

## Avvio locale

```bash
make dev           # build dell'immagine + docker-compose up -d
# sito su http://localhost:8080

make logs          # log del container
make stop          # docker-compose down
```

Alternative senza `make`:

```bash
docker run -d -p 8080:80 --name cv-test filippogrande/cv-website:latest
curl -f http://localhost:8080/health     # deve rispondere "healthy"

# Build locale
docker build -t filippogrande/cv-website:latest .
```

## Build

| Comando | Cosa fa |
|---|---|
| `make build` | build locale single-platform dal build context |
| `make build-github` | `./build-from-github.sh` — buildx multi-platform da GitHub, niente clone locale |
| `make push` | buildx multi-platform con `--push` su Docker Hub |
| `make pdf` | rigenera `filippomoscatelli_it.pdf` e `_en.pdf` da `print-cv.html` |

`./build-from-github.sh <tag>` accetta un tag come primo argomento (default `latest`).

## Test

| Comando | Cosa verifica |
|---|---|
| `make test` | solo `curl /health` su `localhost:8080` (stampa l'esito, non esce in errore) |
| `make test-full` | `test-deployment.sh`: avvia il container su una porta libera (8081) e verifica `/health`, `/`, `css/main.css`, `js/main.js`, content-type HTML, gzip e i header `X-Frame-Options` / `X-Content-Type-Options`; rimuove il container alla fine |

`test-deployment.sh` esce in errore se Docker non e' in esecuzione o se l'immagine
`filippogrande/cv-website:latest` non esiste in locale: in quel caso buildarla prima con
`make build-github`.

La CI fa il suo smoke test a ogni giro: su PR build + `docker run` + `curl /health`;
su `main` anche build multi-platform, push e scan Trivy.

## Generare i PDF del CV

I PDF non si sostituiscono a mano: si generano dalla pagina `print-cv.html`.

```bash
make pdf
```

Cosa succede: `scripts/generate-pdfs.mjs` avvia un server statico sulla root del repo,
apre `print-cv.html?lang=it` e `?lang=en` in Chrome headless, attende `window.PRINT_READY`
e scrive `filippomoscatelli_it.pdf` / `filippomoscatelli_en.pdf` in root.

- Richiede Node 20+ e Chrome/Chromium. Se il browser non e' in un percorso standard,
  indicarlo con `CHROME_PATH=/percorso/chrome make pdf`.
- **In CI e' automatico**: il job `build` di `.github/workflows/deploy.yml` lancia
  `Generate CV PDFs` prima della build Docker, quindi l'immagine pubblicata contiene
  sempre i PDF aggiornati. Non serve committare i PDF a mano dopo una modifica ai contenuti.
- Se buildi da GitHub (`make build-github`) senza passare dalla CI, lancia prima `make pdf`:
  quella build non rigenera i PDF.
- Verifica rapida dell'output: apri il PDF e controlla che stia in una pagina A4 piena
  (il renderer scende di scala fino al 94%; se non basta, la build fallisce).

## Deploy in produzione

La CI pubblica l'immagine su Docker Hub, ma **non tocca il sito**: il passaggio sul master e'
manuale. Il compose di produzione sta fuori dal repo.

```bash
cd /mnt/applicazioni/yml/docker/filippomoscatelli
docker compose pull
docker compose up -d
```

Verifica che giri la versione attesa (il file e' copiato dalla build, non e' il tag):

```bash
curl -s "https://filippomoscatelli.com/version.txt?t=$(date +%s)"
```

Per chiudere il deployment `production` sulla pagina GitHub (resta `pending` di proposito),
lancia il workflow **Confirm production deploy** con la versione. Attenzione: quel workflow
controlla solo che il deployment esista, **non** che il sito serva quella versione — la prova
vera e' `version.txt`.

## Trigger manuale del workflow

Su **Actions** > *Build and Deploy CV Website* > **Run workflow**.

## Cambiare i contenuti

- **Progetto**: aggiungere una voce a `data/projects.json` (e `data/projects.en.json`).
  Campi: `title`, `description`, `tech` (array), `startDate` / `endDate` (`YYYY-MM` o `YYYY`),
  e come link un array `links` (`label` + `url`) oppure il singolo campo `link`.
- **Esperienza lavorativa**: aggiungere una voce a `data/work.json` (e `data/work.en.json`).
  Campi: `company`, `role`, `startDate`, `endDate`, `location`, `modality`, `description`,
  `tech`. La durata accanto alle date viene calcolata, non va scritta.
- **Testi della pagina**: aggiungere la chiave in `translations` (`js/language.v2.js`) per
  entrambe le lingue e mettere lo stesso valore in un attributo `data-key` in `index.html`.
- **Periodi in `index.html`**: per avere la durata calcolata basta aggiungere
  `data-period-start` (e `data-period-end`), come gia' fatto per il volontariato.
- **Colori e misure**: i colori sono valori letterali nei fogli in `css/`; la dimensione di
  tutto il layout dipende da `--ui-root` in `css/scale.css`. Non esiste `styles.css`.
- **Pagina Food Delivery**: modificare `FoodDelivery/index.html`; usa `data-lang-it` e
  `data-lang-en`, non `data-key`.
- **PDF del CV**: non si toccano a mano. Dopo una modifica a contenuti o traduzioni lancia
  `make pdf` (o lascia fare alla CI). Vedi "Generare i PDF del CV".

## Aggiornare la documentazione

- La mappa e' `docs/REFERENCE.md`: una riga per richiesta, niente numeri di riga, niente
  elenchi di directory.
- Se sposti, rinomini o rimuovi un file o un simbolo, aggiorna la riga corrispondente
  **nella stessa PR**. Una riga che punta a un file sbagliato va corretta, non annotata.
- Prima di aprire la PR, lancia `node scripts/check-docs.mjs`: e' lo stesso controllo del job
  `docs` della CI. Fallisce se un doc cita un file inesistente, un target `make` inesistente, o
  un pezzo della vecchia infrastruttura (per esempio Kubernetes).
- I doc sono 4 tipi, dichiarati in testa al file: `reference` (fatti), `explanation`
  (come funziona), `how-to` (passi), `tutorial` (imparare facendo).
- Un solo doc per concetto: se due doc dicono la stessa cosa, si consolidano.
- File `.md` vuoti o di 0 byte: eliminati. File usa-e-getta: eliminati.

## Verifiche rapide

```bash
curl -f http://localhost:8080/health
docker ps --filter name=filippomoscatelli-cv-local
curl -s "https://filippomoscatelli.com/version.txt?t=$(date +%s)"
```
