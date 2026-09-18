/**
 * Durations Module
 * Mostra la durata (anni/mesi) accanto a qualunque periodo marcato in HTML con
 * gli attributi data-period-start / data-period-end, calcolata al volo.
 *
 * Esempio in index.html:
 *   <p class="period" data-key="volunteer1-period"
 *      data-period-start="2020-10" data-period-end="2026-08">Ott 2020 - Ago 2026</p>
 *
 * Con il solo data-period-start (periodo in corso) la durata conta fino al mese
 * corrente: nessun valore scritto a mano da aggiornare.
 * Il calcolo sta in Utils.formatDuration(), condiviso con work.js.
 */
class DurationsManager {
    constructor(selector = '[data-period-start]') {
        this.selector = selector;
        this.initialized = false;
    }

    /**
     * Lingua corrente della pagina
     * @returns {string} 'it' o 'en'
     */
    getLanguage() {
        if (window.languageManager && typeof window.languageManager.getCurrentLanguage === 'function') {
            return window.languageManager.getCurrentLanguage() === 'en' ? 'en' : 'it';
        }
        return document.documentElement.lang === 'en' ? 'en' : 'it';
    }

    /**
     * Scrive o aggiorna la durata accanto a ogni periodo marcato
     */
    apply() {
        if (typeof document === 'undefined' || !window.utils) {
            return;
        }

        const lang = this.getLanguage();

        document.querySelectorAll(this.selector).forEach((element) => {
            const label = window.utils.formatDuration(
                lang,
                element.getAttribute('data-period-start'),
                element.getAttribute('data-period-end')
            );

            const existing = element.querySelector('.work-duration');

            if (!label) {
                if (existing) existing.remove();
                return;
            }

            const span = existing || document.createElement('span');
            span.className = 'period work-duration';
            span.textContent = ` (${label})`;
            if (!existing) element.appendChild(span);
        });
    }

    /**
     * Inizializza il gestore: calcola subito e a ogni cambio lingua.
     * Il cambio lingua riscrive il testo del periodo (traduzione), quindi il
     * listener su 'languageChanged' è obbligatorio per riaccodare la durata.
     */
    initialize() {
        if (this.initialized) {
            this.apply();
            return;
        }

        this.initialized = true;
        this.apply();
        document.addEventListener('languageChanged', () => this.apply());
    }
}

window.DurationsManager = DurationsManager;

// Fallback: se l'AppManager non registra il modulo, inizializza dopo il DOMContentLoaded.
if (typeof window !== 'undefined' && !window.appManager) {
    document.addEventListener('DOMContentLoaded', () => {
        if (window._durations_initialized) return;
        try {
            window._durations_initialized = true;
            const durationsManager = new DurationsManager();
            window.durationsManager = durationsManager;
            durationsManager.initialize();
        } catch (e) {
            console.error('DurationsManager fallback init failed', e);
        }
    });
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DurationsManager };
}
