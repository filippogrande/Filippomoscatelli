/**
 * Inline Scripts Module
 * Script che prima stavano inline nell'HTML per conformita' CSP.
 *
 * UMAMI: rimosso (v1.0.3). Caricava https://filippomoscatelli.com/analytics/script.js,
 * che non esiste: nginx non ha nessuna location /analytics/ e il fallback SPA
 * rispondeva 200 con index.html (text/html). Il browser quindi rifiutava di
 * eseguirlo ("MIME type non eseguibile") e in console restavano 3 errori a ogni
 * caricamento, senza raccogliere nessun dato.
 *
 * Per riattivare l'analytics serve l'URL reale dell'istanza Umami (o un proxy
 * nginx verso di essa) e va reinserito qui: non basta rimettere questa riga.
 */
