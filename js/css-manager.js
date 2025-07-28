/**
 * CSS Manager Module
 * Gestisce il caricamento dinamico dei moduli CSS
 */

class CSSManager {
    constructor() {
        this.loadedModules = new Set();
        this.baseUrl = './css/';
        
    }

    /**
     * Inizializza il CSS manager
     */
    initialize() {
        
        try {
            // Se esiste il CSS modulare, usa quello
            if (this.checkModularCSSAvailable()) {
                this.loadModularCSS();
            } else {
            }
            
            // Setup di funzionalità dinamiche
            this.setupThemeSupport();
            this.setupPrintOptimization();
            
            return Promise.resolve();
        } catch (error) {
            console.error('❌ CSSManager initialization failed:', error);
            return Promise.reject(error);
        }
    }

    /**
     * Controlla se i moduli CSS sono disponibili
     */
    checkModularCSSAvailable() {
        // Controlla se esiste la cartella css/
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = this.baseUrl + 'main.css';
        
        return new Promise((resolve) => {
            link.onload = () => resolve(true);
            link.onerror = () => resolve(false);
            document.head.appendChild(link);
        });
    }

    /**
     * Carica i moduli CSS in ordine
     */
    async loadModularCSS() {
        
        const modules = [
            'base.css',
            'language-selector.css',
            'header.css',
            'sections.css',
            'timeline.css',
            'components.css',
            'footer.css',
            'animations.css',
            'responsive.css'
        ];

        try {
            // Rimuovi il CSS legacy se presente
            this.removeLegacyCSS();
            
            // Carica i moduli CSS
            for (const module of modules) {
                await this.loadCSSModule(module);
            }
            
        } catch (error) {
            console.error('❌ Error loading CSS modules:', error);
            // Fallback al CSS legacy
            this.loadLegacyCSS();
        }
    }

    /**
     * Carica un singolo modulo CSS
     */
    loadCSSModule(moduleName) {
        return new Promise((resolve, reject) => {
            if (this.loadedModules.has(moduleName)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = this.baseUrl + moduleName;
            link.dataset.module = moduleName;

            link.onload = () => {
                this.loadedModules.add(moduleName);
                resolve();
            };

            link.onerror = () => {
                console.error(`❌ Failed to load CSS module: ${moduleName}`);
                reject(new Error(`Failed to load ${moduleName}`));
            };

            document.head.appendChild(link);
        });
    }

    /**
     * Rimuove il CSS legacy
     */
    removeLegacyCSS() {
        const legacyLink = document.querySelector('link[href*="styles.css"]');
        if (legacyLink) {
            legacyLink.remove();
        }
    }

    /**
     * Carica il CSS legacy come fallback
     */
    loadLegacyCSS() {
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles.css';
        link.dataset.fallback = 'true';
        
        document.head.appendChild(link);
    }

    /**
     * Setup del supporto per i temi
     */
    setupThemeSupport() {
        // Prepara per supporto temi futuri
        document.documentElement.setAttribute('data-theme', 'default');
        
        // Rileva preferenze del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-system-theme', 'dark');
        }
    }

    /**
     * Ottimizzazioni per la stampa
     */
    setupPrintOptimization() {
        window.addEventListener('beforeprint', () => {
            document.body.classList.add('printing');
        });

        window.addEventListener('afterprint', () => {
            document.body.classList.remove('printing');
        });
    }
}

// Rendi disponibile globalmente
window.CSSManager = CSSManager;
