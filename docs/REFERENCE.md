# REFERENCE — mappa del repo

<!-- Tipo: REFERENCE. Fatti, neutro, completo. Una riga per richiesta. -->
<!-- MAI numeri di riga: le righe si muovono, i simboli no. -->
<!-- MAI elenco di directory: la struttura che conta e' quella della mappa. -->
<!-- Ogni riga punta a un file reale e a un simbolo reale: se e' sbagliata, si corregge subito
     (la CI lo verifica con `scripts/check-docs.mjs`). -->

Repo: sito statico del CV. **Come si usa**: leggi `AGENTS.md`, trova la riga che
risponde alla tua domanda, apri il file e cerca il simbolo. Tre letture, non di piu'.

## La mappa

| Richiesta | File | Entry point |
|---|---|---|
| Dove parte la pagina e quali script vengono caricati | `index.html` | i tag `<script src="js/...">` in coda a `<body>` |
| Dove sono le sezioni del CV (about, competenze, progetti, lavoro, istruzione, volontariato, lingue) | `index.html` | `<section class="section">` con attributo `data-key` |
| Come si aggiunge una sezione alla pagina | `index.html` | `<main class="main">` + `css/sections.css` (`.section-title`) |
| Dove vive il link "Scarica CV" e come cambia PDF per lingua | `index.html` | `#cv-download` e la funzione `updateCVLink()` |
| Chi coordina l'avvio di tutti i moduli | `js/main.js` | `AppManager.registerAvailableModules()` |
| In che ordine partono i moduli | `js/main.js` | `AppManager.initializeModules()` |
| Chi carica i fogli di stile | `js/css-manager.js` | `CSSManager.loadStylesheet()` (inserisce il solo `main.css`) |
| Quali fogli CSS esistono e in che ordine | `css/main.css` | catena di `@import` |
| Dove sta la scala tipografica (dimensione di TUTTO il layout) | `css/scale.css` | `:root { --ui-root }` e `html { font-size }` |
| Perche' su desktop una regola non si applica | `css/responsive.css` | media query `max-width: 768px` (una per blocco, sempre chiusa) |
| Stile dei link/bottoni delle card progetto | `css/project-cards.css` | `.project-links`, `.projects-grid` |
| Chi carica i progetti da JSON | `js/projects.js` | `ProjectsManager.fetchProjects()` |
| Chi disegna le card progetto (desktop e mobile) | `js/projects.js` | `ProjectsManager.render()` / `renderMobile()` |
| Chi carica le esperienze lavorative | `js/work.v2.js` | `WorkManager.fetchWork()` |
| Chi calcola la durata ("8 mesi", "1 anno e 3 mesi") | `js/utils.v2.js` | `Utils.formatDuration()` |
| Chi scrive la durata accanto ai periodi marcati nell'HTML | `js/durations.v2.js` | `DurationsManager.apply()` |
| Chi fa il cambio lingua | `js/language.v2.js` | `LanguageManager.changeLanguage()` |
| Dove sono le traduzioni IT/EN | `js/language.v2.js` | `translations` |
| Come viene scritto il testo tradotto nel DOM | `js/language.v2.js` | `LanguageManager.translateElements()` |
| Chi inietta lo script Umami e l'handler privacy | `js/inline-scripts.js` | `beforeSendHandler` |
| Chi configura analytics (id sito, scroll, tempo, link) | `js/config.js` | `AppConfig.analytics` |
| Chi fa il tracking (scroll depth, tempo, click sui link) | `js/analytics.js` | `AnalyticsManager.initializeAdvancedTracking()` |
| Chi gestisce responsive, tema e accessibilita | `js/ui.js` | `UIManager.onBreakpointChange()` |
| Chi gestisce animazioni, hover e stampa | `js/effects.js` | `EffectsManager.setupEffects()` |
| Chi gestisce back-to-top, skill tag e selettore lingua | `js/components.js` | `ComponentsManager.registerBaseComponents()` |
| Dove sono i contenuti dei progetti | `data/projects.json`, `data/projects.en.json` | array di progetti |
| Dove sono le esperienze lavorative | `data/work.json`, `data/work.en.json` | array di esperienze |
| Chi risponde a `/health` | `nginx.conf` | `location /health` |
| Perche' un JSON mancante deve dare 404 vero | `nginx.conf` | `location ~* \.json$` |
| Dove sono gzip, cache e header di sicurezza | `nginx.conf` | `gzip on`, `add_header X-Frame-Options` |
| Come viene instradato il routing per lingua (`/it`, `/en`) | `nginx.conf` | `location ~ ^/(it\|en)/?$` |
| Come e' esposto Umami (solo tracker, non dashboard) | `nginx.conf` | `location = /analytics/script.js`, `/analytics/api/*`, `return 410` |
| Chi definisce l'immagine di produzione | `Dockerfile` | `FROM nginx:1.31.8-alpine-slim`, `HEALTHCHECK` |
| Cosa finisce dentro l'immagine | `Dockerfile` | `COPY . /tmp/build` e i `cp -r /tmp/build/...` |
| Qual e' l'alternativa multi-stage | `Dockerfile.multistage` | `FROM alpine/git as cloner` |
| Come si avvia con Docker Compose | `docker-compose.yml` | servizio `cv-website`, porta `8080:80` |
| Chi builda l'immagine da GitHub | `build-from-github.sh` | `docker buildx build --platform` |
| Chi testa il container | `test-deployment.sh` | `test_container()` |
| Elenco dei comandi disponibili | `Makefile` | target `build`, `build-github`, `push`, `run`, `stop`, `logs`, `clean`, `test`, `test-full`, `pdf`, `dev` |
| Cosa builda e pubblica la CI (docker image) | `.github/workflows/deploy.yml` | job `build`, `security-scan`, `release` |
| Chi rigenera i PDF del CV a ogni build | `.github/workflows/deploy.yml` | step `Generate CV PDFs` (prima della build Docker) |
| Chi valida HTML, JS e doc su ogni push/PR | `.github/workflows/ci.yml` | job `html`, `js`, `docs` |
| Configurazione html-validate | `.htmlvalidate.json` | preset `recommended`, stile off |
| File esclusi dalla validazione HTML | `.htmlvalidateignore` | `test-projects.html`, `FoodDelivery/` |
| Configurazione ESLint (solo parser) | `eslint.config.js` | flat config, nessuna regola |
| Chi verifica che i doc non derivino dal codice | `scripts/check-docs.mjs` | `FORBIDDEN`, `ALLOWED_PATHS`, exit 1 |
| Aggiornamenti automatici delle dipendenze | `.github/dependabot.yml` | voci `docker`, `docker-compose`, `github-actions`, `npm` (`/scripts`) |
| Pagina sorgente dei PDF del CV (non in navigazione) | `print-cv.html` | `<main id="cv">`, parametro `?lang=it\|en` |
| Chi renderizza il CV in formato A4 per i PDF | `js/print-cv.js` | `buildWork()`, `buildSkills()`, `window.PRINT_READY` |
| Chi adatta la scala del PDF a una sola pagina A4 | `js/print-cv.js` | `window.PRINT_APPLY_FIT()` |
| Dove sta lo stile della pagina di stampa | `css/print-cv.css` | `@page`, `.cv-section`, `.cv-entry` |
| Chi produce `filippomoscatelli_it.pdf` / `filippomoscatelli_en.pdf` | `scripts/generate-pdfs.mjs` | `main()`, `renderPdf()`, `startServer()` |
| Come si lancia la generazione dei PDF in locale | `Makefile` | target `pdf` |
| PDF del CV scaricabili dal sito | `filippomoscatelli_it.pdf`, `filippomoscatelli_en.pdf` | generati da `scripts/generate-pdfs.mjs`, link in `updateCVLink()` |
| Altre versioni del CV (solo su git, non servite) | `Altre versioni pdf/` | `Filippo-moscatelli-CV.pdf`, `filippomoscatelli_it.pdf`, `filippomoscatelli_en.pdf` |
| Favicon | `cv.svg`, `cv.png` | `<link rel="icon">` in `index.html` |
| Variabili d'ambiente previste (solo nomi, nessun valore) | `.env.example` | `IMAGE_NAME`, `DOMAIN` |
| Pagina di test dello JSON progetti | `test-projects.html` | `testProjectsJSON()` |
| Pagina dedicata al progetto Food Delivery | `FoodDelivery/index.html` | `FoodDeliveryLanguageManager` |
| Screenshot dell'app Food Delivery | `FoodDelivery/Kotlin/`, `FoodDelivery/React/` | immagini `.png` |

