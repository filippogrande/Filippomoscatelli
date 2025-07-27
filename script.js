// Traduzioni
const translations = {
    it: {
        'job-title': 'Studente in Informatica per la Comunicazione Digitale',
        'location': 'Milano, Italia',
        'about-title': 'Chi Sono',
        'about-description': 'Ciao! Sono uno studente in Informatica per la Comunicazione Digitale presso l\'Università Statale di Milano. Sono appassionato di tecnologia, computer e software, e mi piace esplorare nuove soluzioni per risolvere problemi pratici. Tra i miei interessi ci sono anche i videogiochi e i veicoli di trasporto, con un particolare focus sulle innovazioni come la guida autonoma e i sistemi intelligenti applicati alla mobilità.<br><br>Sono anche un appassionato di sistemi autogestiti. Ho scelto di ospitare personalmente questo sito web a casa mia e di gestire diverse applicazioni self-hosted. Questa esperienza mi permette di esplorare più a fondo le infrastrutture tecnologiche e di sviluppare competenze pratiche che considero fondamentali.<br><br>Il mio obiettivo è approfondire e condividere le conoscenze che acquisisco, in modo da poter contribuire a progetti e settori che mi appassionano, con un focus particolare su soluzioni tecnologiche avanzate.',
        'skills-title': 'Competenze',
        'frontend-title': 'Frontend',
        'backend-title': 'Backend',
        'database-title': 'Database',
        'tools-title': 'Strumenti',
        'languages-title': 'Lingue',
        'italian-title': 'Italiano',
        'english-title': 'Inglese',
        'native-level': 'Madrelingua',
        'b2-level': 'B2 (non certificato)',
        'experience-title': 'Esperienza di Volontariato',
        'volunteer1-title': 'Educatore Gruppo Medie',
        'volunteer1-organization': 'Oratorio Santa Maria di Lourdes, Milano',
        'volunteer1-period': 'Ott 2020 - Presente',
        'volunteer1-description': `
            <li>Accompagnamento educativo nel percorso di crescita di ragazzi delle medie</li>
            <li>Organizzazione di attività ricreative e momenti di condivisione</li>
            <li>Supporto nelle dinamiche di gruppo e relazioni interpersonali</li>
            <li>Collaborazione con altri educatori e coordinatori dell'oratorio</li>
        `,
        'education-title': 'Istruzione',
        'education1-title': 'Laurea in Informatica per la Comunicazione Digitale',
        'education1-school': 'Università degli Studi di Milano',
        'education1-period': 'Set 2021 - Set 2026 (in corso)',
        'education1-description': 'Laurea triennale in Scienze e Tecnologie Informatiche con focus sulla comunicazione digitale.',
        'education2-title': 'Diploma di Liceo Scientifico - Scienze Applicate',
        'education2-school': 'Ettore Conti, Milano',
        'education2-period': '2016 - 2021',
        'education2-description': 'Diploma con specializzazione in scienze applicate e informatica.',
        'skills-learned': 'Competenze acquisite:',
        'projects-title': 'Progetti',
        'project1-title': 'Sito Web CV Self-Hosted',
        'project1-description': 'Sviluppo e hosting personale di questo sito web CV multilingue, gestito tramite infrastruttura self-hosted domestica.',
        'project1-period': 'Lug 2025',
        'project2-title': 'Software Inc. Print Manager',
        'project2-description': 'Tool web per ottimizzare la gestione dei contratti di stampa nel videogioco Software Inc. Include analisi di fattibilità, calcolo capacità e raccomandazioni strategiche.',
        'project2-period': 'Lug 2025',
        'project3-title': 'NAO Challenge 2020',
        'project3-description': 'Competizione di robotica con robot umanoide NAO. Partecipazione alle fasi di selezione e regionali con focus su programmazione e lavoro di squadra.',
        'project3-period': 'Nov 2019 - Feb 2020',
        'view-project': 'Stai guardando il progetto!',
        'view-github': 'Visualizza su GitHub',
        'rights': 'Tutti i diritti riservati.'
    },
    en: {
        'job-title': 'Computer Science Student for Digital Communication',
        'location': 'Milan, Italy',
        'about-title': 'About Me',
        'about-description': 'Hi! I am a Computer Science for Digital Communication student at the University of Milan. I am passionate about technology, computers and software, and I enjoy exploring new solutions to solve practical problems. Among my interests are also video games and transportation vehicles, with a particular focus on innovations such as autonomous driving and intelligent systems applied to mobility.<br><br>I am also passionate about self-managed systems. I have chosen to personally host this website at my home and manage various self-hosted applications. This experience allows me to explore technological infrastructures more deeply and develop practical skills that I consider fundamental. <br><br>My goal is to deepen and share the knowledge I acquire, so that I can contribute to projects and sectors that I am passionate about, with a particular focus on advanced technological solutions.',
        'skills-title': 'Skills',
        'frontend-title': 'Frontend',
        'backend-title': 'Backend',
        'database-title': 'Database',
        'tools-title': 'Tools',
        'languages-title': 'Languages',
        'italian-title': 'Italian',
        'english-title': 'English',
        'native-level': 'Native',
        'b2-level': 'B2 (not certified)',
        'experience-title': 'Volunteer Experience',
        'volunteer1-title': 'Middle School Group Educator',
        'volunteer1-organization': 'Oratorio Santa Maria di Lourdes, Milan',
        'volunteer1-period': 'Oct 2020 - Present',
        'volunteer1-description': `
            <li>Educational support in the growth journey of middle school students</li>
            <li>Organization of recreational activities and sharing moments</li>
            <li>Support in group dynamics and interpersonal relationships</li>
            <li>Collaboration with other educators and oratory coordinators</li>
        `,
        'education-title': 'Education',
        'education1-title': 'Bachelor\'s Degree in Computer Science for Digital Communication',
        'education1-school': 'University of Milan',
        'education1-period': 'Sep 2021 - Sep 2026 (ongoing)',
        'education1-description': 'Bachelor\'s degree in Computer Science and Technologies with focus on digital communication.',
        'education2-title': 'High School Diploma - Applied Sciences',
        'education2-school': 'Ettore Conti, Milan',
        'education2-period': '2016 - 2021',
        'education2-description': 'Diploma with specialization in applied sciences and computer science.',
        'skills-learned': 'Skills acquired:',
        'projects-title': 'Projects',
        'project1-title': 'Self-Hosted CV Website',
        'project1-description': 'Development and personal hosting of this multilingual CV website, managed through domestic self-hosted infrastructure.',
        'project1-period': 'Jul 2025',
        'project2-title': 'Software Inc. Print Manager',
        'project2-description': 'Web tool to optimize print contract management in the Software Inc. video game. Includes feasibility analysis, capacity calculation and strategic recommendations.',
        'project2-period': 'Jul 2025',
        'project3-title': 'NAO Challenge 2020',
        'project3-description': 'Robotics competition with NAO humanoid robot. Participation in selection and regional phases with focus on programming and teamwork.',
        'project3-period': 'Nov 2019 - Feb 2020',
        'view-project': 'You\'re viewing the project!',
        'view-github': 'View on GitHub',
        'rights': 'All rights reserved.'
    }
};

