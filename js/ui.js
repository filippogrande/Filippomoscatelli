// UI Enhancements Module
// Gestione delle animazioni, effetti e miglioramenti UX

// Funzione per aggiungere animazioni smooth
function addSmoothAnimations() {
    // Osservatore per le animazioni di apparizione
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
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
        observer.observe(section);
    });
}

// Funzione per aggiungere effetti hover dinamici
function addDynamicEffects() {
    // Effetto parallax leggero per l'header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Effetto typewriter per il titolo (opzionale)
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

// Funzione per gestire la stampa
function setupPrintHandler() {
    window.addEventListener('beforeprint', () => {
        // Rimuovi eventuali animazioni per la stampa
        document.querySelectorAll('.section').forEach(section => {
            section.style.animation = 'none';
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    });
}

// Funzione per aggiungere supporto tastiera
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        // Alt + I per italiano
        if (e.altKey && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            changeLanguage('it');
        }
        // Alt + E per inglese
        if (e.altKey && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            changeLanguage('en');
        }
    });
}

// Funzione per gestire il pulsante "Torna all'inizio"
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
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
    });
}

// Funzione per mostrare messaggio di benvenuto nella console
function showWelcomeMessage() {
    console.log(`
    🚀 Ciao! Sono Filippo Moscatelli
    
    Scorciatoie da tastiera:
    • Alt + I: Cambia in Italiano
    • Alt + E: Cambia in Inglese
    
    Grazie per aver visitato il mio CV!
    `);
}

// Inizializzazione di tutti gli enhancement UI
function initUIEnhancements() {
    // Aggiungi animazioni e effetti
    addSmoothAnimations();
    addDynamicEffects();
    setupPrintHandler();
    addKeyboardSupport();
    setupBackToTop();
    
    // Messaggio di benvenuto nella console (easter egg per sviluppatori)
    showWelcomeMessage();
}

// Export per altri moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addSmoothAnimations,
        addDynamicEffects,
        setupPrintHandler,
        addKeyboardSupport,
        setupBackToTop,
        showWelcomeMessage,
        initUIEnhancements
    };
}
