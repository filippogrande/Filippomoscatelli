/**
 * Components Manager Module
 * Gestisce i componenti UI dinamici e riutilizzabili
 */

class ComponentsManager {
    constructor() {
        this.components = new Map();
        this.componentInstances = new Map();
        
        console.log('🧩 ComponentsManager: Initialized');
    }

    /**
     * Inizializza il component manager
     */
    initialize() {
        console.log('🧩 ComponentsManager: Starting initialization...');
        
        try {
            // Registra i componenti base
            this.registerBaseComponents();
            
            // Inizializza i componenti esistenti nel DOM
            this.initializeExistingComponents();
            
            console.log('✅ ComponentsManager: Initialization complete');
            return Promise.resolve();
        } catch (error) {
            console.error('❌ ComponentsManager initialization failed:', error);
            return Promise.reject(error);
        }
    }

    /**
     * Registra i componenti base
     */
    registerBaseComponents() {
        // Componente Language Selector
        this.registerComponent('language-selector', {
            selector: '.language-selector',
            init: (element) => this.initLanguageSelector(element),
            events: ['click', 'keydown']
        });

        // Componente Back to Top
        this.registerComponent('back-to-top', {
            selector: '.back-to-top',
            init: (element) => this.initBackToTop(element),
            events: ['click', 'scroll']
        });

        // Componente Timeline
        this.registerComponent('timeline', {
            selector: '.timeline',
            init: (element) => this.initTimeline(element),
            events: ['scroll', 'resize']
        });

        // Componente Project Cards
        this.registerComponent('project-card', {
            selector: '.project-card',
            init: (element) => this.initProjectCard(element),
            events: ['mouseenter', 'mouseleave']
        });

        // Componente Skill Tags
        this.registerComponent('skill-tag', {
            selector: '.skill-tag',
            init: (element) => this.initSkillTag(element),
            events: ['hover']
        });
    }

    /**
     * Registra un nuovo componente
     */
    registerComponent(name, config) {
        this.components.set(name, {
            name,
            selector: config.selector,
            init: config.init,
            events: config.events || [],
            destroy: config.destroy || (() => {}),
            update: config.update || (() => {})
        });
        
        console.log(`🧩 Registered component: ${name}`);
    }

    /**
     * Inizializza i componenti esistenti nel DOM
     */
    initializeExistingComponents() {
        for (const [name, component] of this.components) {
            const elements = document.querySelectorAll(component.selector);
            
            elements.forEach((element, index) => {
                const instanceId = `${name}-${index}`;
                
                try {
                    component.init(element);
                    this.componentInstances.set(instanceId, {
                        name,
                        element,
                        component
                    });
                    
                    console.log(`🧩 Initialized component instance: ${instanceId}`);
                } catch (error) {
                    console.error(`❌ Failed to initialize component ${instanceId}:`, error);
                }
            });
        }
    }

    /**
     * Inizializza Language Selector
     */
    initLanguageSelector(element) {
        const buttons = element.querySelectorAll('.lang-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (window.languageManager) {
                    window.languageManager.changeLanguage(lang);
                }
            });
        });

        // Keyboard navigation
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Migliora la navigazione con tab
                e.preventDefault();
                const currentActive = element.querySelector('.lang-btn:focus');
                const allButtons = Array.from(buttons);
                const currentIndex = allButtons.indexOf(currentActive);
                const nextIndex = (currentIndex + 1) % allButtons.length;
                allButtons[nextIndex].focus();
            }
        });
    }

    /**
     * Inizializza Back to Top
     */
    initBackToTop(element) {
        let isVisible = false;
        
        const toggleVisibility = () => {
            const shouldShow = window.pageYOffset > 300;
            
            if (shouldShow && !isVisible) {
                element.classList.add('visible');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                element.classList.remove('visible');
                isVisible = false;
            }
        };

        // Throttled scroll listener
        const throttledToggle = this.throttle(toggleVisibility, 100);
        window.addEventListener('scroll', throttledToggle);

        // Click handler
        element.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Inizializza Timeline
     */
    initTimeline(element) {
        const items = element.querySelectorAll('.timeline-item');
        
        // Intersection Observer per animazioni
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        items.forEach(item => {
            observer.observe(item);
        });
    }

    /**
     * Inizializza Project Card
     */
    initProjectCard(element) {
        let hoverTimeout;

        element.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            element.classList.add('hover-active');
        });

        element.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                element.classList.remove('hover-active');
            }, 150);
        });

        // Aggiungi focus per accessibilità
        element.addEventListener('focus', () => {
            element.classList.add('focus-active');
        });

        element.addEventListener('blur', () => {
            element.classList.remove('focus-active');
        });
    }

    /**
     * Inizializza Skill Tag
     */
    initSkillTag(element) {
        // Aggiungi ripple effect al click
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    /**
     * Crea un nuovo componente dinamicamente
     */
    createComponent(name, container, data = {}) {
        const component = this.components.get(name);
        if (!component) {
            console.error(`❌ Component "${name}" not found`);
            return null;
        }

        try {
            const element = this.generateComponentHTML(name, data);
            container.appendChild(element);
            
            component.init(element);
            
            const instanceId = `${name}-dynamic-${Date.now()}`;
            this.componentInstances.set(instanceId, {
                name,
                element,
                component
            });
            
            console.log(`🧩 Created dynamic component: ${instanceId}`);
            return element;
        } catch (error) {
            console.error(`❌ Failed to create component "${name}":`, error);
            return null;
        }
    }

    /**
     * Genera HTML per un componente
     */
    generateComponentHTML(name, data) {
        switch (name) {
            case 'skill-tag':
                const tag = document.createElement('span');
                tag.className = 'skill-tag';
                tag.textContent = data.text || 'Skill';
                return tag;
                
            case 'project-card':
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3>${data.title || 'Project Title'}</h3>
                    <p>${data.description || 'Project description'}</p>
                    <div class="project-tech">
                        ${(data.technologies || []).map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                `;
                return card;
                
            default:
                const div = document.createElement('div');
                div.className = name;
                return div;
        }
    }

    /**
     * Distrugge un'istanza di componente
     */
    destroyComponent(instanceId) {
        const instance = this.componentInstances.get(instanceId);
        if (!instance) {
            console.error(`❌ Component instance "${instanceId}" not found`);
            return;
        }

        try {
            instance.component.destroy(instance.element);
            instance.element.remove();
            this.componentInstances.delete(instanceId);
            
            console.log(`🗑️ Destroyed component: ${instanceId}`);
        } catch (error) {
            console.error(`❌ Failed to destroy component "${instanceId}":`, error);
        }
    }

    /**
     * Utility throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Ottieni tutte le istanze di componenti
     */
    getComponentInstances() {
        return Array.from(this.componentInstances.entries()).map(([id, instance]) => ({
            id,
            name: instance.name,
            element: instance.element
        }));
    }

    /**
     * Aggiorna tutti i componenti
     */
    updateAllComponents() {
        for (const [instanceId, instance] of this.componentInstances) {
            try {
                instance.component.update(instance.element);
            } catch (error) {
                console.error(`❌ Failed to update component "${instanceId}":`, error);
            }
        }
    }
}

// Rendi disponibile globalmente
window.ComponentsManager = ComponentsManager;
