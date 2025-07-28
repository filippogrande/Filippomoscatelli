/**
 * Configuration Module
 * Gestisce tutte le configurazioni dell'applicazione
 */

// Configurazione principale dell'applicazione
const AppConfig = {
    // Informazioni generali
    app: {
        name: 'Filippo Moscatelli CV',
        version: '2.0.0',
        environment: 'production', // 'development' | 'production' | 'test'
        debug: false,
        author: 'Filippo Moscatelli',
        repository: 'https://github.com/filippogrande/Filippomoscatelli'
    },

    // Configurazione Umami Analytics
    analytics: {
        enabled: true,
        websiteId: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
        endpoints: {
            script: 'http://192.168.1.4:3000/script.js',
            api: '/analytics/api',
            proxy: 'http://192.168.1.100:8085/analytics'
        },
        tracking: {
            autoTrack: true,
            excludeSearch: false,
            excludeHash: true,
            doNotTrack: false,
            tag: 'cv-modular'
        },
        advanced: {
            scrollDepth: {
                enabled: true,
                milestones: [25, 50, 75, 90],
                throttle: 100 // ms
            },
            timeTracking: {
                enabled: true,
                interval: 15, // seconds
                milestones: [30, 60, 120, 300] // seconds
            },
            linkTracking: {
                enabled: true,
                external: true,
                downloads: true,
                mailto: true
            }
        }
    },

    // Configurazione lingue
    language: {
        default: 'it',
        supported: ['it', 'en'],
        fallback: 'it',
        storageKey: 'preferred-language',
        autoDetect: true,
        keyboard: {
            enabled: true,
            shortcuts: {
                italian: 'Alt+I',
                english: 'Alt+E'
            }
        }
    },

    // Configurazione UI ed effetti
    ui: {
        theme: {
            name: 'modern',
            darkMode: false,
            animations: true,
            transitions: true
        },
        effects: {
            typewriter: {
                enabled: true,
                speed: 100, // ms per carattere
                delay: 500 // ms ritardo iniziale
            },
            fadeIn: {
                enabled: true,
                duration: 600, // ms
                easing: 'ease-out'
            },
            hover: {
                enabled: true,
                scale: 1.05,
                duration: 200 // ms
            }
        },
        responsive: {
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1440
            }
        }
    },

    // Configurazione performance
    performance: {
        lazyLoading: {
            enabled: true,
            threshold: 0.1,
            rootMargin: '50px'
        },
        debounce: {
            scroll: 16, // ms (~60fps)
            resize: 250, // ms
            input: 300 // ms
        },
        caching: {
            localStorage: true,
            sessionStorage: true,
            maxAge: 86400000 // 24 ore in ms
        }
    },

    // Configurazione SEO e metadati
    seo: {
        siteName: 'Filippo Moscatelli',
        defaultTitle: 'Filippo Moscatelli - CV',
        titleTemplate: 'Filippo Moscatelli - %s',
        description: {
            it: 'CV di Filippo Moscatelli, studente in Informatica per la Comunicazione Digitale',
            en: 'Filippo Moscatelli CV, Computer Science for Digital Communication student'
        },
        keywords: ['CV', 'Resume', 'Computer Science', 'Web Development', 'Self-hosted'],
        author: 'Filippo Moscatelli',
        canonical: 'https://filippomoscatelli.it',
        openGraph: {
            type: 'website',
            locale: 'it_IT',
            siteName: 'Filippo Moscatelli CV'
        }
    },

    // Configurazione API e servizi esterni
    services: {
        fonts: {
            google: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        },
        flags: {
            baseUrl: 'https://flagcdn.com',
            size: '24x18'
        }
    },

    // Configurazione contatti e social
    contact: {
        email: 'filipp28mo@gmail.com',
        location: {
            it: 'Milano, Italia',
            en: 'Milan, Italy'
        },
        social: {
            linkedin: 'https://linkedin.com/in/filippo-moscatelli',
            github: 'https://github.com/filippogrande',
            email: 'mailto:filipp28mo@gmail.com'
        }
    },

    // Configurazione progetti
    projects: {
        featured: [
            {
                id: 'cv-website',
                github: null, // Questo progetto
                demo: null,
                featured: true
            },
            {
                id: 'software-inc-print-manager',
                github: 'https://github.com/filippogrande/Software-Inc-Print-Manager',
                demo: null,
                featured: true
            },
            {
                id: 'nao-challenge-2020',
                github: null,
                demo: null,
                featured: true
            }
        ]
    },

    // Configurazione debug e sviluppo
    debug: {
        console: {
            enabled: true,
            level: 'info', // 'error' | 'warn' | 'info' | 'debug'
            timestamps: true,
            colors: true
        },
        performance: {
            monitoring: false,
            timing: false
        },
        easter: {
            enabled: true,
            commands: true,
            welcome: true
        }
    }
};

