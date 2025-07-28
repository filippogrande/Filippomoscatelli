/**
 * Inline Scripts Module
 * Contiene gli script che erano inline nell'HTML per conformità CSP
 */

// Auto-detect environment e configurazione Umami
(function() {
    console.log('🟢 Inline scripts module loaded');
    
    // Auto-detect se siamo in sviluppo o produzione
    const isLocalDevelopment = window.location.hostname === 'localhost' || 
                               window.location.hostname === '127.0.0.1' ||
                               window.location.hostname.includes('192.168.');
    
    const umamiConfig = {
        websiteId: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
        tag: isLocalDevelopment ? 'cv-development' : 'cv-production',
        src: isLocalDevelopment ? 
            'http://192.168.1.4:3000/script.js' : 
            'https://filippomoscatelli.com/analytics/script.js'
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
    if (!isLocalDevelopment) {
        script.setAttribute('data-respect-dnt', 'true');
        script.setAttribute('data-cookie-consent', 'true');
    }
    
    document.head.appendChild(script);
    console.log('📊 Umami script configured:', umamiConfig);
})();

// Debug immediato HTML
(function() {
    console.log('🟢 HTML DEBUG SCRIPT EXECUTED');
    console.log('Time:', new Date().toISOString());
    console.log('Location:', window.location.href);
    
    // Controlla se beforeSendHandler è già definito
    if (typeof beforeSendHandler !== 'undefined') {
        console.log('✅ beforeSendHandler already defined');
    } else {
        console.log('❌ beforeSendHandler not yet defined');
        // Definisci beforeSendHandler per preservare IP reale
        window.beforeSendHandler = function(type, payload) {
            console.log('🚀 beforeSendHandler called:', { type, payload });
            
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
                
                console.log('📊 Enhanced payload:', payload);
            }
            
            return payload; // Procedi con l'invio
        };
    }
})();

// Debug pre-script
(function() {
    console.log('🔵 PRE-SCRIPT DEBUG');
    console.log('About to load modular JavaScript architecture');
    console.log('Current scripts in document:', document.scripts.length);
    
    // Lista tutti gli script presenti
    Array.from(document.scripts).forEach((script, index) => {
        console.log(`Script ${index}:`, {
            src: script.src,
            id: script.id,
            async: script.async,
            defer: script.defer,
            readyState: script.readyState
        });
    });
})();

console.log('📜 Inline scripts module fully loaded');
