/**
 * Utilities Module
 * Contiene funzioni di utilità comuni utilizzate in tutta l'applicazione
 */

class Utils {
    constructor() {
        this.initialized = false;
    }

    // ===== UTILITY GENERALI =====

    /**
     * Debounce di una funzione
     * @param {Function} func - Funzione da eseguire
     * @param {number} wait - Tempo di attesa in ms
     * @param {boolean} immediate - Esegui immediatamente
     * @returns {Function} Funzione con debounce
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle di una funzione
     * @param {Function} func - Funzione da eseguire
     * @param {number} limit - Limite di tempo in ms
     * @returns {Function} Funzione con throttle
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Genera un UUID v4
     * @returns {string} UUID generato
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Formatta una data
     * @param {Date|string} date - Data da formattare
     * @param {string} locale - Locale (default: 'it-IT')
     * @param {object} options - Opzioni di formattazione
     * @returns {string} Data formattata
     */
    formatDate(date, locale = 'it-IT', options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        const dateObj = date instanceof Date ? date : new Date(date);
        
        try {
            return dateObj.toLocaleDateString(locale, finalOptions);
        } catch (error) {
            console.error('🔧 Error formatting date:', error);
            return dateObj.toString();
        }
    }

    /**
     * Sanitizza una stringa HTML
     * @param {string} str - Stringa da sanitizzare
     * @returns {string} Stringa sanitizzata
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Escape di caratteri HTML
     * @param {string} text - Testo da fare escape
     * @returns {string} Testo con escape
     */
    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    // ===== UTILITY DOM =====

    /**
     * Seleziona un elemento con controllo di esistenza
     * @param {string} selector - Selettore CSS
     * @param {Element} context - Contesto di ricerca (default: document)
     * @returns {Element|null} Elemento trovato o null
     */
    $(selector, context = document) {
        return context.querySelector(selector);
    }

    /**
     * Seleziona più elementi
     * @param {string} selector - Selettore CSS
     * @param {Element} context - Contesto di ricerca (default: document)
     * @returns {NodeList} Lista di elementi
     */
    $$(selector, context = document) {
        return context.querySelectorAll(selector);
    }

