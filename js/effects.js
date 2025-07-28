/**
 * Effects and Animations Module
 * Gestisce animazioni, effetti visivi e interazioni
 */

class EffectsManager {
    constructor() {
        this.initialized = false;
        this.animationObserver = null;
        this.scrollEffects = new Map();
        
    }

    /**
     * Aggiunge animazioni smooth di apparizione
     */
    addSmoothAnimations() {
        //console.log('✨ Setting up smooth animations...');
        
        // Osservatore per le animazioni di apparizione
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    //console.log('✨ Animation triggered for:', entry.target.className);
                }
            });
        }, observerOptions);
        
        // Osserva tutte le sezioni
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            this.animationObserver.observe(section);
        });
        
    }

    /**
     * Aggiunge effetti dinamici
     */
    addDynamicEffects() {
        //console.log('✨ Setting up dynamic effects...');
        
        // Effetto parallax leggero per l'header (IDENTICO AL BACKUP)
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
        
        // Effetto typewriter per il titolo
        this.setupTypewriterEffect();
        
        // Effetti hover per le card
        this.setupHoverEffects();
        
    }

    /**
     * Setup effetti hover per elementi interattivi
     */
    setupHoverEffects() {
        //console.log('✨ Setting up hover effects...');
        
        // Effetti per le sezioni
        document.querySelectorAll('.section').forEach(section => {
            section.addEventListener('mouseenter', (e) => {
                if (!e.target.classList.contains('hover-active')) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                }
            });
            
            section.addEventListener('mouseleave', (e) => {
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
            });
        });

        // Effetti per le skill tags
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', (e) => {
                e.target.style.transform = '';
            });
        });

        // Effetti per le project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
            });
        });

    }

    /**
     * Setup effetto typewriter per il titolo
     */
    setupTypewriterEffect() {
        const titleElement = document.querySelector('.name');
        if (titleElement) {
            const originalText = titleElement.textContent;
            titleElement.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    titleElement.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Avvia l'animazione dopo un breve ritardo
            setTimeout(typeWriter, 500);
            //console.log('✨ Typewriter effect started for title');
        }
    }

    /**
     * Setup per il pulsante "Torna all'inizio"
     */
    setupBackToTop() {
        //console.log('✨ Setting up back to top button...');
        
        const backToTopBtn = document.getElementById('backToTop');
        
        if (!backToTopBtn) {
            //console.log('⚠️ Back to top button not found');
            return;
        }
        
        // Mostra/nascondi il pulsante in base allo scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Gestisci il click per tornare all'inizio
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Track back to top click
            if (window.analyticsManager) {
                window.analyticsManager.track('back-to-top');
            }
            
            //console.log('✨ Back to top clicked');
        });
        
    }

    /**
     * Setup per la stampa
     */
    setupPrintHandler() {
        //console.log('✨ Setting up print handler...');
        
        window.addEventListener('beforeprint', () => {
            //console.log('✨ Preparing page for print...');
            
            // Rimuovi eventuali animazioni per la stampa
            document.querySelectorAll('.section').forEach(section => {
                section.style.animation = 'none';
                section.style.opacity = '1';
                section.style.transform = 'none';
            });
            
            // Nasconde elementi non necessari per la stampa
            document.querySelectorAll('.language-selector, .back-to-top').forEach(element => {
                element.style.display = 'none';
            });
        });
        
        window.addEventListener('afterprint', () => {
            //console.log('✨ Restoring page after print...');
            
            // Ripristina la visualizzazione normale
            document.querySelectorAll('.language-selector, .back-to-top').forEach(element => {
                element.style.display = '';
            });
        });
        
    }

    /**
     * Aggiunge effetti hover per cards e elementi interattivi
     */
    addHoverEffects() {
        //console.log('✨ Setting up hover effects...');
        
        // Effetti per le skill cards
        document.querySelectorAll('.skill-item, .project-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });
            
            item.addEventListener('mouseleave', (e) => {
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
            });
        });
        
        // Effetti per i pulsanti
        document.querySelectorAll('button, .btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', (e) => {
                e.target.style.transform = '';
            });
        });
        
    }

    /**
     * Aggiunge animazioni per le icone social
     */
    addSocialIconEffects() {
        //console.log('✨ Setting up social icon effects...');
        
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const icon = e.target.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(360deg)';
                    icon.style.transition = 'transform 0.5s ease';
                }
            });
            
            link.addEventListener('mouseleave', (e) => {
                const icon = e.target.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
        
    }

    /**
     * Aggiunge effetti di caricamento
     */
    addLoadingEffects() {
        //console.log('✨ Setting up loading effects...');
        
        // Fade in graduale per il body
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.opacity = '1';
                //console.log('✨ Page fade-in completed');
            }, 100);
        });
        
    }

    /**
     * Cleanup delle animazioni e observers
     */
    cleanup() {
        //console.log('✨ Cleaning up effects...');
        
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Clear any remaining timeouts/intervals
        this.scrollEffects.clear();
        
        //console.log('✨ Effects cleanup completed');
    }

    /**
     * Inizializza tutti gli effetti
     */
    initialize() {
        if (this.initialized) {
            //console.log('✨ EffectsManager already initialized');
            return;
        }

        //console.log('✨ Initializing EffectsManager...');
        
        // Aspetta che il DOM sia pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEffects();
            });
        } else {
            this.setupEffects();
        }
        
        this.initialized = true;
    }

    /**
     * Setup di tutti gli effetti
     */
    setupEffects() {
        this.addLoadingEffects();
        this.addSmoothAnimations();
        this.addDynamicEffects();
        this.setupBackToTop();
        this.setupPrintHandler();
        this.addHoverEffects();
        this.addSocialIconEffects();
        
    }

    /**
     * Aggiunge un nuovo effetto personalizzato
     * @param {string} name - Nome dell'effetto
     * @param {Function} effect - Funzione dell'effetto
     */
    addCustomEffect(name, effect) {
        if (typeof effect === 'function') {
            this.scrollEffects.set(name, effect);
            //console.log(`✨ Custom effect "${name}" added`);
        } else {
            console.error('✨ Custom effect must be a function');
        }
    }

    /**
     * Rimuove un effetto personalizzato
     * @param {string} name - Nome dell'effetto da rimuovere
     */
    removeCustomEffect(name) {
        if (this.scrollEffects.has(name)) {
            this.scrollEffects.delete(name);
            //console.log(`✨ Custom effect "${name}" removed`);
        }
    }
}

// Crea istanza globale del gestore effetti
const effectsManager = new EffectsManager();

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.EffectsManager = EffectsManager; // Esporta la CLASSE
    window.effectsManager = effectsManager; // Esporta l'ISTANZA
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EffectsManager, effectsManager };
}

