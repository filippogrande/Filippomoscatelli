/**
 * User Interface Module
 * Gestisce tutti gli aspetti dell'interfaccia utente, interazioni e componenti
 */

class UIManager {
    constructor() {
        this.initialized = false;
        this.components = new Map();
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
        //console.log(`🎨 Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint}`);
        
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
        //console.log(`🎨 Theme registered: ${name}`);
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
        
        //console.log(`🎨 Theme changed: ${oldTheme} → ${themeName}`);
        
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
        
        //console.log(`🎨 Dark mode ${isDark ? 'disabled' : 'enabled'}`);
        
        // Track in analytics
        if (window.analyticsManager) {
            window.analyticsManager.track('dark-mode-toggle', {
                enabled: !isDark
            });
        }
        
        return !isDark;
    }

    // ===== GESTIONE COMPONENTI =====

    /**
     * Registra un componente UI
     * @param {string} name - Nome del componente
     * @param {object} component - Istanza del componente
     */
    registerComponent(name, component) {
        this.components.set(name, component);
        //console.log(`🎨 Component registered: ${name}`);
    }

    /**
     * Ottiene un componente registrato
     * @param {string} name - Nome del componente
     * @returns {object|null} Componente o null
     */
    getComponent(name) {
        return this.components.get(name) || null;
    }

    /**
     * Inizializza tutti i componenti registrati
     */
    initializeComponents() {
        //console.log('🎨 Initializing UI components...');
        
        for (const [name, component] of this.components) {
            try {
                if (typeof component.initialize === 'function') {
                    component.initialize();
                    //console.log(`🎨 Component "${name}" initialized`);
                }
            } catch (error) {
                console.error(`🎨 Error initializing component "${name}":`, error);
            }
        }
    }

    // ===== GESTIONE MODALI E OVERLAY =====