    /**
     * Crea un elemento DOM con attributi
     * @param {string} tag - Tag dell'elemento
     * @param {object} attributes - Attributi da impostare
     * @param {string} content - Contenuto testuale
     * @returns {Element} Elemento creato
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'dataset') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Verifica se un elemento è visibile nel viewport
     * @param {Element} element - Elemento da controllare
     * @param {number} threshold - Soglia di visibilità (0-1)
     * @returns {boolean} True se visibile
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const height = window.innerHeight || document.documentElement.clientHeight;
        const width = window.innerWidth || document.documentElement.clientWidth;
        
        const verticalVisible = rect.top + (rect.height * threshold) < height && 
                               rect.bottom - (rect.height * threshold) > 0;
        const horizontalVisible = rect.left + (rect.width * threshold) < width && 
                                 rect.right - (rect.width * threshold) > 0;
        
        return verticalVisible && horizontalVisible;
    }

    /**
     * Smooth scroll verso un elemento
     * @param {Element|string} target - Elemento o selettore target
     * @param {number} offset - Offset in pixel
     * @param {number} duration - Durata animazione in ms
     */
    scrollTo(target, offset = 0, duration = 500) {
        const element = typeof target === 'string' ? this.$(target) : target;
        if (!element) return;
        
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animateScroll);
        };
        
        requestAnimationFrame(animateScroll);
    }

    /**
     * Easing function per animazioni
     * @param {number} t - Tempo corrente
     * @param {number} b - Valore iniziale
     * @param {number} c - Cambiamento nel valore
     * @param {number} d - Durata
     * @returns {number} Valore interpolato
     */
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // ===== UTILITY STORAGE =====

    /**
     * Salva dati nel localStorage con controllo errori
     * @param {string} key - Chiave
     * @param {*} value - Valore da salvare
     * @returns {boolean} Successo dell'operazione
     */
    setStorage(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('🔧 Error saving to localStorage:', error);
            return false;
        }
    }

    /**
     * Legge dati dal localStorage
     * @param {string} key - Chiave
     * @param {*} defaultValue - Valore di default
     * @returns {*} Valore letto o default
     */
    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('🔧 Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Rimuove una chiave dal localStorage
     * @param {string} key - Chiave da rimuovere
     * @returns {boolean} Successo dell'operazione
     */
    removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('🔧 Error removing from localStorage:', error);
            return false;
        }
    }

    /**
     * Pulisce il localStorage
     * @returns {boolean} Successo dell'operazione
     */
    clearStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('🔧 Error clearing localStorage:', error);
            return false;
        }
    }

    // ===== UTILITY NETWORK =====

    /**
     * Fetch con timeout e retry
     * @param {string} url - URL da richiedere
     * @param {object} options - Opzioni fetch
     * @param {number} timeout - Timeout in ms
     * @param {number} retries - Numero di retry
     * @returns {Promise} Promise del risultato
     */
    async fetchWithRetry(url, options = {}, timeout = 5000, retries = 3) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const fetchOptions = {
            ...options,
            signal: controller.signal
        };
        
        for (let i = 0; i <= retries; i++) {
            try {
                const response = await fetch(url, fetchOptions);
                clearTimeout(timeoutId);
                return response;
            } catch (error) {
                if (i === retries) throw error;
                await this.delay(1000 * (i + 1)); // Backoff exponenziale
            }
        }
    }

    /**
     * Ritardo asincrono
     * @param {number} ms - Millisecondi di ritardo
     * @returns {Promise} Promise che si risolve dopo il ritardo
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ===== UTILITY DEVICE E BROWSER =====

    /**
     * Rileva il tipo di device
     * @returns {object} Informazioni sul device
     */
    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
        const isDesktop = !isMobile && !isTablet;
        
        return {
            isMobile,
            isTablet,
            isDesktop,
            userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    /**
     * Rileva il browser
     * @returns {object} Informazioni sul browser
     */
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = 'Unknown';
        
        if (userAgent.indexOf('Chrome') > -1) {
            browserName = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/(\d+)/)[1];
        } else if (userAgent.indexOf('Firefox') > -1) {
            browserName = 'Firefox';
            browserVersion = userAgent.match(/Firefox\/(\d+)/)[1];
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            browserName = 'Safari';
            browserVersion = userAgent.match(/Version\/(\d+)/)[1];
        } else if (userAgent.indexOf('Edge') > -1) {
            browserName = 'Edge';
            browserVersion = userAgent.match(/Edge\/(\d+)/)[1];
        }
        
        return {
            name: browserName,
            version: browserVersion,
            userAgent,
            vendor: navigator.vendor,
            language: navigator.language,
            languages: navigator.languages
        };
    }

    /**
     * Ottiene informazioni sullo schermo
     * @returns {object} Informazioni schermo
     */
    getScreenInfo() {
        return {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio || 1,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }

    // ===== UTILITY VALIDAZIONE =====

    /**
     * Valida un indirizzo email
     * @param {string} email - Email da validare
     * @returns {boolean} True se valida
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida un URL
     * @param {string} url - URL da validare
     * @returns {boolean} True se valido
     */
    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica se un valore è vuoto
     * @param {*} value - Valore da controllare
     * @returns {boolean} True se vuoto
     */
    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }

    // ===== UTILITY PERFORMANCE =====

    /**
     * Misura il tempo di esecuzione di una funzione
     * @param {Function} func - Funzione da misurare
     * @param {string} label - Label per il log
     * @returns {*} Risultato della funzione
     */
    async measurePerformance(func, label = 'Function') {
        const start = performance.now();
        const result = await func();
        const end = performance.now();
        console.log(`🔧 ${label} executed in ${(end - start).toFixed(2)}ms`);
        return result;
    }

    /**
     * Observer per misurare le performance di rendering
     * @param {Function} callback - Callback per i risultati
     */
    observePerformance(callback) {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    callback({
                        name: entry.name,
                        type: entry.entryType,
                        startTime: entry.startTime,
                        duration: entry.duration
                    });
                });
            });
            
            observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
            return observer;
        }
        return null;
    }

    // ===== UTILITY LOGGING =====

    /**
     * Logger con livelli
     * @param {string} level - Livello del log
     * @param {string} message - Messaggio
     * @param {*} data - Dati aggiuntivi
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        if (data) {
            console[level](logMessage, data);
        } else {
            console[level](logMessage);
        }
    }

    /**
     * Inizializza le utility
     */
    initialize() {
        if (this.initialized) {
            console.log('🔧 Utils already initialized');
            return;
        }

        console.log('🔧 Initializing Utils...');
        
        // Setup di utility globali se in debug mode
        if (window.configManager?.get('app.debug')) {
            this.setupDebugUtils();
        }
        
        this.initialized = true;
    }

    /**
     * Setup utility di debug
     */
    setupDebugUtils() {
        // Esponi alcune utility globalmente per debug
        window.utils = {
            device: this.getDeviceInfo(),
            browser: this.getBrowserInfo(),
            screen: this.getScreenInfo(),
            performance: this.observePerformance.bind(this),
            measure: this.measurePerformance.bind(this)
        };
        
        console.log('🔧 Debug utilities available in window.utils');
    }
}

// Crea istanza globale delle utility
const utils = new Utils();

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.Utils = Utils; // Esporta la CLASSE
    window.utils = utils; // Esporta l'ISTANZA
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, utils };
}

