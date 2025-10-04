/* Module per caricare e renderizzare i progetti da data/projects.json */
class ProjectsManager {
    constructor(containerSelector = '.projects-grid') {
        this.container = document.querySelector(containerSelector);
        this.dataUrl = '/data/projects.json';
    }

    async initialize() {
        if (!this.container) return;

        console.debug('ProjectsManager: initializing, container found:', !!this.container);

        try {
            const projects = await this.fetchProjects();
            console.debug('ProjectsManager: fetched projects count=', Array.isArray(projects)?projects.length:'?', projects);
            const sorted = this.sortByDateDesc(projects);
            this.render(sorted);
        } catch (err) {
            console.error('Errore caricamento progetti:', err);
        }
    }

    async fetchProjects() {
    console.debug('ProjectsManager: fetching', this.dataUrl);
        const res = await fetch(this.dataUrl, {cache: 'no-cache'});
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    sortByDateDesc(items) {
        // Usa startDate; i progetti senza startDate vanno in fondo
        return items.slice().sort((a, b) => {
            const da = a.startDate || '';
            const db = b.startDate || '';
            if (da === db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return db.localeCompare(da); // descending
        });
    }

    render(items) {
        this.container.innerHTML = '';

        for (const p of items) {
            const card = document.createElement('div');
            card.className = 'project-card';

            const h3 = document.createElement('h3');
            h3.textContent = p.title;
            card.appendChild(h3);

            const desc = document.createElement('p');
            desc.textContent = p.description;
            card.appendChild(desc);

            const tech = document.createElement('div');
            tech.className = 'project-tech';
            for (const t of p.tech || []) {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = t;
                tech.appendChild(span);
            }
            card.appendChild(tech);

            const period = document.createElement('p');
            period.className = 'project-period';
            period.textContent = this.formatPeriod(p.startDate, p.endDate);
            card.appendChild(period);

            // Links: supporta array di link con label oppure singolo campo `link`
            if (Array.isArray(p.links) && p.links.length > 0) {
                const linksWrap = document.createElement('div');
                linksWrap.className = 'project-links';
                for (const L of p.links) {
                    const a = document.createElement('a');
                    a.className = 'project-link';
                    a.href = L.url || '#';
                    // Solo per link esterni
                    if (L.url && !L.url.startsWith('/') && !L.url.startsWith('#') && L.url.includes('://')) {
                        a.target = '_blank';
                    }
                    a.textContent = L.label || L.url || 'Visualizza progetto';
                    linksWrap.appendChild(a);
                }
                card.appendChild(linksWrap);
            } else if (p.link) {
                const a = document.createElement('a');
                a.className = 'project-link';
                a.href = p.link;
                // Solo per link esterni
                if (p.link && !p.link.startsWith('/') && !p.link.startsWith('#') && p.link.includes('://')) {
                    a.target = '_blank';
                }
                a.textContent = 'Visualizza progetto';
                card.appendChild(a);
            }

            this.container.appendChild(card);
        }
    }

    formatPeriod(start, end) {
        if (!start && !end) return '';
        const startLabel = this.formatDateShort(start);
        const endLabel = end ? this.formatDateShort(end) : 'oggi';
        return `${startLabel} - ${endLabel}`;
    }

    formatDateShort(date) {
        if (!date) return '';
        // date in formato YYYY-MM o YYYY
        const parts = date.split('-');
        const year = parts[0];
        const month = parts[1] ? parseInt(parts[1], 10) : null;
        if (!month) return year;
        const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
        return `${months[month-1]} ${year}`;
    }
}

// Rendi disponibile globalmente per il ComponentsManager o AppManager
window.ProjectsManager = ProjectsManager;
