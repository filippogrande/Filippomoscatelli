# ARCHITECTURE — come funziona

<!-- Tipo: EXPLANATION. Come funziona e perche', non i passi (quelli sono in OPERATIONS.md). -->

## Il sito non ha backend

`index.html` e' l'unica pagina del CV. Non c'e' build, non c'e' `package.json`: i file
CSS e JS sono serviti cosi' come sono. I contenuti che cambiano spesso (progetti, esperienze)
sono file JSON in `data/`, uno per lingua, che il browser legge con `fetch`.

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
- `js/css-manager.js` (`CSSManager`) carica i fogli di `css/` dinamicamente, in ordine, e
  prepara i hook per tema e stampa.
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

Ogni modulo segue lo stesso contratto: una classe, un'istanza globale, un metodo `initialize()`,
e un **fallback di inizializzazione** alla fine del file:

```js
if (typeof window !== 'undefined' && !window.appManager) {
    document.addEventListener('DOMContentLoaded', () => { /* inizializza da solo */ });
}
```

Il fallback esiste perche' i moduli possono essere eseguiti fuori ordine (o senza `main.js`):
cosi' una pagina che ne carica solo alcuni non si rompe. Il prezzo e' che alcuni file hanno due
percorsi di avvio: quando `window.appManager` c'e', vince `AppManager`.

## Gli eventi che coordinano i moduli

I moduli non si chiamano tra loro direttamente: emettono eventi custom su `document`.

| Evento | Emesso da | A cosa serve |
|---|---|---|
| `languageChanged` | `LanguageManager.changeLanguage()` | `ProjectsManager` e `WorkManager` ricaricano il JSON della nuova lingua; `DurationsManager` ricalcola le durate; `AnalyticsManager` traccia il cambio |
| `breakpointChanged` | `UIManager.onBreakpointChange()` | cambio classe CSS mobile/tablet/desktop |
| `themeChanged` | `UIManager.changeTheme()` | cambio tema |

Questo e' il motivo per cui il modulo lingua viene caricato prima di progetti e lavoro.

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

`Dockerfile` (quello usato da CI e da `deploy.sh`) parte da `nginx:1.31.0-alpine-slim`,
copia i file dal **build context** (non clona il repo) e installa `curl` per l'health check.
Copia nel document root: `index.html`, `css/`, `js/`, `data/`, `FoodDelivery/`, i PDF e le
immagini di root, `test-projects.html`, e infine `nginx.conf`.

`Dockerfile.multistage` fa la stessa cosa in due stage: il primo (`FROM alpine/git as cloner`)
clona il repository, il secondo copia i file dal primo. Il suo health check e' piu' stretto
(`curl -f http://localhost/health` invece di `curl -f http://localhost/`).

Nessuno dei due e' usato dalla CI: la CI builda con `docker/build-push-action` usando il
`Dockerfile` di root.

## I due modi di buildare

- `build-from-github.sh`: `docker buildx build --platform linux/amd64,linux/arm64,linux/386`
  direttamente dall'URL del repository. Nessun clone locale, nessun push (il push lo fa la CI).
  E' il metodo raccomandato per produzione.
- `deploy.sh`: verifica Docker e kubectl, clona il repo in una directory temporanea, builda
  **single-platform**, crea un tag con timestamp (per il rollback manuale), poi
  `kubectl apply` dei manifest e `kubectl rollout status`. Il push dell'immagine e' disabilitato
  (righe commentate in `push_image()`).

Sono sovrapposti (entrambi clonano GitHub e buildano) e non sono stati consolidati: sono
script, non documentazione. Dettagli in `docs/OPERATIONS.md`.

## nginx

Un solo `server` sulla porta 80 con:

- `/health` che risponde `200 healthy` (usato da health check Docker, probe k8s e test);
- fallback di `location /` a `index.html` (serve il routing `/it` e `/en`);
- blocco dedicato per i `.json` con 404 reale;
- cache corta (1 minuto) per CSS/JS/immagini — i nomi versionati `.v2` danno il refresh
  immediato, la scadenza corta e' la rete di sicurezza;
- cache lunga (30 giorni) per i PDF;
- gzip e header di sicurezza (fra cui una CSP che consente `'unsafe-inline'`).

## La CI

`.github/workflows/deploy.yml` ha due job:

- `build`: su PR verso `main` builda in locale solo `linux/amd64` (nessun push) e fa uno smoke
  test (`docker run` + `curl /health`); su push in `main` builda multi-platform e pusha su Docker
  Hub con i tag `latest`, `main` e `sha-<short>`.
- `security-scan`: solo su `main`, Trivy con upload SARIF nella tab Security.

Il deploy su Kubernetes **non** e' automatizzato: il workflow non ha piu' job di deploy e
l'input `deploy_to_k8s` del trigger manuale non e' piu' usato.

Nota: il workflow ignora i push che toccano solo `README.md`, `.gitignore` e `docs/**`. Una PR
di sola documentazione non builda.