// Lingua corrente
let currentLanguage = 'it';

// Funzione per cambiare lingua
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Aggiorna l'attributo lang del documento
    document.documentElement.lang = lang;
    
    // Aggiorna lo stato attivo dei pulsanti
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Aggiorna tutti gli elementi con data-key
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'UL') {
                // Per le liste, sostituisci l'HTML interno
                element.innerHTML = translations[lang][key];
            } else if (key === 'about-description') {
                // Per la descrizione about, usa innerHTML per supportare <br>
                element.innerHTML = translations[lang][key];
            } else {
                // Per altri elementi, sostituisci il testo
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Salva la preferenza nel localStorage
    localStorage.setItem('preferred-language', lang);
    
    // Aggiorna il titolo della pagina
    document.title = `Filippo Moscatelli - ${lang === 'it' ? 'CV' : 'Resume'}`;
    
    // Track language change in Umami
    if (typeof umami !== 'undefined') {
        umami.track('language-change', { language: lang });
    }
}

// Funzione per rilevare la lingua preferita
function detectPreferredLanguage() {
    // Controlla se c'è una preferenza salvata
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'it' || savedLang === 'en')) {
        return savedLang;
    }
    
    // Altrimenti usa la lingua del browser
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('it')) {
        return 'it';
    } else {
        return 'en';
    }
}

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

