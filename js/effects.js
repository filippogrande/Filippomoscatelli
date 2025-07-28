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
        
        // Osservatore per le animazioni di apparizione
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
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

        // Effetti per le skill cards e project items
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
        }
    }

    /**
     * Setup per il pulsante "Torna all'inizio"
     */
    setupBackToTop() {
        
        const backToTopBtn = document.getElementById('backToTop');
        
        if (!backToTopBtn) {
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
            
        });
        
    }

    /**
     * Setup per la stampa
     */
    setupPrintHandler() {
        
        window.addEventListener('beforeprint', () => {
            
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
            
            // Ripristina la visualizzazione normale
            document.querySelectorAll('.language-selector, .back-to-top').forEach(element => {
                element.style.display = '';
            });
        });
        
    }

    /**
     * Aggiunge animazioni per le icone social
     */
    addSocialIconEffects() {
        
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
        
        // Fade in graduale per il body
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
        
    }

    /**
     * Cleanup delle animazioni e observers
     */
    cleanup() {
        
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Clear any remaining timeouts/intervals
        this.scrollEffects.clear();
        
    }

    /**
     * Inizializza tutti gli effetti
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        
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
        this.setupHoverEffects();
        this.addSocialIconEffects();
        
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

