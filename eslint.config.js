# Flat config ESLint 9+ (unica forma supportata; .eslintrc e --ext non esistono piu').
// Serve a inizializzare il parser: senza config ESLint 9 esce con errore.
// Il passo "Syntax check" della CI fa solo controllo di sintassi: nessuna regola
// applicata, quindi niente ambiente browser/Node e niente no-undef.
export default [
  {
    files: ["**/*.js"]
  }
];