// Classe per gestire la configurazione
class ConfigManager {
    constructor() {
        this.config = AppConfig;
        this.initialized = false;
        this.environment = this.detectEnvironment();
        
        this.applyEnvironmentConfig();
    }

    /**
     * Rileva l'ambiente di esecuzione
     * @returns {string} Ambiente rilevato
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.')) {
            return 'development';
        } else if (hostname.includes('test') || hostname.includes('staging')) {
            return 'test';
        } else {
            return 'production';
        }
    }

    /**
     * Applica configurazioni specifiche per ambiente
     */
    applyEnvironmentConfig() {
        //console.log(`⚙️ Environment detected: ${this.environment}`);
        
        // Configurazioni per sviluppo
        if (this.environment === 'development') {
            this.config.app.debug = true;
            this.config.debug.console.enabled = true;
            this.config.debug.console.level = 'debug';
            this.config.debug.performance.monitoring = true;
            this.config.analytics.tracking.tag = 'cv-dev';
            //console.log('⚙️ Development mode enabled');
        }
        
        // Configurazioni per test
        if (this.environment === 'test') {
            this.config.analytics.enabled = false;
            this.config.debug.console.level = 'warn';
            //console.log('⚙️ Test mode enabled');
        }
        
        // Configurazioni per produzione
        if (this.environment === 'production') {
            this.config.app.debug = false;
            this.config.debug.console.level = 'error';
            this.config.debug.performance.monitoring = false;
            this.config.analytics.tracking.tag = 'cv-prod';
            //console.log('⚙️ Production mode enabled');
        }
    }

    /**
     * Ottiene un valore di configurazione
     * @param {string} path - Percorso della configurazione (es: 'analytics.websiteId')
     * @param {*} defaultValue - Valore di default se non trovato
     * @returns {*} Valore di configurazione
     */
    get(path, defaultValue = null) {
        const keys = path.split('.');
        let value = this.config;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`⚙️ Configuration path not found: ${path}`);
                return defaultValue;
            }
        }
        
        return value;
    }

    /**
     * Imposta un valore di configurazione
     * @param {string} path - Percorso della configurazione
     * @param {*} value - Nuovo valore
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.config;
        
        for (const key of keys) {
            if (!(key in target) || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        
        target[lastKey] = value;
        //console.log(`⚙️ Configuration updated: ${path} = ${value}`);
    }

    /**
     * Verifica se una feature è abilitata
     * @param {string} feature - Nome della feature
     * @returns {boolean} True se abilitata
     */
    isEnabled(feature) {
        const value = this.get(feature);
        return Boolean(value);
    }

    /**
     * Ottiene la configurazione per un modulo specifico
     * @param {string} module - Nome del modulo
     * @returns {object} Configurazione del modulo
     */
    getModuleConfig(module) {
        return this.get(module, {});
    }

    /**
     * Ottiene informazioni sull'ambiente
     * @returns {object} Informazioni ambiente
     */
    getEnvironmentInfo() {
        return {
            environment: this.environment,
            debug: this.config.app.debug,
            version: this.config.app.version,
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            userAgent: navigator.userAgent
        };
    }

    /**
     * Esporta la configurazione corrente
     * @returns {object} Configurazione completa
     */
    export() {
        return JSON.parse(JSON.stringify(this.config));
    }

    /**
     * Importa una configurazione
     * @param {object} newConfig - Nuova configurazione
     */
    import(newConfig) {
        if (typeof newConfig === 'object' && newConfig !== null) {
            this.config = { ...this.config, ...newConfig };
            //console.log('⚙️ Configuration imported');
        } else {
            console.error('⚙️ Invalid configuration object');
        }
    }

    /**
     * Reset della configurazione ai valori di default
     */
    reset() {
        this.config = JSON.parse(JSON.stringify(AppConfig));
        this.applyEnvironmentConfig();
        //console.log('⚙️ Configuration reset to defaults');
    }

    /**
     * Inizializza il gestore configurazione
     */
    initialize() {
        if (this.initialized) {
            //console.log('⚙️ ConfigManager already initialized');
            return;
        }

        //console.log('⚙️ Initializing ConfigManager...');
        
        // Log delle configurazioni principali
        if (this.config.app.debug) {
            /*console.log('⚙️ Configuration loaded:', {
                app: this.config.app,
                environment: this.environment,
                analytics: this.config.analytics.enabled,
                language: this.config.language.default,
                ui: this.config.ui.theme.name
            });*/
        }
        
        this.initialized = true;
    }
}

// Crea istanza globale del gestore configurazione
const configManager = new ConfigManager();

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.ConfigManager = ConfigManager; // Esporta la CLASSE
    window.configManager = configManager; // Esporta l'ISTANZA
    window.AppConfig = AppConfig; // Per compatibilità
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConfigManager, configManager, AppConfig };
}

