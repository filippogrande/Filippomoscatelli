/**
 * Main Application Module
 * Coordina tutti i moduli e gestisce l'inizializzazione dell'applicazione
 */

class AppManager {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        this.debugMode = false;
        
        
        // Bind dei metodi per event listeners
        this.handleError = this.handleError.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
    }

    /**
     * Registra un modulo nell'applicazione
     * @param {string} name - Nome del modulo
     * @param {object} module - Istanza del modulo
     */
    registerModule(name, module) {
        if (module && typeof module.initialize === 'function') {
            this.modules.set(name, module);
        } else {
            console.error(`❌ Module "${name}" is invalid - missing initialize method`);
        }
    }

    /**
     * Inizializza tutti i moduli registrati
     */
    async initializeModules() {
        
        const initPromises = [];
        
        for (const [name, module] of this.modules) {
            try {
                console.log(`🔧 Initializing module: ${name}`);
                const result = module.initialize();
                
                // Se il modulo restituisce una Promise, la aggiungiamo all'array
                if (result instanceof Promise) {
                    initPromises.push(result);
                }
                
            } catch (error) {
                console.error(`❌ Error initializing module "${name}":`, error);
            }
        }
        
        // Aspetta che tutte le inizializzazioni async siano completate
        if (initPromises.length > 0) {
            try {
                await Promise.all(initPromises);
                console.log('✅ All async module initializations completed');
            } catch (error) {
                console.error('❌ Error in async module initialization:', error);
            }
        }
        
        console.log('🎉 All modules initialized successfully!');
    }

    /**
     * Setup dei gestori di errore globali
     */
    setupErrorHandlers() {
        console.log('🛡️ Setting up global error handlers...');
        
        // Gestione degli errori JavaScript
        window.addEventListener('error', this.handleError);
        
        // Gestione delle promesse non catturate
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
        
        console.log('🛡️ Error handlers setup completed');
    }

    /**
     * Gestisce gli errori JavaScript globali
     * @param {ErrorEvent} e - Evento di errore
     */
    handleError(e) {
        const errorInfo = {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error,
            stack: e.error ? e.error.stack : 'No stack trace',
            timestamp: new Date().toISOString()
        };
        
        console.error('❌ GLOBAL JAVASCRIPT ERROR:', errorInfo);
        
        // Track error in analytics se disponibile
        if (window.analyticsManager) {
            window.analyticsManager.track('javascript-error', {
                message: errorInfo.message,
                filename: errorInfo.filename,
                line: errorInfo.lineno,
                timestamp: errorInfo.timestamp
            });
        }
    }

    /**
     * Gestisce le promesse non catturate
     * @param {PromiseRejectionEvent} e - Evento di promise rejection
     */
    handleUnhandledRejection(e) {
        const errorInfo = {
            reason: e.reason,
            timestamp: new Date().toISOString()
        };
        
        console.error('❌ UNHANDLED PROMISE REJECTION:', errorInfo);
        
        // Track error in analytics se disponibile
        if (window.analyticsManager) {
            window.analyticsManager.track('promise-rejection', {
                reason: String(errorInfo.reason),
                timestamp: errorInfo.timestamp
            });
        }
    }

    /**
     * Setup delle funzioni di debug globali
     */
    setupDebugFunctions() {
        console.log('🔍 Setting up debug functions...');
        
        // Funzioni di test globali
        window.testLanguage = () => {
            if (window.languageManager) {
                const currentLang = window.languageManager.getCurrentLanguage();
                const newLang = currentLang === 'it' ? 'en' : 'it';
                window.languageManager.changeLanguage(newLang);
                console.log(`🧪 Test: Changed language from ${currentLang} to ${newLang}`);
            }
        };
        
        window.testAnalytics = () => {
            if (window.analyticsManager) {
                window.analyticsManager.testTracking();
                console.log('🧪 Test: Analytics tracking test executed');
            }
        };
        
        window.getAppStatus = () => {
            const status = {
                initialized: this.initialized,
                modules: Array.from(this.modules.keys()),
                language: window.languageManager?.getCurrentLanguage(),
                analytics: window.analyticsManager?.getTrackingStats(),
                timestamp: new Date().toISOString()
            };
            console.log('📊 App Status:', status);
            return status;
        };
        
        window.enableDebugMode = () => {
            this.debugMode = true;
            console.log('🔍 Debug mode enabled');
        };
        
        window.disableDebugMode = () => {
            this.debugMode = false;
            console.log('🔍 Debug mode disabled');
        };
        
        console.log('🔍 Debug functions setup completed');
    }

    /**
     * Mostra messaggio di benvenuto nella console
     */
    showWelcomeMessage() {
        console.log(`
    🚀 Benvenuto nel CV di Filippo Moscatelli!
    
    📱 Comandi disponibili nella console:
    • testLanguage() - Cambia lingua per test
    • testAnalytics() - Testa il tracking analytics
    • getAppStatus() - Mostra stato dell'applicazione
    • enableDebugMode() / disableDebugMode() - Abilita/disabilita debug
    
    ⌨️ Scorciatoie da tastiera:
    • Alt + I: Cambia in Italiano
    • Alt + E: Cambia in Inglese
    
    🛠️ Moduli caricati: ${Array.from(this.modules.keys()).join(', ')}
    
    📊 Versione: 2.0.0 (Modular)
    🕒 Caricato: ${new Date().toLocaleString('it-IT')}
    
    Grazie per aver visitato il mio CV! 🎉
        `);
    }

    /**
     * Inizializzazione principale dell'applicazione
     */
    async initialize() {
        if (this.initialized) {
            console.log('🚀 AppManager already initialized');
            return;
        }

        console.log('🚀 Starting application initialization...');
        console.log('🕒 Timestamp:', new Date().toISOString());
        console.log('🌐 URL:', window.location.href);
        console.log('📱 User Agent:', navigator.userAgent);
        console.log('📄 Document State:', document.readyState);
        
        // Setup gestori di errore prima di tutto
        this.setupErrorHandlers();
        
        // Setup funzioni di debug
        this.setupDebugFunctions();
        
        // Registra i moduli disponibili
        this.registerAvailableModules();
        
        // Inizializza tutti i moduli
        await this.initializeModules();
        
        // Mostra messaggio di benvenuto
        this.showWelcomeMessage();
        
        this.initialized = true;
        console.log('🎉 Application initialization completed successfully!');
        
        // Track application start
        if (window.analyticsManager) {
            window.analyticsManager.track('app-initialized', {
                timestamp: new Date().toISOString(),
                modules: Array.from(this.modules.keys()),
                version: '2.0.0'
            });
        }
    }

    /**
     * Registra tutti i moduli disponibili
     */
    registerAvailableModules() {
        console.log('� Registering available modules...');
        
        // Registra i moduli in ordine di dipendenza
        if (window.ConfigManager) {
            this.registerModule('config', new window.ConfigManager());
        }
        
        if (window.Utils) {
            this.registerModule('utils', new window.Utils());
        }
        
        if (window.CSSManager) {
            this.registerModule('css', new window.CSSManager());
        }
        
        if (window.ComponentsManager) {
            this.registerModule('components', new window.ComponentsManager());
        }
        
        if (window.LanguageManager) {
            this.registerModule('language', new window.LanguageManager());
        }
        
        if (window.AnalyticsManager) {
            this.registerModule('analytics', new window.AnalyticsManager());
        }
        
        if (window.EffectsManager) {
            this.registerModule('effects', new window.EffectsManager());
        }
        
        if (window.UIManager) {
            this.registerModule('ui', new window.UIManager());
        }
        
        console.log(`✅ Registered ${this.modules.size} modules`);
    }

    /**
     * Ottiene informazioni sui moduli
     */
    getModuleInfo() {
        const moduleInfo = {};
        
        for (const [name, module] of this.modules) {
            moduleInfo[name] = {
                initialized: module.initialized || false,
                available: true
            };
        }
        
        return moduleInfo;
    }

    /**
     * Cleanup dell'applicazione
     */
    cleanup() {
        console.log('🧹 Cleaning up application...');
        
        // Cleanup dei moduli
        for (const [name, module] of this.modules) {
            if (typeof module.cleanup === 'function') {
                try {
                    module.cleanup();
                    console.log(`🧹 Module "${name}" cleaned up`);
                } catch (error) {
                    console.error(`❌ Error cleaning up module "${name}":`, error);
                }
            }
        }
        
        // Rimuovi event listeners
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
        
        console.log('🧹 Application cleanup completed');
    }
}

// Crea istanza globale dell'app manager
const appManager = new AppManager();

// Inizializzazione semplice dell'applicazione
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        appManager.initialize();
    });
} else {
    // DOM già pronto, inizializza subito
    appManager.initialize();
}

// Cleanup quando la pagina viene scaricata
window.addEventListener('beforeunload', () => {
    appManager.cleanup();
});

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.appManager = appManager;
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppManager, appManager };
}

console.log('🚀 Main application module loaded successfully');
