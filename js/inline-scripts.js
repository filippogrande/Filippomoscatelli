/**
 * Inline Scripts Module
 * Contiene gli script che erano inline nell'HTML per conformità CSP
 */

// Auto-detect environment e configurazione Umami
(function() {
    
    const umamiConfig = {
        websiteId: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
        tag: 'cv-production',
        src: 'https://filippomoscatelli.com/analytics/script.js'
    };
    
    // Carica script Umami dinamicamente
    const script = document.createElement('script');
    script.defer = true;
    script.src = umamiConfig.src;
    script.setAttribute('data-website-id', umamiConfig.websiteId);
    script.setAttribute('data-tag', umamiConfig.tag);
    script.setAttribute('data-exclude-search', 'false');
    script.setAttribute('data-exclude-hash', 'true');
    script.setAttribute('data-do-not-track', 'false');
    script.setAttribute('data-cache', 'true');
    script.setAttribute('data-domains', 'filippomoscatelli.com');
    script.setAttribute('data-before-send', 'beforeSendHandler');
    
    // Headers per privacy (GDPR)
    script.setAttribute('data-respect-dnt', 'true');
    script.setAttribute('data-cookie-consent', 'true');
    
    document.head.appendChild(script);
})();

// Debug immediato HTML
(function() {
    
    // Controlla se beforeSendHandler è già definito
    if (typeof beforeSendHandler !== 'undefined') {
    } else {
        // Definisci beforeSendHandler per preservare IP reale
        window.beforeSendHandler = function(type, payload) {
            
            // Aggiungi informazioni aggiuntive per geolocalizzazione
            if (payload && typeof payload === 'object') {
                // Preserva CF-Connecting-IP se disponibile (Cloudflare)
                if (window.navigator && window.navigator.userAgent) {
                    payload.user_agent_full = window.navigator.userAgent;
                }
                
                // Aggiungi informazioni browser per analisi
                payload.screen_resolution = `${window.screen.width}x${window.screen.height}`;
                payload.viewport_size = `${window.innerWidth}x${window.innerHeight}`;
                payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                payload.language_full = navigator.language;
                
            }
            
            return payload; // Procedi con l'invio
        };
    }
})();

