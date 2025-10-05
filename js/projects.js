/* Module per caricare e renderizzare i progetti da data/projects.json */
class ProjectsManager {
    constructor(containerSelector = '.projects-grid') {
        this.container = document.querySelector(containerSelector);
        this.mobileContainer = null;
        this.dataUrl = '/data/projects.json';
        this.mobileVisibleCount = 4;
        this.showingAllMobile = false;
    }

    async initialize() {
        if (!this.container) {
            console.error('ProjectsManager: container not found for selector:', this.constructor.name);
            return;
        }

    // initialization diagnostic removed

        // Crea container mobile
        this.createMobileContainer();

        try {
            const projects = await this.fetchProjects();
            // fetched projects diagnostic removed
            const sorted = this.sortByDateDesc(projects);
            // sorted projects diagnostic removed
            this.render(sorted);
            this.renderMobile(sorted);
            // rendering diagnostic removed
        } catch (err) {
            console.error('Errore caricamento progetti:', err);
            // Mostra un messaggio di errore nell'UI
            if (this.container) {
                this.container.innerHTML = '<p style="color: red; text-align: center;">Errore nel caricamento dei progetti. Controlla la console per dettagli.</p>';
            }
        }
    }

    createMobileContainer() {
        const section = this.container.closest('.section');
        if (!section) return;

        this.mobileContainer = document.createElement('div');
        this.mobileContainer.className = 'projects-mobile-accordion';
        this.mobileContainer.style.display = 'none'; // Nascosto di default
        section.appendChild(this.mobileContainer);
    }

    async fetchProjects() {
    // fetch diagnostic removed
        try {
            const res = await fetch(this.dataUrl, {cache: 'no-cache'});
            // response status diagnostic removed
            if (!res.ok) {
                console.error('ProjectsManager: fetch failed', res.status, res.statusText);
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            // data received diagnostic removed
            return data;
        } catch (error) {
            console.error('ProjectsManager: error fetching projects:', error);
            throw error;
        }
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

    renderMobile(items) {
        if (!this.mobileContainer) return;

        this.mobileContainer.innerHTML = '';
        
        const visibleItems = this.showingAllMobile ? items : items.slice(0, this.mobileVisibleCount);
        
        visibleItems.forEach((project, index) => {
            const accordionItem = this.createAccordionItem(project, index);
            this.mobileContainer.appendChild(accordionItem);
        });

        // Aggiungi pulsante "Mostra altri" se ci sono più progetti
        if (!this.showingAllMobile && items.length > this.mobileVisibleCount) {
            const showMoreDiv = document.createElement('div');
            showMoreDiv.className = 'projects-show-more';
            
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'projects-show-more-btn';
            showMoreBtn.textContent = `Mostra altri ${items.length - this.mobileVisibleCount} progetti`;
            
            showMoreBtn.addEventListener('click', () => {
                this.showingAllMobile = true;
                this.renderMobile(items);
            });
            
            showMoreDiv.appendChild(showMoreBtn);
            this.mobileContainer.appendChild(showMoreDiv);
        }
    }

    createAccordionItem(project, index) {
        const item = document.createElement('div');
        item.className = 'project-accordion-item';

        // Header
        const header = document.createElement('div');
        header.className = 'project-accordion-header';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'project-accordion-title';
        
        const title = document.createElement('h3');
        title.textContent = project.title;
        
        const date = document.createElement('p');
        date.className = 'project-accordion-date';
        date.textContent = this.formatPeriod(project.startDate, project.endDate);
        
        titleDiv.appendChild(title);
        titleDiv.appendChild(date);
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-down project-accordion-icon';
        
        header.appendChild(titleDiv);
        header.appendChild(icon);

        // Content
        const content = document.createElement('div');
        content.className = 'project-accordion-content';
        
        const description = document.createElement('p');
        description.textContent = project.description;
        content.appendChild(description);

        // Tech tags
        if (project.tech && project.tech.length > 0) {
            const techDiv = document.createElement('div');
            techDiv.className = 'project-accordion-tech';
            
            project.tech.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techDiv.appendChild(tag);
            });
            
            content.appendChild(techDiv);
        }

        // Links
        const linksDiv = document.createElement('div');
        linksDiv.className = 'project-accordion-links';
        
        if (project.links && project.links.length > 0) {
            project.links.forEach(link => {
                const a = document.createElement('a');
                a.className = 'project-accordion-link';
                a.href = link.url;
                a.textContent = link.label;
                if (link.url && !link.url.startsWith('/') && !link.url.startsWith('#') && link.url.includes('://')) {
                    a.target = '_blank';
                }
                linksDiv.appendChild(a);
            });
        } else if (project.link) {
            const a = document.createElement('a');
            a.className = 'project-accordion-link';
            a.href = project.link;
            a.textContent = 'Visualizza progetto';
            if (project.link && !project.link.startsWith('/') && !project.link.startsWith('#') && project.link.includes('://')) {
                a.target = '_blank';
            }
            linksDiv.appendChild(a);
        }
        
        content.appendChild(linksDiv);

        // Event listener per toggle
        header.addEventListener('click', () => {
            const isExpanded = content.classList.contains('expanded');
            
            // Chiudi tutti gli altri accordion
            this.mobileContainer.querySelectorAll('.project-accordion-content').forEach(c => {
                c.classList.remove('expanded');
            });
            this.mobileContainer.querySelectorAll('.project-accordion-header').forEach(h => {
                h.classList.remove('active');
            });
            this.mobileContainer.querySelectorAll('.project-accordion-icon').forEach(i => {
                i.classList.remove('rotated');
            });
            
            // Toggle corrente
            if (!isExpanded) {
                content.classList.add('expanded');
                header.classList.add('active');
                icon.classList.add('rotated');
            }
        });

        item.appendChild(header);
        item.appendChild(content);

        return item;
    }
}

// Rendi disponibile globalmente per il ComponentsManager o AppManager
window.ProjectsManager = ProjectsManager;
