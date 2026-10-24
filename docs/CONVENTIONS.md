# CONVENTIONS — regole del repo

<!-- Tipo: HOW-TO. Una regola, perche', come si applica. -->

## Codice

- **Max 50 righe/funzione** — VINCOLANTE. Funzioni piu' lunghe vanno divise per coesione
  semantica, non tagliate a meta' per fare numero.
- **Max 500 righe/file** — VINCOLANTE. File piu' lunghi vanno divisi in moduli piu' piccoli per
  coesione semantica.
- **No fallback silenziati** — niente `return []`, `{}`, `nil` o mock per mascherare un errore.
  L'errore va esplicito e visibile. Vale anche per il frontend: un `catch` che non logga e' un
  fallback silenzioso.
- **No file di test usa-e-getta** — verifica sulla build reale, non su frammenti temporanei.
- **Niente codice duplicato per concetto**: se due file risolvono lo stesso problema, si
  consolida (es. due sistemi di lingua, due script di build).

## Documentazione

- **Aggiornare la documentazione nella stessa PR** — se cambi codice, aggiorna i doc nello stesso
  branch. Non esiste una "PR doc" separata per un cambio di codice.
- **Un solo doc per concetto**: se due doc dicono la stessa cosa, si consolidano.
- **Un doc che mente e' peggio di nessuna doc**: va corretto o cancellato nella stessa PR, non
  annotato a margine.
- **File `.md` vuoti o di 0 byte**: eliminati, non preservati.
- **File usa-e-getta**: eliminati.
- **Quattro tipi, uno per doc**, dichiarato in testa al file:
  `reference` (fatti, neutro, completo), `explanation` (come funziona / perche'), `how-to`
  (passi per un obiettivo), `tutorial` (imparare facendo).
- **La mappa** (`docs/REFERENCE.md`): una riga per richiesta, niente numeri di riga (le righe si
  muovono, i simboli no), niente elenco di directory. Ogni riga punta a un file reale e a un
  simbolo reale, verificato.

## Repo

- **Branch + PR, mai push su `main`.** Branch descrittivo (es. `docs/repo-navigation-map`).
- **In root solo**: `README.md`, `AGENTS.md`, manifest del linguaggio, `Dockerfile` e
  `docker-compose.yml`, cartelle. I doc stanno in `docs/`, in pochi file consolidati per scope.
- **`README.md` breve**: cosa e', avvio, struttura, e un indice che punta ai doc.
- **`AGENTS.md` in root**: l'unico file letto sempre, con l'indice richiesta -> doc.
- **Niente `.gitignore` nuovo ne' modifiche a file gia' tracciati** in una PR di sola
  documentazione: se ne trovi (es. `.DS_Store`, `__pycache__`), segnalali nella PR, non
  rimuoverli.
- **Niente segreti**: token, chat_id, password, path di credential non vanno mai nei doc.
- **Dipendenze pinnate**: Python `>=` o `==` (no nomi nudi), Node con `package-lock.json`
  committato, Go con `go.mod` + `go.sum`. In questo repo non c'e' `package.json`: le uniche
  dipendenze sono le immagini Docker e le GitHub Actions.

## Dependabot

- Ogni manifest (`package.json`, `requirements.txt`, `go.mod`, `Dockerfile`, `docker-compose.yml`,
  `.github/workflows/`) DEVE avere la sua voce in `.github/dependabot.yml`.
- Quando aggiungi un manifest, aggiorna `dependabot.yml` nella stessa PR.
- Stato di questo repo: voci `docker`, `docker-compose` e `github-actions`, tutte su `/`.
  Il file vale solo sul branch di default: agisce dopo il merge.

## Task tracking

- I task sono in Vikunja. Si chiude un task solo quando il fix e' mergiato **e** verificato.

## Pull request

- **Una PR = un cambiamento logico.** PR multi-file solo dove indicato.
- **Titolo in conventional commit**: `feat:`, `fix:`, `chore:`, `ci:`, `docs:`.
- **Corpo della PR**: cosa cambia, file mappa, come verificare, e le decisioni che hai dovuto
  prendere da solo (cosi' si confermano o correggono in review).
