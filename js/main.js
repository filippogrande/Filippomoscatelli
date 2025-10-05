/**
 * Main Application Module
 * Coordina tutti i moduli e gestisce l'inizializzazione dell'applicazione
 */

class AppManager {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        
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
            console.debug(`AppManager: registered module "${name}"`);
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
            } catch (error) {
                console.error('❌ Error in async module initialization:', error);
            }
        }
    }

    /**
     * Setup dei gestori di errore globali
     */
    setupErrorHandlers() {
        // Gestione errori JavaScript globali
        window.addEventListener('error', this.handleError);
        
        // Gestione delle promesse non catturate
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
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
     * Inizializzazione principale dell'applicazione
     */
    async initialize() {
        if (this.initialized) {
            return;
        }

        // Setup gestori di errore prima di tutto
        this.setupErrorHandlers();
        
        // Registra i moduli disponibili
        this.registerAvailableModules();
        
        // Diagnostic: lista moduli registrati
        try {
            console.debug('AppManager: modules registered ->', Array.from(this.modules.keys()));
        } catch (e) {
            console.debug('AppManager: unable to list modules', e);
        }

        // Inizializza tutti i moduli
        await this.initializeModules();
        
        this.initialized = true;
        
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
        
        // Projects manager: carica dinamicamente la lista progetti da JSON
        if (window.ProjectsManager) {
            this.registerModule('projects', new window.ProjectsManager());
        }
        
    }



    /**
     * Cleanup dell'applicazione
     */
    cleanup() {
        
        // Cleanup dei moduli
        for (const [name, module] of this.modules) {
            if (typeof module.cleanup === 'function') {
                try {
                    module.cleanup();
                } catch (error) {
                    console.error(`❌ Error cleaning up module "${name}":`, error);
                }
            }
        }
        
        // Rimuovi event listeners
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
        
    }
}

// Crea istanza globale dell'app manager
const appManager = new AppManager();

// Fallback: assicurati che il modulo 'projects' sia registrato anche se registerAvailableModules fallisce
if (!appManager.modules.has('projects') && typeof window !== 'undefined' && window.ProjectsManager) {
    try {
        appManager.registerModule('projects', new window.ProjectsManager());
        console.debug('AppManager: fallback registered "projects" module');
    } catch (e) {
        console.error('AppManager: failed to register fallback projects module', e);
    }
}

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

