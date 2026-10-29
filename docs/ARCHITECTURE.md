# ARCHITECTURE — come funziona

<!-- Tipo: EXPLANATION. Come funziona e perche', non i passi (quelli sono in OPERATIONS.md). -->

## Il sito non ha backend

`index.html` e' l'unica pagina del CV. Il sito non ha build: i file CSS e JS sono serviti
cosi' come sono. L'unico `package.json` e' in `scripts/` e serve solo a generare i PDF.
I contenuti che cambiano spesso (progetti, esperienze) sono file JSON in `data/`, uno per
lingua, che il browser legge con `fetch`.

Conseguenza importante: **nginx deve rispondere 404 vero per un JSON mancante**. Se il `.json`
cade sul fallback di `index.html`, il `fetch` riceve HTML e `res.json()` fallisce con un errore
incomprensibile. Per questo `nginx.conf` ha un blocco dedicato (`location ~* \.json$` con
`try_files $uri =404`), separato dal `location /` che invece fa il fallback a `index.html`.

## I moduli e l'ordine di avvio

Ogni file in `js/` e' una classe che si auto-esporta su `window` (es. `window.ProjectsManager`).
`index.html` li carica in un ordine preciso, che rispetta le dipendenze:

```
config -> utils -> css-manager -> components -> language -> analytics -> effects -> ui
      -> projects -> work -> durations -> main
```

- `js/config.js` (`ConfigManager`) legge l'ambiente dall'hostname (`detectEnvironment()`):
  `localhost`/`127.0.0.1`/`192.168.*` = development, hostname con `test`/`staging` = test,
  resto = production. Da li' cambiano debug, tag analytics e livello di log.
- `js/utils.v2.js` (`Utils`) sono le utility condivise: `debounce`, storage, e la logica delle
  durate (`formatDuration`, `monthsBetween`).
- `js/css-manager.js` (`CSSManager`) inserisce nel `<head>` il solo `css/main.css`, che importa
  gli altri moduli con `@import`. Un foglio da caricare invece di undici `<link>` in sequenza:
  meno ricalcoli di layout durante il caricamento.
- `js/components.js` (`ComponentsManager`) registra i componenti UI che gia' esistono nel DOM
  (selettore lingua, back-to-top, skill tag).
- `js/language.v2.js` (`LanguageManager`) risolve la lingua e traduce gli elementi con `data-key`.
- `js/analytics.js` (`AnalyticsManager`) attende che lo script Umami sia disponibile e poi
  attiva scroll depth, tempo sulla pagina e tracking dei click.
- `js/effects.js` (`EffectsManager`) animazioni, hover, effetto typewriter sul nome, stampa.
- `js/ui.js` (`UIManager`) rilevamento del breakpoint, tema, focus visibile, regioni ARIA live.
- `js/projects.js` e `js/work.v2.js` prendono i JSON e disegnano le sezioni.
- `js/durations.v2.js` (`DurationsManager`) riscrive la durata accanto a ogni elemento con
  `data-period-start`.
- `js/main.js` (`AppManager`) e' l'ultimo: registra i moduli in ordine e li inizializza.

## Il pattern dei moduli

Ogni modulo segue lo stesso contratto: una classe, un'istanza globale, un metodo `initialize()`.
**L'inizializzazione la fa solo `AppManager`**: un modulo non si auto-inizializza "se il global
`appManager` non c'e'". Quel fallback (storicamente presente in coda ai file) e' sempre vero,
perche' `main.js` e' l'ultimo script caricato: produceva due istanze dello stesso manager, con
`initialize()` e `fetch` eseguiti due volte. Se un modulo deve essere usato da una pagina che
non carica `main.js` (la pagina di stampa), si istanzia esplicitamente li'.

## Gli eventi che coordinano i moduli

I moduli non si chiamano tra loro direttamente: emettono eventi custom su `document`.

| Evento | Emesso da | A cosa serve |
|---|---|---|
| `languageChanged` | `LanguageManager.changeLanguage()` | `ProjectsManager` e `WorkManager` ricaricano il JSON della nuova lingua; `DurationsManager` ricalcola le durate; `AnalyticsManager` traccia il cambio |
| `breakpointChanged` | `UIManager.onBreakpointChange()` | cambio classe CSS mobile/tablet/desktop |
| `themeChanged` | `UIManager.changeTheme()` | cambio tema |

Questo e' il motivo per cui il modulo lingua viene caricato prima di progetti e lavoro.

## La scala tipografica

Tutte le misure sono in `rem`, quindi la dimensione di tutto il layout dipende dal `font-size`
del root: la leva e' `--ui-root` in `css/scale.css` (soglie a 1000, 1400 e 1800 px CSS).
Ritarare il sito = cambiare quel numero, non le singole regole. Le media query mobili stanno in
`css/responsive.css`, una per blocco e **sempre chiuse**: una media query lasciata aperta fa
finire le regole desktop dentro il blocco mobile, e il sintomo diventa "su desktop non si vede".

## Le durate non sono scritte a mano