## Note per area

- **Contenuti**: progetti e esperienze sono JSON in `data/`, uno per lingua. Il rendering e' in
  `js/projects.js` e `js/work.v2.js`; le date hanno formato `YYYY-MM`, la durata e' calcolata da
  `js/utils.v2.js` e non va scritta a mano.
- **PDF**: `print-cv.html` + `js/print-cv.js` non duplicano i contenuti — leggono `translations`
  da `js/language.v2.js`, il blocco `.skills-grid` di `index.html` e i JSON in `data/`.
  `scripts/generate-pdfs.mjs` serve la root del repo su `127.0.0.1`, renderizza con Chrome
  headless e salva i due PDF in root. La CI li rigenera prima della build Docker, quindi
  l'immagine pubblicata ha sempre i PDF aggiornati.
- **Lingue**: due meccanismi separati. Il CV usa `data-key` + `translations` (`js/language.v2.js`);
  la pagina `FoodDelivery/index.html` usa `data-lang-it` / `data-lang-en` e il suo
  `FoodDeliveryLanguageManager`. Cambiare lingua al CV non cambia la pagina Food Delivery.
- **Stili**: nessun `<link>` statico in `index.html`. `js/css-manager.js` inserisce nel `<head>`
  il solo `css/main.css`, che importa gli altri moduli con `@import` nell'ordine dichiarato:
  un foglio da caricare, un ricalcolo di layout (CLS). Un foglio nuovo si aggiunge **alla
  catena di `@import`**, non a un array nel JS. `css/print-cv.css` e' l'eccezione: e' linkato
  solo da `print-cv.html`. Le variabili CSS esistono (`--ui-root` in `css/scale.css`); i colori
  sono valori letterali dentro i moduli.