// Funzione per configurare il tracking di Umami
function setupUmamiTracking() {
    // Track clicks sui link esterni
    document.querySelectorAll('a[href^="http"], a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.target.href;
            const linkText = e.target.textContent.trim();
            
            if (typeof umami !== 'undefined') {
                if (href.includes('linkedin')) {
                    umami.track('social-link-click', { platform: 'linkedin' });
                } else if (href.includes('github.com/filippogrande')) {
                    umami.track('social-link-click', { platform: 'github-profile' });
                } else if (href.includes('github.com') && href.includes('Software-Inc-Print-Manager')) {
                    umami.track('project-link-click', { project: 'software-inc-print-manager' });
                } else if (href.includes('github.com')) {
                    umami.track('project-link-click', { project: 'github-other' });
                } else if (href.includes('mailto:')) {
                    umami.track('contact-click', { method: 'email' });
                } else {
                    umami.track('external-link-click', { url: href, text: linkText });
                }
            }
        });
    });
    
    // Track page language on load
    if (typeof umami !== 'undefined') {
        setTimeout(() => {
            umami.track('page-language', { language: currentLanguage });
        }, 1000);
    }
    
    // Track scroll depth
    let scrollDepthTracked = {
        25: false,
        50: false,
        75: false,
        100: false
    };
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        Object.keys(scrollDepthTracked).forEach(depth => {
            if (scrollPercent >= parseInt(depth) && !scrollDepthTracked[depth]) {
                scrollDepthTracked[depth] = true;
                if (typeof umami !== 'undefined') {
                    umami.track('scroll-depth', { percentage: depth });
                }
            }
        });
    });
    
    // Track time on page intervals
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 10;
        // Track ogni 30 secondi, 1 minuto, 2 minuti, 5 minuti
        if ([30, 60, 120, 300].includes(timeOnPage) && typeof umami !== 'undefined') {
            umami.track('time-on-page', { seconds: timeOnPage });
        }
    }, 10000); // Ogni 10 secondi
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
        
        // Track back to top click in Umami
        if (typeof umami !== 'undefined') {
            umami.track('back-to-top-click');
        }
    });
}

// Inizializzazione quando il DOM è carico
document.addEventListener('DOMContentLoaded', () => {
    // Rileva e imposta la lingua preferita
    const preferredLang = detectPreferredLanguage();
    changeLanguage(preferredLang);
    
    // Aggiungi event listeners per i pulsanti delle lingue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Aggiungi animazioni e effetti
    addSmoothAnimations();
    addDynamicEffects();
    setupPrintHandler();
    addKeyboardSupport();
    setupBackToTop();
    setupUmamiTracking();
    
    // Messaggio di benvenuto nella console (easter egg per sviluppatori)
    console.log(`
    🚀 Ciao! Sono Filippo Moscatelli
    
    Scorciatoie da tastiera:
    • Alt + I: Cambia in Italiano
    • Alt + E: Cambia in Inglese
    
    Grazie per aver visitato il mio CV!
    `);
});

// Gestione degli errori
window.addEventListener('error', (e) => {
    console.error('Si è verificato un errore:', e.error);
});

// Export per possibili test (se necessario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        translations,
        changeLanguage,
        detectPreferredLanguage
    };
}
