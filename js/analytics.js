/**
 * Analytics and Tracking Module
 * Gestisce Umami analytics e tracking avanzato per sviluppo e produzione
 */

class AnalyticsManager {
    constructor() {
        this.umamiAvailable = false;
        this.websiteId = 'a912f285-ced0-4c7f-9260-434d0ee8674a';
        this.initialized = false;
        this.trackingInitialized = false;
        this.environment = this.detectEnvironment();
        this.trackingConfig = {
            scrollDepth: {
                25: false,
                50: false,
                75: false,
                90: false
            },
            maxScrollReached: 0,
            scrollStartTime: Date.now(),
            timeOnPage: 0,
            timeInterval: null,
            sessionId: this.generateSessionId(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            languageChanged: false // Flag per tracciare cambio lingua
        };
        
        console.log(`📊 AnalyticsManager: Initialized for ${this.environment}`);
        this.checkUmamiAvailability();
        this.setupPrivacyCompliance();
    }

    /**
     * Rileva l'ambiente (sviluppo/produzione)
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            hostname.includes('192.168.')) {
            return 'development';
        }
        return 'production';
    }

    /**
     * Genera un session ID unico
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Setup per conformità GDPR/Privacy
     */
    setupPrivacyCompliance() {
        // Controlla Do Not Track
        if (navigator.doNotTrack === '1' || 
            window.doNotTrack === '1' || 
            navigator.msDoNotTrack === '1') {
            console.log('🔒 Analytics: Do Not Track detected, limited tracking');
            this.trackingConfig.respectDNT = true;
        }

        // Controlla consent cookies (per produzione)
        if (this.environment === 'production') {
            this.checkCookieConsent();
        }
    }

    /**
     * Controlla il consenso ai cookies
     */
    checkCookieConsent() {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            console.log('🍪 Analytics: Waiting for cookie consent');
            return false;
        }
        return consent === 'accepted';
    }

