/**
 * User Interface Module
 * Gestisce tutti gli aspetti dell'interfaccia utente, interazioni e componenti
 */

class UIManager {
    constructor() {
        this.initialized = false;
        this.themes = new Map();
        this.currentTheme = 'modern';
        this.responsive = {
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1440
            },
            current: 'desktop'
        };
        
        this.setupResponsiveDetection();
    }

    // ===== GESTIONE RESPONSIVA =====

    /**
     * Setup del rilevamento responsivo
     */
    setupResponsiveDetection() {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            let newBreakpoint;
            
            if (width < this.responsive.breakpoints.mobile) {
                newBreakpoint = 'mobile';
            } else if (width < this.responsive.breakpoints.tablet) {
                newBreakpoint = 'tablet';
            } else {
                newBreakpoint = 'desktop';
            }
            
            if (newBreakpoint !== this.responsive.current) {
                const oldBreakpoint = this.responsive.current;
                this.responsive.current = newBreakpoint;
                this.onBreakpointChange(oldBreakpoint, newBreakpoint);
            }
        };
        
        // Controllo iniziale
        updateBreakpoint();
        
        // Listener per resize con debounce
        const debouncedUpdate = window.utils?.debounce(updateBreakpoint, 250) || updateBreakpoint;
        window.addEventListener('resize', debouncedUpdate);
    }

    /**
     * Callback per cambio breakpoint
     * @param {string} oldBreakpoint - Breakpoint precedente
     * @param {string} newBreakpoint - Nuovo breakpoint
     */
    onBreakpointChange(oldBreakpoint, newBreakpoint) {
        
        // Emetti evento personalizzato
        const event = new CustomEvent('breakpointChanged', {
            detail: { oldBreakpoint, newBreakpoint, width: window.innerWidth }
        });
        document.dispatchEvent(event);
        
        // Aggiorna classi CSS
        document.body.classList.remove(`breakpoint-${oldBreakpoint}`);
        document.body.classList.add(`breakpoint-${newBreakpoint}`);
        
        // Track in analytics se disponibile
        if (window.analyticsManager) {
            window.analyticsManager.track('breakpoint-change', {
                from: oldBreakpoint,
                to: newBreakpoint,
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
    }

    // ===== GESTIONE TEMA =====

    /**
     * Registra un nuovo tema
     * @param {string} name - Nome del tema
     * @param {object} config - Configurazione del tema
     */
    registerTheme(name, config) {
        this.themes.set(name, config);
    }

    /**
     * Cambia tema
     * @param {string} themeName - Nome del tema
     */
    changeTheme(themeName) {
        if (!this.themes.has(themeName)) {
            console.error(`🎨 Theme not found: ${themeName}`);
            return false;
        }
        
        const oldTheme = this.currentTheme;
        this.currentTheme = themeName;
        
        // Rimuovi classe tema precedente
        document.body.classList.remove(`theme-${oldTheme}`);
        
        // Aggiungi nuova classe tema
        document.body.classList.add(`theme-${themeName}`);
        
        // Salva preferenza
        if (window.utils) {
            window.utils.setStorage('preferred-theme', themeName);
        }
        
        
        // Emetti evento
        const event = new CustomEvent('themeChanged', {
            detail: { oldTheme, newTheme: themeName }
        });
        document.dispatchEvent(event);
        
        return true;
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const isDark = document.body.classList.contains('dark-mode');
        
        if (isDark) {
            document.body.classList.remove('dark-mode');
            if (window.utils) {
                window.utils.setStorage('dark-mode', false);
            }
        } else {
            document.body.classList.add('dark-mode');
            if (window.utils) {
                window.utils.setStorage('dark-mode', true);
            }
        }
        
        
        // Track in analytics
        if (window.analyticsManager) {
            window.analyticsManager.track('dark-mode-toggle', {
                enabled: !isDark
            });
        }
        
        return !isDark;
    }









    // ===== GESTIONE FOCUS E ACCESSIBILITÀ =====

    /**
     * Gestione del focus per accessibilità
     */
    setupAccessibility() {
        
        // Skip link per navigazione da tastiera (DISABILITATO)
        // this.createSkipLink();
        
        // Focus visible per navigazione da tastiera
        this.setupFocusVisible();
        
        // ARIA live regions per annunci screen reader
        this.createLiveRegions();
        
    }



    /**
     * Setup focus visible per navigazione da tastiera
     */
    setupFocusVisible() {
        let hadKeyboardEvent = true;
        let keyboardThrottleTimeout;
        
        const pointerEvent = (e) => {
            hadKeyboardEvent = false;
        };
        
        const keyboardEvent = (e) => {
            if (e.metaKey || e.altKey || e.ctrlKey) return;
            hadKeyboardEvent = true;
        };
        
        const focusEvent = (e) => {
            if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
                e.target.classList.add('focus-visible');
            }
        };
        
        const blurEvent = (e) => {
            e.target.classList.remove('focus-visible');
        };
        
        document.addEventListener('keydown', keyboardEvent, true);
        document.addEventListener('mousedown', pointerEvent, true);
        document.addEventListener('pointerdown', pointerEvent, true);
        document.addEventListener('touchstart', pointerEvent, true);
        document.addEventListener('focus', focusEvent, true);
        document.addEventListener('blur', blurEvent, true);
    }

    /**
     * Crea regioni live per screen reader
     */
    createLiveRegions() {
        // Regione per annunci cortesi
        const politeRegion = window.utils?.createElement('div', {
            'aria-live': 'polite',
            'aria-atomic': 'true',
            className: 'sr-only live-region-polite'
        });
        
        // Regione per annunci assertivi
        const assertiveRegion = window.utils?.createElement('div', {
            'aria-live': 'assertive',
            'aria-atomic': 'true',
            className: 'sr-only live-region-assertive'
        });
        
        document.body.appendChild(politeRegion);
        document.body.appendChild(assertiveRegion);
        
        // Salva riferimenti per uso futuro
        this.liveRegions = {
            polite: politeRegion,
            assertive: assertiveRegion
        };
    }



    // ===== INIZIALIZZAZIONE =====

    /**
     * Inizializza il gestore UI
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        
        // Carica configurazione
        const config = window.configManager?.getModuleConfig('ui') || {};
        
        // Applica tema salvato o di default
        const savedTheme = window.utils?.getStorage('preferred-theme') || config.theme?.name || 'modern';
        this.registerTheme('modern', { name: 'modern' });
        this.changeTheme(savedTheme);
        
        // Applica dark mode se salvato
        const savedDarkMode = window.utils?.getStorage('dark-mode');
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Setup accessibilità
        this.setupAccessibility();
        
        // Aggiungi classe breakpoint iniziale
        document.body.classList.add(`breakpoint-${this.responsive.current}`);
        
        this.initialized = true;
        
        // Track initialization
        if (window.analyticsManager) {
            window.analyticsManager.track('ui-initialized', {
                theme: this.currentTheme,
                breakpoint: this.responsive.current,
                darkMode: document.body.classList.contains('dark-mode')
            });
        }
    }

    /**
     * Cleanup del gestore UI
     */
    cleanup() {
        // Cleanup base - al momento nessuna operazione richiesta
    }


}

// Crea istanza globale del gestore UI
const uiManager = new UIManager();

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.UIManager = UIManager; // Esporta la CLASSE
    window.uiManager = uiManager; // Esporta l'ISTANZA
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager, uiManager };
}