- **Analytics**: Umami e' self-hosted su `10.0.0.5:3010` e si raggiunge first-party via proxy
  nginx (`/analytics/script.js`, `/analytics/api/send`, `/analytics/api/collect`). L'id sito
  compare in `js/config.js` (`AppConfig.analytics.websiteId`) e in `js/inline-scripts.js`.
- **Produzione**: il sito gira in un container Docker sul master (compose in
  `/mnt/applicazioni/yml/docker/filippomoscatelli`, container `filippomoscatelli-cv`,
  `10.0.0.5:8083 -> 80`). Dopo il merge serve `docker compose pull && docker compose up -d`
  sul master: la CI pubblica l'immagine, non aggiorna il sito.
- **Versione in esecuzione**: `VERSION` viene copiato in `version.txt` dalla build, quindi
  `/version.txt` dice cosa sta girando davvero (non il tag dell'immagine ne' la pagina Deployments).
- **Dipendenze**: il sito non ha dipendenze npm. L'unico `package.json` e' in `scripts/`
  (`puppeteer-core`) e serve solo a generare i PDF: non entra nell'immagine (`.dockerignore`
  esclude `scripts/` e `**/node_modules`).

## Limiti noti (dove la mappa e' sottile)

- `js/analytics.js` silenzia gli errori (`track()` esce senza log se Umami non e' pronto): viola la
  regola "no fallback silenziosi" di `docs/CONVENTIONS.md`.
- `FoodDelivery/index.html` reimplementa la lingua invece di riusare `js/language.v2.js`:
  due sistemi di traduzione da mantenere.
- `index.html` contiene script inline (link PDF, auto-detect da URL, fallback traduzioni) oltre ai
  moduli: la sezione "moduli" da sola non spiega tutta la pagina.
- I PDF di root e quelli in `Altre versioni pdf/` hanno lo stesso nome ma dimensioni diverse:
  due versioni coesistono, e `index.html` linka quelli di root.
- `AppConfig.projects.featured` (`js/config.js`) elenca 3 progetti "featured", ma la sezione
  progetti arriva da `data/projects.json` (4 voci): la lista featured non e' usata dal rendering.
- `AppConfig.app.version` (`js/config.js`, `2.0.0`) non segue `VERSION`: due numeri di versione
  nello stesso repo.
- `AppConfig.seo.canonical` punta a `filippomoscatelli.it`, mentre il sito e' `.com`.
- `make test` stampa l'esito ma non esce in errore: un health check fallito non fa fallire `make`.
- `Dockerfile` copia i PDF di root (`cp -r /tmp/build/*.pdf`): `Altre versioni pdf/` resta su git
  e non viene pubblicata dal sito.
- `test-projects.html` e `FoodDelivery/` sono esclusi da html-validate (`test-projects.html` perche'
  pagina di test manuale, `FoodDelivery/` perche' ha un suo HTML non ancora ripulito).
