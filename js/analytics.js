/**
 * Analytics and Tracking Module
 * Gestisce Umami analytics e tracking avanzato per sviluppo e produzione
 */

class AnalyticsManager {
    constructor() {
        // Evita doppia inizializzazione
        if (window.analyticsManagerInstance) {
            return window.analyticsManagerInstance;
        }
        
        this.umamiAvailable = false;
        this.websiteId = 'a912f285-ced0-4c7f-9260-434d0ee8674a';
        this.initialized = false;
        this.trackingInitialized = false;
        this.trackingConfig = {
            scrollDepth: {
                25: false,
                50: false,
                75: false,
                90: false
            },
            maxScrollReached: 0,
            scrollStartTime: Date.now(),
            pageLoadTime: Date.now(), // Timestamp apertura sito
            timeOnPage: 0,
            timeInterval: null,
            sessionId: this.generateSessionId(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            languageChanged: false // Flag per tracciare cambio lingua
        };
        
        this.checkUmamiAvailability();
        
        // Salva istanza per evitare duplicati
        window.analyticsManagerInstance = this;
    }

    /**
     * Genera un session ID unico
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Controlla la disponibilità di Umami
     */
    checkUmamiAvailability() {
        let checkCount = 0;
        const checker = setInterval(() => {
            checkCount++;
            this.umamiAvailable = typeof umami !== 'undefined';
            
            if (this.umamiAvailable || checkCount >= 10) {
                if (this.umamiAvailable) {
                    this.onUmamiReady();
                }
                clearInterval(checker);
            }
        }, 1000);
    }

    /**
     * Chiamata quando Umami diventa disponibile
     */
    onUmamiReady() {
        if (this.initialized) {
            return;
        }
        
        // Flag globale per evitare inizializzazioni multiple
        if (window.analyticsInitialized) {
            return;
        }
        
        // Track session start (una sola volta)
        this.track('session-start', {
            language: document.documentElement.getAttribute('lang') || 
                     window.languageManager?.getCurrentLanguage() || 'it',
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString(),
            session_id: this.trackingConfig.sessionId,
            detected_from: 'html_lang_attribute'
        });
        
        // Inizializza tracking avanzato
        this.initializeAdvancedTracking();
        this.initialized = true;
        window.analyticsInitialized = true; // Flag globale
    }

    /**
     * Wrapper per umami.track con fallback
     * @param {string} eventName - Nome evento
     * @param {object} data - Dati evento
     * @param {string} tag - Tag per categorizzare l'evento (usa data-tag di Umami)
     */
    track(eventName, data = {}, tag = null) {
        // Non trackare se Umami non è disponibile - evita log di errore
        if (!this.umamiAvailable || typeof umami === 'undefined') {
            return; // Silently fail se Umami non è pronto
        }

        try {
            // Usa data-tag di Umami per il filtraggio nativo
            const options = {};
            if (tag) {
                options['data-tag'] = tag;
            }
            
            if (typeof eventName === 'string') {
                // Chiama umami.track con data-tag per filtraggio nativo
                umami.track(eventName, data, options);
            } else {
                umami.track(eventName); // Per pageview semplici
            }
        } catch (error) {
            // Silently fail in production
        }
    }

    /**
     * Setup Scroll Depth Tracking
     */
    setupScrollTracking() {
        // Flag per tracking lingua a 25%
        let languageTrackedAt25Percent = false;
        
        const trackScrollDepth = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            // Aggiorna massimo raggiunto
            if (scrollPercent > this.trackingConfig.maxScrollReached) {
                this.trackingConfig.maxScrollReached = scrollPercent;
            }
            
            // Track lingua corrente a 25% scroll (se non già fatto e lingua non cambiata)
            if (scrollPercent >= 25 && !languageTrackedAt25Percent && !this.trackingConfig.languageChanged) {
                languageTrackedAt25Percent = true;
                // Ottieni la lingua corrente effettiva dalla pagina
                const currentLang = document.documentElement.getAttribute('lang') || 
                                  window.languageManager?.getCurrentLanguage() || 'it';
                
                this.track(`lang-current-${currentLang}`, {
                    language: currentLang,
                    scroll_percentage: scrollPercent,
                    timestamp: new Date().toISOString(),
                    method: 'scroll_25_percent',
                    time_from_page_load: Math.round((Date.now() - this.trackingConfig.pageLoadTime) / 1000),
                    language_changed: false,
                    detected_from: 'html_lang_attribute'
                }, 'language');
            }
            
                        // Track milestone specifiche con percentuale
            Object.keys(this.trackingConfig.scrollDepth).forEach(depth => {
                if (scrollPercent >= parseInt(depth) && !this.trackingConfig.scrollDepth[depth]) {
                    this.trackingConfig.scrollDepth[depth] = true;
                    const timeToReach = Math.round((Date.now() - this.trackingConfig.scrollStartTime) / 1000);
                    const timeFromPageLoad = Math.round((Date.now() - this.trackingConfig.pageLoadTime) / 1000);
                    
                    this.track(`scroll-depth-${depth}`, { 
                        percentage: parseInt(depth),
                        time_to_reach: timeToReach,
                        time_from_page_load: timeFromPageLoad,
                        max_reached: this.trackingConfig.maxScrollReached,
                        language: window.languageManager?.getCurrentLanguage() || 'it'
                    }, 'scroll');
                }
            });
        };
        
        // Throttled scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 100);
        });
        
        // Track scroll summary on page leave
        window.addEventListener('beforeunload', () => {
            if (this.umamiAvailable && this.trackingConfig.maxScrollReached > 0) {
                this.track('scroll-summary', {
                    max_scroll_reached: this.trackingConfig.maxScrollReached,
                    total_time_on_page: Math.round((Date.now() - this.trackingConfig.pageLoadTime) / 1000),
                    language: window.languageManager?.getCurrentLanguage() || 'it'
                }, 'scroll');
            }
        });
    }

    /**
     * Setup Time Tracking
     */
    setupTimeTracking() {
        this.trackingConfig.timeInterval = setInterval(() => {
            this.trackingConfig.timeOnPage += 15; // Ogni 15 secondi
            
            // Track milestone specifiche: 30s, 1min, 2min, 5min, 10min
            if ([30, 60, 120, 300, 600].includes(this.trackingConfig.timeOnPage)) {
                const minutes = Math.round(this.trackingConfig.timeOnPage / 60);
                const milestoneLabel = this.trackingConfig.timeOnPage < 60 ? 
                    `${this.trackingConfig.timeOnPage}s` : 
                    `${minutes}min`;
                
                this.track(`time-${milestoneLabel}`, { 
                    total_seconds: this.trackingConfig.timeOnPage,
                    total_minutes: minutes,
                    milestone: milestoneLabel,
                    language: window.languageManager?.getCurrentLanguage() || 'it',
                    timestamp: new Date().toISOString(),
                    session_id: this.trackingConfig.sessionId
                }, 'time');
            }
        }, 15000); // Ogni 15 secondi
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (this.trackingConfig.timeInterval) {
                clearInterval(this.trackingConfig.timeInterval);
            }
        });
    }

    /**
     * Setup Link Tracking
     */
    setupLinkTracking() {
        // Trova tutti i link cliccabili
        const allLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"]');
        
        // Track clicks sui link esterni
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = e.target.href;
                const linkText = e.target.textContent.trim();
                
                let tracked = false;
                
                if (href.includes('linkedin.com')) {
                    this.track('linkedin-click', { 
                        platform: 'linkedin', 
                        text: linkText,
                        url: href 
                    }, 'social');
                    tracked = true;
                } else if (href.includes('mailto:filipp28mo@gmail.com')) {
                    this.track('contact-email', { 
                        method: 'email', 
                        address: 'filipp28mo@gmail.com',
                        text: linkText 
                    }, 'contact');
                    tracked = true;
                } else if (href.includes('github.com/filippogrande/Software-Inc-Print-Manager')) {
                    this.track('Software-Inc-click', { 
                        project: 'Software-Inc-Print-Manager', 
                        url: href,
                        text: linkText,
                        repository: 'filippogrande/Software-Inc-Print-Manager'
                    }, 'project');
                    tracked = true;
                } else if (href.includes('github.com/filippogrande')) {
                    this.track('github-click', { 
                        platform: 'github-profile', 
                        url: href,
                        text: linkText,
                        profile: 'filippogrande'
                    }, 'social');
                    tracked = true;
                } else if (href.includes('github.com')) {
                    // Per altri repository GitHub, crea eventi specifici
                    const repoMatch = href.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
                    if (repoMatch) {
                        const [, owner, repo] = repoMatch;
                        const eventName = `${repo}-click`;
                        this.track(eventName, { 
                            project: repo,
                            owner: owner,
                            url: href,
                            text: linkText,
                            repository: `${owner}/${repo}`
                        }, 'project');
                    } else {
                        this.track('github-other-click', { 
                            url: href,
                            text: linkText
                        }, 'project');
                    }
                    tracked = true;
                } else if (href.includes('mailto:')) {
                    this.track('contact-email', { 
                        method: 'email', 
                        address: href.replace('mailto:', ''),
                        text: linkText 
                    }, 'contact');
                    tracked = true;
                } else {
                    this.track('outbound-link-click', { 
                        url: href, 
                        text: linkText,
                        domain: new URL(href).hostname
                    }, 'external');
                    tracked = true;
                }
                
                // Rimuovi log non necessario in produzione
            });
        });
    }

    /**
     * Setup Language Change Tracking
     */
    setupLanguageTracking() {
        // Flag per tracciare se la lingua è stata cambiata
        this.trackingConfig.languageChanged = false;
        
        // Debounce per evitare tracking multipli ravvicinati
        let languageChangeTimeout = null;
        let lastTrackedLanguage = null;
        
        // Ascolta eventi di cambio lingua
        document.addEventListener('languageChanged', (e) => {
            const { previousLanguage, newLanguage } = e.detail;
            
            // Validazione dati evento
            if (!newLanguage || newLanguage === previousLanguage) {
                return;
            }
            
            // Crea chiave semplice per confronto
            const changeKey = `${previousLanguage || 'unknown'}-to-${newLanguage}`;
            
            // Controlla se è lo stesso cambio dell'ultimo evento (entro 1 secondo)
            if (lastTrackedLanguage === changeKey) {
                return;
            }
            
            // Cancella timeout precedente se esiste
            if (languageChangeTimeout) {
                clearTimeout(languageChangeTimeout);
            }
            
            // Debounce: aspetta 500ms prima di trackare per evitare eventi multipli rapidi
            languageChangeTimeout = setTimeout(() => {
                // Segna che la lingua è stata cambiata
                this.trackingConfig.languageChanged = true;
                
                // Salva ultimo cambio tracciato
                lastTrackedLanguage = changeKey;
                
                // Track specifico per lingua di destinazione
                this.track(`lang-to-${newLanguage}`, {
                    from_language: previousLanguage || 'unknown',
                    to_language: newLanguage,
                    method: 'user_click',
                    timestamp: new Date().toISOString(),
                    session_id: this.trackingConfig.sessionId
                }, 'language');
                
                // Reset dopo 2 secondi per permettere nuovi cambi
                setTimeout(() => {
                    lastTrackedLanguage = null;
                }, 2000);
                
            }, 500); // 500ms di debounce
        });
    }

    /**
     * Inizializza tutti i sistemi di tracking
     */
    initializeAdvancedTracking() {
        if (this.trackingInitialized) {
            return;
        }
        
        // Aspetta che tutto sia pronto
        setTimeout(() => {
            this.setupScrollTracking();
            this.setupTimeTracking();
            this.setupLinkTracking();
            this.setupLanguageTracking();
            
            this.trackingInitialized = true;
        }, 1000); // Ridotto da 2000 a 1000ms
    }

    /**
     * Funzioni di test per debug
     */
    testTracking() {
        this.track('test-analytics', {
            test: 'manual',
            timestamp: new Date().toISOString(),
            source: 'analytics-manager'
        });
    }

    /**
     * Ottieni statistiche di tracking correnti
     */
    getTrackingStats() {
        return {
            umamiAvailable: this.umamiAvailable,
            scrollDepth: this.trackingConfig.scrollDepth,
            maxScrollReached: this.trackingConfig.maxScrollReached,
            timeOnPage: this.trackingConfig.timeOnPage,
            language: window.languageManager?.getCurrentLanguage() || 'unknown'
        };
    }

    /**
     * Inizializza il gestore analytics
     */
    initialize() {
        if (this.initialized) {
            return;
        }
        // L'inizializzazione avanzata ora avviene in onUmamiReady()
    }
}

// Crea istanza globale del gestore analytics (solo se non esiste già)
let analyticsManager;
if (!window.analyticsManagerInstance) {
    analyticsManager = new AnalyticsManager();
} else {
    analyticsManager = window.analyticsManagerInstance;
}

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.AnalyticsManager = AnalyticsManager; // Esporta la CLASSE
    window.analyticsManager = analyticsManager; // Esporta l'ISTANZA
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalyticsManager, analyticsManager };
}
