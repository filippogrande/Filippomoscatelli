/**
 * Analytics and Tracking Module
 *
 * Schema ridotto a cinque eventi, tutti con significato operativo:
 *   cv-download     { language }            -> quanti scaricano il CV, in che lingua
 *   contact-click   { channel }             -> email | linkedin | github
 *   project-click   { project }             -> quali progetti incuriosiscono
 *   language-switch { from, to }            -> chi cambia lingua
 *   engagement      { max_scroll, seconds } -> uno solo a fine visita
 *
 * Rimosso rispetto alla versione precedente: session-start, i quattro
 * scroll-depth-*, i cinque time-*, lang-current-*, lang-to-*, scroll-summary e
 * il tracking di ogni link esterno. Una visita produceva 10-15 eventi e
 * includeva user agent completo, risoluzione schermo e timezone: un fingerprint
 * inutile in un analytics che nasce per non raccoglierlo.
 *
 * Il paese non lo mandiamo noi: Umami lo ricava dall'header CF-IPCountry che
 * Cloudflare aggiunge alla richiesta. Nessun IP del visitatore viene conservato.
 */

class AnalyticsManager {
    constructor() {
        if (window.analyticsManagerInstance) {
            return window.analyticsManagerInstance;
        }

        this.umamiAvailable = false;
        this.initialized = false;
        this.engagementSent = false;
        this.maxScroll = 0;
        this.startedAt = Date.now();
        this.waitTimer = null;
        this.listenersAttached = false;

        this.waitForUmami(0);
        window.analyticsManagerInstance = this;
    }

    /**
     * Umami lo carica js/inline-scripts.js in modo asincrono: aspetto che ci sia,
     * senza polling infinito (10 tentativi da 1s).
     */
    waitForUmami(attempt) {
        if (typeof umami !== 'undefined') {
            this.onReady();
            return;
        }
        if (attempt >= 10) {
            // Nessun fallback silenzioso: se il loader e' rotto lo si vede.
            console.error('Umami non disponibile dopo 10s: eventi non inviati');
            return;
        }
        this.waitTimer = setTimeout(() => this.waitForUmami(attempt + 1), 1000);
    }

    onReady() {
        if (this.initialized) return;
        this.initialized = true;
        this.umamiAvailable = true;
        this.attachListeners();
    }

    /**
     * Invio grezzo. `data` non deve mai contenere dati personali.
     */
    track(eventName, data) {
        if (!this.umamiAvailable || typeof umami === 'undefined') return;

        try {
            if (data && Object.keys(data).length) {
                umami.track(eventName, data);
            } else {
                umami.track(eventName);
            }
        } catch (error) {
            console.error('Umami: invio evento fallito', eventName, error);
        }
    }

    attachListeners() {
        if (this.listenersAttached) return;
        this.listenersAttached = true;

        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        document.addEventListener('visibilitychange', () => this.onVisibilityChange());
        document.addEventListener('languageChanged', (e) => this.onLanguageChange(e));
        document.addEventListener('click', (e) => this.onClick(e), true);
    }

    onScroll() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const percent = Math.round((window.pageYOffset / docHeight) * 100);
        if (percent > this.maxScroll) this.maxScroll = Math.min(percent, 100);
    }

    /**
     * `visibilitychange` invece di `beforeunload`: la richiesta parte quando la
     * scheda va in background o si chiude, e non viene scartata dal browser.
     */
    onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.sendEngagement();
        }
    }

    sendEngagement() {
        if (this.engagementSent) return;
        this.engagementSent = true;

        this.track('engagement', {
            max_scroll: this.maxScroll,
            seconds: Math.round((Date.now() - this.startedAt) / 1000)
        });
    }

    onLanguageChange(e) {
        const detail = e && e.detail ? e.detail : {};
        const to = detail.newLanguage;
        if (!to || to === detail.previousLanguage) return;

        this.track('language-switch', {
            from: detail.previousLanguage || 'unknown',
            to: to
        });
    }

    /**
     * Un solo listener in cattura sugli <a>: evita che ogni link abbia il suo
     * handler e tiene la logica in un punto solo.
     */
    onClick(e) {
        const anchor = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!anchor) return;

        const href = anchor.getAttribute('href') || '';

        if (anchor.id === 'cv-download' || /\.pdf$/i.test(href)) {
            this.track('cv-download', { language: /_en\.pdf$/i.test(href) ? 'en' : 'it' });
            return;
        }

        if (href.indexOf('mailto:') === 0) {
            this.track('contact-click', { channel: 'email' });
            return;
        }

        if (href.indexOf('linkedin.com') !== -1) {
            this.track('contact-click', { channel: 'linkedin' });
            return;
        }

        if (/github\.com\/filippogrande\/?$/.test(href)) {
            this.track('contact-click', { channel: 'github' });
            return;
        }

        // Progetti: i link al repo o alla pagina del progetto.
        const project = this.projectFromHref(href);
        if (project) {
            this.track('project-click', { project: project });
        }
    }

    projectFromHref(href) {
        const match = href.match(/github\.com\/filippogrande\/([^\/?#]+)/i);
        if (match) return match[1];
        if (href.indexOf('/FoodDelivery') !== -1) return 'FoodDelivery';
        return null;
    }

    initialize() {
        // Compatibilita': l'init avviene quando Umami e' pronto (onReady).
    }
}

let analyticsManager;
if (!window.analyticsManagerInstance) {
    analyticsManager = new AnalyticsManager();
} else {
    analyticsManager = window.analyticsManagerInstance;
}

if (typeof window !== 'undefined') {
    window.AnalyticsManager = AnalyticsManager;
    window.analyticsManager = analyticsManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalyticsManager, analyticsManager };
}
