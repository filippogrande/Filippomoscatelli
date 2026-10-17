// Flat config ESLint 9+ (unica forma supportata; .eslintrc e --ext non esistono piu').
// Serve solo a inizializzare il parser: senza config ESLint 9 esce subito con
// "couldn't find an eslint.config.* file". Nessuna regola e nessun ambiente
// browser: il passo della CI e' una guardia di sintassi, non uno style-check.
export default [
  {
    files: ["**/*.js"]
  }
];
