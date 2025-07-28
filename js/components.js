/**
 * Components Manager Module
 * Gestisce i componenti UI dinamici e riutilizzabili
 */

class ComponentsManager {
    constructor() {
        this.components = new Map();
        this.componentInstances = new Map();
        
    }

    /**
     * Inizializza il component manager
     */
    initialize() {
        try {
            // Registra i componenti base
            this.registerBaseComponents();
            
            // Inizializza i componenti esistenti nel DOM
            this.initializeExistingComponents();
            
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
        
        // Non aggiungiamo listener qui - gestiti da language.js
        // Questo evita doppi listener e conflitti

        // Keyboard navigation per accessibilità
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
}

// Rendi disponibile globalmente
window.ComponentsManager = ComponentsManager;