Il testo "Set 2021 - in corso" e' statico in `index.html`, ma la durata tra parentesi
("(4 anni e 7 mesi)") la calcola `Utils.formatDuration()`:

- `WorkManager` la aggiunge per ogni esperienza in `data/work.json`;
- `DurationsManager` la aggiunge per ogni periodo marcato con `data-period-start`
  (es. il volontariato in `index.html`), e la ricalcola a ogni cambio lingua grazie a un
  `MutationObserver` (`DurationsManager.watch()`), perche' riscrivere il testo del periodo
  cancellerebbe lo span della durata.

Senza `endDate` la durata conta fino al mese corrente.

## Due sistemi di lingua, non uno

- Il CV usa attributi `data-key` in `index.html` e l'oggetto `translations` in `js/language.v2.js`.
  Le scorciatoie sono Alt+I (italiano) e Alt+E (inglese); la scelta resta in
  `localStorage['preferred-language']`; al primo accesso la lingua arriva dal browser.
- `FoodDelivery/index.html` e' una pagina separata (il progetto di Mobile Computing, linkato
  dalla card "Applicazione Food Delivery" in `data/projects.json`). Non carica i moduli del CV:
  ha il suo `FoodDeliveryLanguageManager` e traduce con attributi `data-lang-it` / `data-lang-en`.

Cambiare lingua sul CV non cambia la pagina Food Delivery, e viceversa.

## Il container

`Dockerfile` (l'unico usato dalla CI) parte da `nginx:1.31.8-alpine-slim`, copia i file dal
**build context** (non clona il repo) e non installa nessun pacchetto: l'health check usa il
`wget` di busybox gia' presente. Copia nel document root solo asset del sito: `index.html`,
`print-cv.html`, `css/`, `js/`, `data/`, `FoodDelivery/`, i PDF e le immagini di root, piu'
`VERSION` come `version.txt`. `nginx.conf` va **solo** in `/etc/nginx`.

`Dockerfile.multistage` fa la stessa cosa in due stage: il primo (`FROM alpine/git as cloner`)
clona il repository, il secondo copia i file dal primo. Non e' usato dalla CI.

## Build e pubblicazione

- La CI (`.github/workflows/deploy.yml`) builda e pubblica su Docker Hub. Su PR builda solo
  `linux/amd64` e fa smoke test; su push in `main` builda multi-platform e pusha.
- **Tag**: `<VERSION>`, `sha-<7>` sempre; `latest` solo quando la patch e' `0` (X.Y.0),
  altrimenti `pre-release`. I tag si calcolano in shell e si stampano nel log del run: un
  `image: ...:latest` nel compose non riceve le patch.
- `build-from-github.sh` e' la build locale multi-platform dall'URL del repository: non pusha,
  serve a provare l'immagine senza aspettare la CI.
- Il deploy in produzione **non** e' automatico: dopo il merge l'immagine e' su Docker Hub ma il
  container sul master gira ancora la precedente finche' non si fa `docker compose pull`.

## nginx

Un solo `server` sulla porta 80 con:

- `/health` che risponde `200 healthy` (usato dall'HEALTHCHECK del container);
- fallback di `location /` a `index.html` (serve anche il routing `/it` e `/en`);
- blocco dedicato per i `.json` con 404 reale;
- cache corta (1 minuto) per CSS/JS/immagini — i nomi versionati `.v2` danno il refresh
  immediato, la scadenza corta e' la rete di sicurezza;
- cache di 5 minuti per i PDF (30 giorni tenevano in giro un CV vecchio dopo ogni deploy);
- proxy ristretto per Umami: solo `/analytics/script.js` e le due API di raccolta, il resto
  di `/analytics/` risponde `410`;
- gzip e header di sicurezza (fra cui una CSP che consente `'unsafe-inline'`).

## La CI

Il repo ha due workflow.

### `.github/workflows/deploy.yml` ("Build and Deploy CV Website")

- `build`: su PR verso `main` builda solo `linux/amd64` e fa smoke test (incluso un controllo
  che i PDF e `/print-cv.html` esistano **dentro** l'immagine); su push in `main` builda
  multi-platform, pusha e pubblica i tag.
- `security-scan`: solo su `main`, Trivy con upload SARIF e tabella nel log.
- `release`: solo su push in `main`, crea il tag `v<VERSION>` e un deployment `production` in
  stato `pending`, che diventa `success` con il workflow manuale `Confirm production deploy`.

deploy.yml ignora i push che toccano solo `README.md`, `.gitignore` e `docs/**`: una PR di sola
documentazione non builda l'immagine.

### `.github/workflows/ci.yml` ("CI")

Tre job, sia su push che su pull request verso `main`:

- `html`: valida i file `.html` con `html-validate` (config: `.htmlvalidate.json`; esclusioni:
  `.htmlvalidateignore`).
- `js`: verifica la sintassi dei file in `js/` con `eslint` (flat config, solo parser).
- `docs`: esegue `scripts/check-docs.mjs`, che fallisce se un doc cita un file che non esiste,
  un target `make` che non esiste, o un pezzo della vecchia infrastruttura rimossa.
