/**
 * Inline Scripts Module
 * Script che prima stavano inline nell'HTML per conformita' CSP.
 *
 * UMAMI: il loader puntava a https://filippomoscatelli.com/analytics/script.js,
 * ma nginx non aveva nessuna location /analytics/: la richiesta cadeva nel
 * fallback SPA, tornava index.html come text/html e il browser si rifiutava di
 * eseguirlo (3 errori in console, zero dati raccolti).
 *
 * Ora nginx.conf proxa /analytics/ verso l'istanza self-hosted (10.0.0.5:3010),
 * quindi il path torna valido e first-party: niente dominio nuovo, niente CORS.
 */

(function() {
    const umamiConfig = {
        websiteId: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
        tag: 'cv-production',
        src: '/analytics/script.js'
    };

    const script = document.createElement('script');
    script.defer = true;
    script.src = umamiConfig.src;
    script.setAttribute('data-website-id', umamiConfig.websiteId);
    script.setAttribute('data-tag', umamiConfig.tag);
    script.setAttribute('data-exclude-search', 'false');
    script.setAttribute('data-exclude-hash', 'true');
    script.setAttribute('data-do-not-track', 'false');
    script.setAttribute('data-domains', 'filippomoscatelli.com');
    script.setAttribute('data-respect-dnt', 'true');

    // Se Umami e' giu' (502) lo si vede in console e nei log nginx: meglio di un
    // fallback silenzioso che nasconde il problema.
    script.onerror = function() {
        console.error('Umami: /analytics/script.js non caricato (istanza giu\' o proxy non raggiungibile)');
    };

    document.head.appendChild(script);
})();

// beforeSendHandler legacy: lo script non lo usa piu' (data-before-send rimosso),
// resta definito per non rompere eventuali chiamate salvate in cache lunga.
window.beforeSendHandler = function (type, payload) {
    return payload;
};
