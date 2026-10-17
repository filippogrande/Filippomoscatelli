// Flat config ESLint 9+ (unica forma supportata; .eslintrc e --ext non esistono piu').
// Serve a inizializzare il parser: senza config ESLint 9 esce con errore.
// Il passo "Syntax check" della CI applica solo no-undef con l'ambiente browser:
// ogni simbolo non definito e non browser viene segnalato. Il codice js/ e'
// legacy (variabili globali, catch vuoti) e questa regola ne segnala alcuni:
// il passo resta una guardia di sintassi, non uno stile-check.
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        console: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Intl: "readonly",
        URL: "readonly",
        Date: "readonly",
        Math: "readonly",
        String: "readonly",
        Number: "readonly",
        Array: "readonly",
        Object: "readonly",
        JSON: "readonly",
        Promise: "readonly",
        Map: "readonly",
        Set: "readonly",
        Symbol: "readonly",
        Error: "readonly",
        RegExp: "readonly",
        Boolean: "readonly",
        Function: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
        HTMLElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        HTMLImageElement: "readonly",
        Image: "readonly",
        umami: "readonly",
        beforeSendHandler: "readonly"
      }
    },
    rules: {
      "no-undef": "error"
    }
  }
];
