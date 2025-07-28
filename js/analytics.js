/**
 * Analytics and Tracking Module
 * Gestisce Umami analytics e tracking avanzato per sviluppo e produzione
 */

class AnalyticsManager {
    constructor() {
        this.umamiAvailable = false;
        this.websiteId = 'a912f285-ced0-4c7f-9260-434d0ee8674a';
        this.initialized = false;
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
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
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
        console.log('📊 Umami is ready, initializing advanced tracking...');
        
        // Track session start
        this.track('session-start', {
            language: window.languageManager?.getCurrentLanguage() || 'it',
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Wrapper per umami.track con fallback
     * @param {string} eventName - Nome evento
     * @param {object} data - Dati evento
     */
    track(eventName, data = {}) {
        if (this.umamiAvailable && typeof umami !== 'undefined') {
            try {
                if (typeof eventName === 'string') {
                    umami.track(eventName, data);
                    console.log(`✅ Analytics: Tracked "${eventName}"`, data);
                } else {
                    umami.track(eventName); // Per pageview semplici
                    console.log('✅ Analytics: Tracked pageview');
                }
            } catch (error) {
                console.error('❌ Analytics: Error tracking event:', error);
            }
        } else {
            console.log(`❌ Analytics: Umami not available, cannot track "${eventName}"`);
        }
    }

    /**
     * Setup Scroll Depth Tracking
     */
    setupScrollTracking() {
        console.log('🎯 Setting up scroll depth tracking...');
        
        const trackScrollDepth = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            // Aggiorna massimo raggiunto
            if (scrollPercent > this.trackingConfig.maxScrollReached) {
                this.trackingConfig.maxScrollReached = scrollPercent;
            }
            
            // Track milestone specifiche
            Object.keys(this.trackingConfig.scrollDepth).forEach(depth => {
                if (scrollPercent >= parseInt(depth) && !this.trackingConfig.scrollDepth[depth]) {
                    this.trackingConfig.scrollDepth[depth] = true;
                    const timeToReach = Math.round((Date.now() - this.trackingConfig.scrollStartTime) / 1000);
                    
                    this.track('scroll-depth', { 
                        percentage: parseInt(depth),
                        time_to_reach: timeToReach,
                        max_reached: this.trackingConfig.maxScrollReached,
                        language: window.languageManager?.getCurrentLanguage() || 'it'
                    });
                    console.log(`✅ Scroll ${depth}% tracked (${timeToReach}s)`);
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
                });
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
            
            // Track milestone specifiche: 30s, 1min, 2min, 5min
            if ([30, 60, 120, 300].includes(this.trackingConfig.timeOnPage)) {
                this.track('time-milestone', { 
                    seconds: this.trackingConfig.timeOnPage,
                    minutes: Math.round(this.trackingConfig.timeOnPage / 60),
                    language: window.languageManager?.getCurrentLanguage() || 'it',
                    timestamp: new Date().toISOString()
                });
                console.log(`✅ Time milestone: ${this.trackingConfig.timeOnPage}s (${Math.round(this.trackingConfig.timeOnPage/60)}min)`);
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
                    this.track('social-click', { platform: 'linkedin', text: linkText });
                    tracked = true;
                } else if (href.includes('mailto:filipp28mo@gmail.com')) {
                    this.track('contact-email', { method: 'email', address: 'filipp28mo@gmail.com' });
                    tracked = true;
                } else if (href.includes('github.com/filippogrande/Software-Inc-Print-Manager')) {
                    this.track('project-click', { 
                        project: 'software-inc-print-manager', 
                        url: href,
                        text: linkText 
                    });
                    tracked = true;
                } else if (href.includes('github.com/filippogrande')) {
                    this.track('social-click', { 
                        platform: 'github-profile', 
                        url: href,
                        text: linkText 
                    });
                    tracked = true;
                } else if (href.includes('github.com')) {
                    this.track('project-click', { 
                        project: 'github-other', 
                        url: href,
                        text: linkText 
                    });
                    tracked = true;
                } else if (href.includes('mailto:')) {
                    this.track('contact-email', { 
                        method: 'email', 
                        address: href.replace('mailto:', ''),
                        text: linkText 
                    });
                    tracked = true;
                } else {
                    this.track('external-click', { 
                        url: href, 
                        text: linkText,
                        domain: new URL(href).hostname
                    });
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
        
        // Ascolta eventi di cambio lingua
        document.addEventListener('languageChanged', (e) => {
            const { previousLanguage, newLanguage } = e.detail;
            
            if (previousLanguage !== newLanguage) {
                this.track('lang-change', {
                    from_language: previousLanguage,
                    to_language: newLanguage,
                    method: 'language_manager',
                    timestamp: new Date().toISOString()
                });
                console.log(`✅ Language change tracked: ${previousLanguage} → ${newLanguage}`);
            }
        });
    }

    /**
     * Inizializza tutti i sistemi di tracking
     */
    initializeAdvancedTracking() {
        console.log('🚀 Initializing advanced tracking...');
        
        // Aspetta che tutto sia pronto
        setTimeout(() => {
            this.setupScrollTracking();
            this.setupTimeTracking();
            this.setupLinkTracking();
            this.setupLanguageTracking();
            
            console.log('🎉 Advanced tracking initialized successfully!');
        }, 2000);
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
        
        // Inizializza tracking avanzato
        this.initializeAdvancedTracking();
        
        this.initialized = true;
        console.log('📊 AnalyticsManager initialized successfully');
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