    /**
     * Controlla la disponibilità di Umami
     */
    checkUmamiAvailability() {
        let checkCount = 0;
        const checker = setInterval(() => {
            checkCount++;
            this.umamiAvailable = typeof umami !== 'undefined';
            
            console.log(`🔍 Umami check #${checkCount}:`, {
                available: this.umamiAvailable,
                windowUmami: !!window.umami,
                timestamp: new Date().toISOString()
            });
            
            if (this.umamiAvailable || checkCount >= 10) {
                if (this.umamiAvailable) {
                    console.log('🎉 Umami became available!', umami);
                    this.onUmamiReady();
                } else {
                    console.log('⏰ Stopped checking, Umami not found after 10 seconds');
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
            console.log('📊 Umami already initialized, skipping duplicate setup');
            return;
        }
        
        // Flag globale per evitare inizializzazioni multiple
        if (window.analyticsInitialized) {
            console.log('📊 Analytics already initialized globally, skipping');
            return;
        }
        
        console.log('📊 Umami is ready, initializing advanced tracking...');
        
        // Track session start (una sola volta)
        this.track('session-start', {
            language: window.languageManager?.getCurrentLanguage() || 'it',
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString(),
            environment: this.environment,
            session_id: this.trackingConfig.sessionId
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
     * @param {string} tag - Tag per categorizzare l'evento
     */
    track(eventName, data = {}, tag = null) {
        // Log dettagliato pre-tracking
        console.log(`🎯 TRACK REQUEST:`, {
            event: eventName,
            tag: tag,
            data: data,
            umamiAvailable: this.umamiAvailable,
            timestamp: new Date().toISOString(),
            caller: new Error().stack?.split('\n')[2]?.trim() || 'unknown'
        });

        if (this.umamiAvailable && typeof umami !== 'undefined') {
            try {
                // Aggiungi tag ai dati se specificato
                if (tag) {
                    data.event_tag = tag;
                }
                
                // Aggiungi identificatori per debug
                data.debug_timestamp = new Date().toISOString();
                data.debug_session = this.trackingConfig.sessionId;
                
                if (typeof eventName === 'string') {
                    umami.track(eventName, data);
                    console.log(`✅ TRACKED: "${eventName}" ${tag ? `[${tag}]` : ''}`, {
                        data: data,
                        success: true
                    });
                } else {
                    umami.track(eventName); // Per pageview semplici
                    console.log('✅ TRACKED: pageview', { success: true });
                }
            } catch (error) {
                console.error('❌ TRACK ERROR:', {
                    event: eventName,
                    tag: tag,
                    error: error,
                    stack: error.stack
                });
            }
        } else {
            console.log(`❌ TRACK FAILED: "${eventName}" - Umami not available`, {
                umamiAvailable: this.umamiAvailable,
                umamiType: typeof umami,
                event: eventName,
                tag: tag
            });
        }
    }

    /**
     * Setup Scroll Depth Tracking
     */
    setupScrollTracking() {
        console.log('🎯 SCROLL SETUP: Setting up scroll depth tracking...');
        
        // Flag per tracking lingua a 25%
        let languageTrackedAt25Percent = false;
        
        const trackScrollDepth = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            console.log(`📏 SCROLL DEBUG:`, {
                scrollTop: scrollTop,
                docHeight: docHeight,
                scrollPercent: scrollPercent,
                maxReached: this.trackingConfig.maxScrollReached,
                languageChanged: this.trackingConfig.languageChanged,
                languageTracked25: languageTrackedAt25Percent
            });
            
            // Aggiorna massimo raggiunto
            if (scrollPercent > this.trackingConfig.maxScrollReached) {
                this.trackingConfig.maxScrollReached = scrollPercent;
            }
            
            // Track lingua corrente a 25% scroll (se non già fatto e lingua non cambiata)
            if (scrollPercent >= 25 && !languageTrackedAt25Percent && !this.trackingConfig.languageChanged) {
                languageTrackedAt25Percent = true;
                const currentLang = window.languageManager?.getCurrentLanguage() || 'it';
                
                console.log(`🌐 LANG AT 25%: Tracking current language at 25% scroll`, {
                    language: currentLang,
                    scrollPercent: scrollPercent,
                    languageChanged: this.trackingConfig.languageChanged
                });
                
                this.track(`lang-current-${currentLang}`, {
                    language: currentLang,
                    scroll_percentage: scrollPercent,
                    timestamp: new Date().toISOString(),
                    method: 'scroll_25_percent',
                    language_changed: false
                }, 'language');
            }
            
            // Track milestone specifiche con percentuale
            Object.keys(this.trackingConfig.scrollDepth).forEach(depth => {
                if (scrollPercent >= parseInt(depth) && !this.trackingConfig.scrollDepth[depth]) {
                    this.trackingConfig.scrollDepth[depth] = true;
                    const timeToReach = Math.round((Date.now() - this.trackingConfig.scrollStartTime) / 1000);
                    
                    console.log(`📊 SCROLL MILESTONE: ${depth}% reached`, {
                        percentage: depth,
                        scrollPercent: scrollPercent,
                        timeToReach: timeToReach,
                        maxReached: this.trackingConfig.maxScrollReached
                    });
                    
                    this.track(`scroll-depth-${depth}`, { 
                        percentage: parseInt(depth),
                        time_to_reach: timeToReach,
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
                    total_time_on_page: Math.round((Date.now() - this.trackingConfig.scrollStartTime) / 1000),
                    language: window.languageManager?.getCurrentLanguage() || 'it'
                }, 'scroll');
            }
        });
    }

    /**
     * Setup Time Tracking
     */
    setupTimeTracking() {
        console.log('⏱️ Setting up time tracking...');
        
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
                console.log(`✅ Time milestone: ${milestoneLabel} (${this.trackingConfig.timeOnPage}s total) [time]`);
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
        console.log('🔗 Setting up link tracking...');
        
        // Trova tutti i link cliccabili
        const allLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"]');
        console.log(`Found ${allLinks.length} trackable links:`, 
            Array.from(allLinks).map(link => ({ href: link.href, text: link.textContent.trim() }))
        );
        
        // Track clicks sui link esterni
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = e.target.href;
                const linkText = e.target.textContent.trim();
                
                console.log('Link clicked:', { href, linkText, element: e.target });
                
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
                
                if (!tracked) {
                    console.log('⚠️ Link not tracked:', { href, linkText });
                }
            });
        });
    }

    /**
     * Setup Language Change Tracking
     */
    setupLanguageTracking() {
        console.log('🌐 Setting up language change tracking...');
        
        // Flag per tracciare se la lingua è stata cambiata
        this.trackingConfig.languageChanged = false;
        
        // Ascolta eventi di cambio lingua
        document.addEventListener('languageChanged', (e) => {
            const { previousLanguage, newLanguage } = e.detail;
            
            if (previousLanguage !== newLanguage) {
                // Segna che la lingua è stata cambiata
                this.trackingConfig.languageChanged = true;
                
                // Track specifico per lingua di destinazione
                this.track(`lang-to-${newLanguage}`, {
                    from_language: previousLanguage,
                    to_language: newLanguage,
                    method: 'user_click',
                    timestamp: new Date().toISOString(),
                    session_id: this.trackingConfig.sessionId
                }, 'language');
                console.log(`✅ Language change tracked: lang-to-${newLanguage} (from ${previousLanguage}) [language]`);
            } else {
                console.log(`⚠️ No language change detected: ${previousLanguage} → ${newLanguage}`);
            }
        });
    }

    /**
     * Inizializza tutti i sistemi di tracking
     */
    initializeAdvancedTracking() {
        if (this.trackingInitialized) {
            console.log('🚀 Advanced tracking already initialized');
            return;
        }
        
        console.log('🚀 Initializing advanced tracking...');
        
        // Aspetta che tutto sia pronto
        setTimeout(() => {
            this.setupScrollTracking();
            this.setupTimeTracking();
            this.setupLinkTracking();
            this.setupLanguageTracking();
            
            this.trackingInitialized = true;
            console.log('🎉 Advanced tracking initialized successfully!');
        }, 1000); // Ridotto da 2000 a 1000ms
    }

    /**
     * Funzioni di test per debug
     */
    testTracking() {
        console.log('🧪 Testing analytics tracking...');
        
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
            console.log('📊 AnalyticsManager already initialized');
            return;
        }

        console.log('📊 Initializing AnalyticsManager...');
        // L'inizializzazione avanzata ora avviene in onUmamiReady()
        console.log('📊 AnalyticsManager basic setup completed');
    }
}

// Crea istanza globale del gestore analytics
const analyticsManager = new AnalyticsManager();

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.AnalyticsManager = AnalyticsManager; // Esporta la CLASSE
    window.analyticsManager = analyticsManager; // Esporta l'ISTANZA
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalyticsManager, analyticsManager };
}

console.log('📊 Analytics module loaded successfully');
