/**
 * CSS Manager Module
 *
 * Carica il CSS del sito. Un tempo inseriva nel <head> undici <link>, uno alla
 * volta in sequenza: ogni inserimento ricalcolava il layout e contribuiva al CLS
 * (0.60 misurato da Lighthouse). Ora inserisce SOLO main.css, che importa gli
 * altri moduli nell'ordine giusto: una richiesta, un ricalcolo.
 *
 * Il caricamento resta da JS perche' index.html non ha un <link> statico: la
 * soluzione definitiva (foglio nel <head>, zero CLS da CSS) richiede di toccare
 * il markup, ed e' tracciata a parte.
 */

class CSSManager {
    constructor() {
        this.loadedModules = new Set();
        this.baseUrl = './css/';
    }

    initialize() {
        try {
            this.loadStylesheet();
            this.setupThemeSupport();
            this.setupPrintOptimization();
            return Promise.resolve();
        } catch (error) {
            console.error('❌ CSSManager initialization failed:', error);
            return Promise.reject(error);
        }
    }

    /**
     * Inserisce main.css una sola volta, marcandolo per ritrovarlo.
     */
    loadStylesheet() {
        const id = 'site-css';
        if (document.getElementById(id)) {
            return;
        }

        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = this.baseUrl + 'main.css';
        link.onerror = () => {
            console.error('❌ CSS principale non caricato:', link.href);
        };

        document.head.appendChild(link);
    }

    setupThemeSupport() {
        document.documentElement.setAttribute('data-theme', 'default');

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-system-theme', 'dark');
        }
    }

    setupPrintOptimization() {
        window.addEventListener('beforeprint', () => {
            document.body.classList.add('printing');
        });

        window.addEventListener('afterprint', () => {
            document.body.classList.remove('printing');
        });
    }
}

window.CSSManager = CSSManager;
