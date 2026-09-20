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
     * @returns {*} Valore letto o defaultValue
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

    // ===== UTILITY PERIODI (durata anni/mesi) =====

    /**
     * Converte "YYYY-MM" in {year, month}; null se non è una data valida
     * @param {string} value - Data nel formato YYYY-MM
     * @returns {object|null} {year, month} oppure null
     */
    parseYearMonth(value) {
        if (!value) return null;
        const parts = String(value).split('-');
        const year = parseInt(parts[0], 10);
        const month = parts[1] ? parseInt(parts[1], 10) : null;
        if (!year || !month || month < 1 || month > 12) return null;
        return { year: year, month: month };
    }

    /**
     * Numero di mesi fra due "YYYY-MM", estremi inclusi.
     * Senza endDate conta fino al mese corrente.
     * @param {string} startDate - Inizio (YYYY-MM)
     * @param {string} endDate - Fine (YYYY-MM), opzionale
     * @returns {number} Mesi (0 se la data di inizio non è valida)
     */
    monthsBetween(startDate, endDate) {
        const start = this.parseYearMonth(startDate);
        if (!start) return 0;
        let end = this.parseYearMonth(endDate);
        if (!end) {
            const now = new Date();
            end = { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
        }
        const months = (end.year - start.year) * 12 + (end.month - start.month) + 1;
        return months > 0 ? months : 0;
    }

    /**
     * Durata leggibile: "8 mesi", "1 anno e 3 mesi", "2 anni"
     * (EN: "8 months", "1 year 3 months", "2 years")
     * @param {string} lang - 'it' o 'en'
     * @param {string} startDate - Inizio (YYYY-MM)
     * @param {string} endDate - Fine (YYYY-MM), opzionale
     * @returns {string} Durata leggibile, stringa vuota se non calcolabile
     */
    formatDuration(lang, startDate, endDate) {
        const months = this.monthsBetween(startDate, endDate);
        if (!months) return '';
        const en = lang === 'en';
        const years = Math.floor(months / 12);
        const rest = months % 12;
        const yearLabel = (n) => en ? (n === 1 ? '1 year' : `${n} years`) : (n === 1 ? '1 anno' : `${n} anni`);
        const monthLabel = (n) => en ? (n === 1 ? '1 month' : `${n} months`) : (n === 1 ? '1 mese' : `${n} mesi`);
        if (years && rest) return en ? `${yearLabel(years)} ${monthLabel(rest)}` : `${yearLabel(years)} e ${monthLabel(rest)}`;
        if (years) return yearLabel(years);
        return monthLabel(rest);
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