    /**
     * Mostra un modale
     * @param {string|Element} content - Contenuto del modale
     * @param {object} options - Opzioni del modale
     * @returns {Element} Elemento modale creato
     */
    showModal(content, options = {}) {
        const defaultOptions = {
            closeOnOverlay: true,
            closeOnEscape: true,
            showCloseButton: true,
            className: 'modal',
            backdrop: true
        };
        
        const opts = { ...defaultOptions, ...options };
        
        // Crea backdrop
        const backdrop = window.utils?.createElement('div', {
            className: 'modal-backdrop'
        });
        
        // Crea modale
        const modal = window.utils?.createElement('div', {
            className: opts.className,
            'aria-modal': 'true',
            role: 'dialog'
        });
        
        // Aggiungi contenuto
        if (typeof content === 'string') {
            modal.innerHTML = content;
        } else if (content instanceof Element) {
            modal.appendChild(content);
        }
        
        // Aggiungi pulsante chiusura se richiesto
        if (opts.showCloseButton) {
            const closeBtn = window.utils?.createElement('button', {
                className: 'modal-close',
                'aria-label': 'Chiudi modale'
            }, '×');
            
            closeBtn.addEventListener('click', () => this.closeModal(modal));
            modal.appendChild(closeBtn);
        }
        
        // Event listeners
        if (opts.closeOnOverlay) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.closeModal(modal);
                }
            });
        }
        
        if (opts.closeOnEscape) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        }
        
        // Aggiungi al DOM
        if (opts.backdrop) {
            document.body.appendChild(backdrop);
        }
        document.body.appendChild(modal);
        
        // Previeni scroll del body
        document.body.style.overflow = 'hidden';
        
        // Animazione di entrata
        requestAnimationFrame(() => {
            if (backdrop) backdrop.classList.add('show');
            modal.classList.add('show');
        });
        
        //console.log('🎨 Modal shown');
        return modal;
    }

    /**
     * Chiude un modale
     * @param {Element} modal - Elemento modale da chiudere
     */
    closeModal(modal) {
        if (!modal) return;
        
        const backdrop = document.querySelector('.modal-backdrop');
        
        // Animazione di uscita
        modal.classList.remove('show');
        if (backdrop) backdrop.classList.remove('show');
        
        // Rimuovi dopo animazione
        setTimeout(() => {
            modal.remove();
            if (backdrop) backdrop.remove();
            
            // Ripristina scroll del body
            document.body.style.overflow = '';
            
            //console.log('🎨 Modal closed');
        }, 300);
    }

    // ===== GESTIONE NOTIFICHE =====

    /**
     * Mostra una notifica toast
     * @param {string} message - Messaggio della notifica
     * @param {string} type - Tipo di notifica ('info', 'success', 'warning', 'error')
     * @param {number} duration - Durata in ms (0 per permanente)
     * @returns {Element} Elemento notifica
     */
    showNotification(message, type = 'info', duration = 5000) {
        // Crea container se non esiste
        let container = document.querySelector('.notifications-container');
        if (!container) {
            container = window.utils?.createElement('div', {
                className: 'notifications-container'
            });
            document.body.appendChild(container);
        }
        
        // Crea notifica
        const notification = window.utils?.createElement('div', {
            className: `notification notification-${type}`,
            role: 'alert'
        });
        
        // Aggiungi icona in base al tipo
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Chiudi notifica">×</button>
        `;
        
        // Event listener per chiusura
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));
        
        // Aggiungi al container
        container.appendChild(notification);
        
        // Animazione di entrata
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto-chiusura se richiesta
        if (duration > 0) {
            setTimeout(() => {
                this.closeNotification(notification);
            }, duration);
        }
        
        //console.log(`🎨 Notification shown: ${type} - ${message}`);
        return notification;
    }

    /**
     * Chiude una notifica
     * @param {Element} notification - Elemento notifica da chiudere
     */
    closeNotification(notification) {
        if (!notification) return;
        
        notification.classList.remove('show');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // ===== GESTIONE LOADING =====

    /**
     * Mostra indicatore di caricamento
     * @param {string} message - Messaggio di caricamento
     * @param {Element} target - Elemento target (default: body)
     * @returns {Element} Elemento loader
     */
    showLoader(message = 'Caricamento...', target = document.body) {
        const loader = window.utils?.createElement('div', {
            className: 'loader-overlay'
        });
        
        loader.innerHTML = `
            <div class="loader">
                <div class="loader-spinner"></div>
                <div class="loader-message">${message}</div>
            </div>
        `;
        
        target.appendChild(loader);
        
        requestAnimationFrame(() => {
            loader.classList.add('show');
        });
        
        //console.log(`🎨 Loader shown: ${message}`);
        return loader;
    }

    /**
     * Nasconde indicatore di caricamento
     * @param {Element} loader - Elemento loader da nascondere
     */
    hideLoader(loader) {
        if (!loader) return;
        
        loader.classList.remove('show');
        
        setTimeout(() => {
            loader.remove();
        }, 300);
        
        //console.log('🎨 Loader hidden');
    }

    // ===== GESTIONE FOCUS E ACCESSIBILITÀ =====

    /**
     * Gestione del focus per accessibilità
     */
    setupAccessibility() {
        //console.log('🎨 Setting up accessibility features...');
        
        // Skip link per navigazione da tastiera (DISABILITATO)
        // this.createSkipLink();
        
        // Focus visible per navigazione da tastiera
        this.setupFocusVisible();
        
        // ARIA live regions per annunci screen reader
        this.createLiveRegions();
        
    }

    /**
     * Crea skip link per navigazione da tastiera
     */
    createSkipLink() {
        const skipLink = window.utils?.createElement('a', {
            href: '#main-content',
            className: 'skip-link',
            'data-skip-link': 'true'
        }, 'Salta al contenuto principale');
        
        document.body.insertBefore(skipLink, document.body.firstChild);
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

    /**
     * Annuncia un messaggio agli screen reader
     * @param {string} message - Messaggio da annunciare
     * @param {boolean} assertive - Se true, usa regione assertiva
     */
    announce(message, assertive = false) {
        const region = assertive ? this.liveRegions.assertive : this.liveRegions.polite;
        if (region) {
            region.textContent = message;
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }

    // ===== INIZIALIZZAZIONE =====

    /**
     * Inizializza il gestore UI
     */
    initialize() {
        if (this.initialized) {
            //console.log('🎨 UIManager already initialized');
            return;
        }

        //console.log('🎨 Initializing UIManager...');
        
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
        
        // Inizializza componenti
        this.initializeComponents();
        
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
        //console.log('🎨 Cleaning up UIManager...');
        
        // Cleanup componenti
        for (const [name, component] of this.components) {
            if (typeof component.cleanup === 'function') {
                try {
                    component.cleanup();
                    //console.log(`🎨 Component "${name}" cleaned up`);
                } catch (error) {
                    console.error(`🎨 Error cleaning up component "${name}":`, error);
                }
            }
        }
        
        this.components.clear();
        //console.log('🎨 UIManager cleanup completed');
    }

    /**
     * Ottieni stato corrente dell'UI
     * @returns {object} Stato UI
     */
    getState() {
        return {
            theme: this.currentTheme,
            darkMode: document.body.classList.contains('dark-mode'),
            breakpoint: this.responsive.current,
            components: Array.from(this.components.keys()),
            initialized: this.initialized
        };
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

