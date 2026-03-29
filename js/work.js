/* Module per caricare e renderizzare le esperienze di lavoro da data/work.json */
class WorkManager {
    constructor(containerSelector = '.work-grid') {
        console.debug && console.debug('work.js: script caricato');
        this.container = null;
        this.lang = null;
        this.dataUrl = '/data/work.json';
        this.items = [];
    }

    async initialize() {
        console.debug && console.debug('WorkManager.initialize: start');
        // Resolve container at initialization time to ensure DOM is ready
        this.container = document.querySelector(arguments[0] && typeof arguments[0] === 'string' ? arguments[0] : '.work-grid') || this.container;

        if (!this.container) {
            console.error('WorkManager: container .work-grid non trovato in DOM');
            return;
        }

        this.lang = (document.documentElement && document.documentElement.lang) ? document.documentElement.lang : ((window.languageManager && typeof window.languageManager.getCurrentLanguage === 'function') ? window.languageManager.getCurrentLanguage() : 'it');
        this.dataUrl = this.lang === 'en' ? '/data/work.en.json' : '/data/work.json';

        try {
            console.debug && console.debug('WorkManager: fetching', this.dataUrl);
            const data = await this.fetchWork();
            console.debug && console.debug('WorkManager: data ricevuti', data && data.length);
            this.items = data;
            this.render(data);

            document.addEventListener('languageChanged', async (e) => {
                const newLang = e && e.detail && e.detail.newLanguage ? e.detail.newLanguage : (document.documentElement.lang || 'it');
                if (newLang === this.lang) return;
                this.lang = newLang;
                this.dataUrl = this.lang === 'en' ? '/data/work.en.json' : '/data/work.json';
                const newData = await this.fetchWork();
                this.items = newData;
                this.render(newData);
            });

        } catch (err) {
            console.error('WorkManager: error loading work data', err);
            if (this.container) {
                this.container.innerHTML = '<p style="color:red; text-align:center;">Errore nel caricamento delle esperienze di lavoro.</p>';
            }
        }
    }

    async fetchWork() {
        try {
            const res = await fetch(this.dataUrl, {cache: 'no-cache'});
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return json;
        } catch (e) {
            console.error('WorkManager: fetch error', e);
            throw e;
        }
    }

    render(items) {
        this.container.innerHTML = '';
        if (!Array.isArray(items) || items.length === 0) {
            this.container.innerHTML = '<p>Nessuna esperienza disponibile.</p>';
            return;
        }

        for (const w of items) {
            // Reuse education-like markup so the work section follows the same styling
            const item = document.createElement('div');
            item.className = 'education-item work-item';

            const titleEl = document.createElement('h3');
            titleEl.textContent = w.role || w.title || '';
            item.appendChild(titleEl);

            const companyEl = document.createElement('p');
            companyEl.className = 'school';
            companyEl.textContent = w.company || '';
            item.appendChild(companyEl);

            // Period (meta) and location on a separate line
            if (w.startDate || w.endDate) {
                const meta = document.createElement('div');
                meta.className = 'work-meta';

                const period = document.createElement('span');
                period.className = 'period';
                period.textContent = `${this.formatDateShort(w.startDate)}${w.startDate || w.endDate ? ' - ' : ''}${w.endDate ? this.formatDateShort(w.endDate) : (this.lang === 'en' ? 'Present' : 'Presente')}`;
                meta.appendChild(period);

                item.appendChild(meta);
            }

            // Location / modality on its own line, smaller and muted
            if (w.location || w.modality) {
                const loc = document.createElement('p');
                loc.className = 'work-location';
                loc.textContent = [w.location, w.modality].filter(Boolean).join(' • ');
                item.appendChild(loc);
            }

            // Description with preserved newlines
            if (w.description) {
                const desc = document.createElement('p');
                desc.className = 'work-description';
                const lines = String(w.description).split('\n');
                lines.forEach((line, idx) => {
                    desc.appendChild(document.createTextNode(line));
                    if (idx < lines.length - 1) desc.appendChild(document.createElement('br'));
                });
                item.appendChild(desc);
            }

            // (divider rimosso per aderire allo stile della sezione)

            // Skills header and list
            if (w.tech && w.tech.length > 0) {
                const skillsWrap = document.createElement('div');
                skillsWrap.className = 'education-skills';
                const h4 = document.createElement('h4');
                h4.textContent = this.lang === 'en' ? 'Acquired skills:' : 'Competenze acquisite:';
                skillsWrap.appendChild(h4);

                const skillsList = document.createElement('div');
                skillsList.className = 'skills-list';
                for (const t of w.tech) {
                    const span = document.createElement('span');
                    span.className = 'skill-tag';
                    span.textContent = t;
                    skillsList.appendChild(span);
                }
                skillsWrap.appendChild(skillsList);
                item.appendChild(skillsWrap);
            }

            this.container.appendChild(item);
        }
    }

    formatDateShort(date) {
        if (!date) return '';
        const parts = String(date).split('-');
        const year = parts[0];
        const month = parts[1] ? parseInt(parts[1], 10) : null;
        if (!month) return year;
        try {
            const dt = new Date(Date.UTC(year, month - 1, 1));
            const formatter = new Intl.DateTimeFormat(this.lang === 'en' ? 'en-US' : 'it-IT', { month: 'short', year: 'numeric' });
            return formatter.format(dt);
        } catch (e) {
            const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
            return `${months[month-1]} ${year}`;
        }
    }
}

window.WorkManager = WorkManager;

// Fallback: se l'AppManager non registra il modulo (es. esecuzione fuori ordine),
// inizializza la sezione dopo il DOMContentLoaded una sola volta.
if (typeof window !== 'undefined' && !window.appManager) {
    document.addEventListener('DOMContentLoaded', async () => {
        if (window._work_initialized) return;
        try {
            const wm = new WorkManager();
            window._work_initialized = true;
            await wm.initialize();
        } catch (e) {
            console.error('WorkManager fallback init failed', e);
        }
    });
}
