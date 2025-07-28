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

    // ===== UTILITY DOM =====

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
     * Inizializza le utility
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
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

