// INIZIO DEBUG IMMEDIATO
console.log('===== SCRIPT LOADING =====');
console.log('Script started at:', new Date().toISOString());
console.log('User agent:', navigator.userAgent);
console.log('Current URL:', window.location.href);
console.log('Document ready state:', document.readyState);

// Test immediato di Umami
console.log('Immediate Umami check:', typeof umami !== 'undefined' ? 'AVAILABLE' : 'NOT AVAILABLE');

// Log di tutte le variabili globali
console.log('Window object keys (first 10):', Object.keys(window).slice(0, 10));

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

// Debug immediato - controlla Umami ogni secondo per 10 secondi
let umamiCheckCount = 0;
const umamiChecker = setInterval(() => {
    umamiCheckCount++;
    console.log(`🔍 Umami check #${umamiCheckCount}:`, {
        available: typeof umami !== 'undefined',
        windowUmami: !!window.umami,
        timestamp: new Date().toISOString()
    });
    
    if (typeof umami !== 'undefined' || umamiCheckCount >= 10) {
        if (typeof umami !== 'undefined') {
            console.log('🎉 Umami became available!', umami);
        } else {
            console.log('⏰ Stopped checking, Umami not found after 10 seconds');
        }
        clearInterval(umamiChecker);
    }
}, 1000);

// Ascolta quando gli script vengono caricati
document.addEventListener('DOMContentLoaded', () => {
    // Monitor script loading
    const scripts = document.querySelectorAll('script[src*="analytics"]');
    scripts.forEach((script, index) => {
        console.log(`📜 Found analytics script #${index}:`, {
            src: script.src,
            websiteId: script.getAttribute('data-website-id'),
            endpoint: script.getAttribute('data-endpoint')
        });
        
        script.addEventListener('load', () => {
            console.log(`✅ Script #${index} loaded successfully`);
            setTimeout(() => {
                console.log('Post-load Umami check:', typeof umami !== 'undefined');
            }, 100);
        });
        
        script.addEventListener('error', (error) => {
            console.log(`❌ Script #${index} failed to load:`, error);
        });
    });
});

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
    
    // Track language change in Umami (solo per cambi effettivi)
    console.log('Tracking language change to:', lang);
    if (typeof umami !== 'undefined') {
        // Solo traccia se è un cambio effettivo, non il caricamento iniziale
        if (document.readyState === 'complete') {
            umami.track('lang-change', { 
                language: lang,
                previous_language: currentLanguage !== lang ? currentLanguage : null,
                is_user_action: true
            });
            console.log('Umami language change tracking sent');
        }
    } else {
        console.log('Umami not available for language change tracking');
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
    console.log('=== Setting up Umami tracking ===');
    
    // Trova tutti i link cliccabili
    const allLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"]');
    console.log(`Found ${allLinks.length} trackable links:`, 
        Array.from(allLinks).map(link => ({ href: link.href, text: link.textContent.trim() }))
    );
    
    // Track clicks sui link esterni
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.target.href;
            const linkText = e.target.textContent.trim();
            
            console.log('Link clicked:', { href, linkText, element: e.target });
            
            if (typeof umami !== 'undefined') {
                let tracked = false;
                
                if (href.includes('linkedin.com')) {
                    umami.track('social-click', { platform: 'linkedin', text: linkText });
                    console.log('✅ Tracked: LinkedIn click');
                    tracked = true;
                } else if (href.includes('mailto:filipp28mo@gmail.com')) {
                    umami.track('contact-email', { method: 'email', address: 'filipp28mo@gmail.com' });
                    console.log('✅ Tracked: Email contact click');
                    tracked = true;
                } else if (href.includes('github.com/filippogrande/Software-Inc-Print-Manager')) {
                    umami.track('project-click', { 
                        project: 'software-inc-print-manager', 
                        url: href,
                        text: linkText 
                    });
                    console.log('✅ Tracked: Software Inc Print Manager project click');
                    tracked = true;
                } else if (href.includes('github.com/filippogrande')) {
                    umami.track('social-click', { 
                        platform: 'github-profile', 
                        url: href,
                        text: linkText 
                    });
                    console.log('✅ Tracked: GitHub profile click');
                    tracked = true;
                } else if (href.includes('github.com')) {
                    umami.track('project-click', { 
                        project: 'github-other', 
                        url: href,
                        text: linkText 
                    });
                    console.log('✅ Tracked: Other GitHub project click');
                    tracked = true;
                } else if (href.includes('mailto:')) {
                    umami.track('contact-email', { 
                        method: 'email', 
                        address: href.replace('mailto:', ''),
                        text: linkText 
                    });
                    console.log('✅ Tracked: Email contact click');
                    tracked = true;
                } else {
                    umami.track('external-click', { 
                        url: href, 
                        text: linkText,
                        domain: new URL(href).hostname
                    });
                    console.log('✅ Tracked: External link click');
                    tracked = true;
                }
                
                if (!tracked) {
                    console.log('⚠️ Link not tracked:', { href, linkText });
                }
            } else {
                console.log('❌ Umami not available for link tracking');
            }
        });
    });
    
    // Track current language state (separato dal page-load)
    console.log('Setting up current language state tracking for:', currentLanguage);
    if (typeof umami !== 'undefined') {
        setTimeout(() => {
            umami.track('lang-state', { 
                language: currentLanguage,
                is_default: currentLanguage === 'it' ? true : false
            });
            console.log('Umami current language state tracking sent');
        }, 3000); // Dopo il page-load tracking
    } else {
        console.log('Umami not available for current language state tracking');
    }
    
    // Track scroll depth con più dettagli
    let scrollDepthTracked = {
        10: false,
        25: false,
        50: false,
        75: false,
        90: false,
        100: false
    };
    
    let maxScrollReached = 0;
    let scrollStartTime = Date.now();
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        // Traccia la percentuale massima raggiunta
        if (scrollPercent > maxScrollReached) {
            maxScrollReached = scrollPercent;
        }
        
        // Track punti di scroll specifici
        Object.keys(scrollDepthTracked).forEach(depth => {
            if (scrollPercent >= parseInt(depth) && !scrollDepthTracked[depth]) {
                scrollDepthTracked[depth] = true;
                const timeToReach = Math.round((Date.now() - scrollStartTime) / 1000);
                
                if (typeof umami !== 'undefined') {
                    umami.track('scroll-depth', { 
                        percentage: depth,
                        time_to_reach: timeToReach,
                        max_reached: maxScrollReached
                    });
                    console.log(`Scroll depth ${depth}% reached in ${timeToReach}s`);
                }
            }
        });
    });
    
    // Track scroll summary quando l'utente lascia la pagina
    window.addEventListener('beforeunload', () => {
        if (typeof umami !== 'undefined' && maxScrollReached > 0) {
            umami.track('scroll-summary', {
                max_scroll_reached: maxScrollReached,
                total_time_on_page: Math.round((Date.now() - scrollStartTime) / 1000)
            });
        }
    });
    
    // Track time on page intervals
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 10;
        // Track ogni 30 secondi, 1 minuto, 2 minuti, 5 minuti
        if ([30, 60, 120, 300].includes(timeOnPage) && typeof umami !== 'undefined') {
            umami.track('time-milestone', { seconds: timeOnPage });
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
            umami.track('back-to-top');
        }
    });
}

// Funzione per testare tutti i tipi di tracking Umami
function testAllUmamiMethods() {
    console.log('=== Testing All Umami Methods ===');
    
    if (typeof umami === 'undefined') {
        console.log('❌ Umami not available, cannot test');
        return;
    }
    
    console.log('🧪 Testing basic pageview tracking...');
    try {
        umami.track();
        console.log('✅ Basic pageview sent');
    } catch (error) {
        console.error('❌ Basic pageview failed:', error);
    }
    
    console.log('🧪 Testing custom pageview...');
    try {
        umami.track({
            website: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
            url: '/test-page',
            title: 'Test Page'
        });
        console.log('✅ Custom pageview sent');
    } catch (error) {
        console.error('❌ Custom pageview failed:', error);
    }
    
    console.log('🧪 Testing simple event...');
    try {
        umami.track('test-simple');
        console.log('✅ Simple event sent');
    } catch (error) {
        console.error('❌ Simple event failed:', error);
    }
    
    console.log('🧪 Testing event with data...');
    try {
        umami.track('test-data', { 
            method: 'manual',
            timestamp: new Date().toISOString(),
            number: 123
        });
        console.log('✅ Event with data sent');
    } catch (error) {
        console.error('❌ Event with data failed:', error);
    }
    
    console.log('🧪 Testing session identification...');
    try {
        umami.identify('test-user-123');
        console.log('✅ Session identification sent');
    } catch (error) {
        console.error('❌ Session identification failed:', error);
    }
    
    console.log('🧪 Testing session with data...');
    try {
        umami.identify('test-user-123', {
            name: 'Test User',
            type: 'debug',
            browser: navigator.userAgent.split(' ')[0]
        });
        console.log('✅ Session with data sent');
    } catch (error) {
        console.error('❌ Session with data failed:', error);
    }
    
    console.log('=== End All Umami Tests ===');
}

// Funzione per testare Umami
function testUmamiTracking() {
    console.log('=== Testing Umami Tracking ===');
    console.log('typeof umami:', typeof umami);
    console.log('umami object:', umami);
    console.log('window.umami:', window.umami);
    
    // Test caricamento script
    const umamiScript = document.querySelector('script[data-website-id]');
    if (umamiScript) {
        console.log('✅ Umami script tag found:', {
            src: umamiScript.src,
            websiteId: umamiScript.getAttribute('data-website-id'),
            endpoint: umamiScript.getAttribute('data-endpoint'),
            loaded: umamiScript.readyState || 'unknown'
        });
    } else {
        console.log('❌ Umami script tag not found');
    }
    
    // Test network availability
    fetch('/analytics/script.js', { method: 'HEAD' })
        .then(response => {
            console.log('✅ Script endpoint reachable:', response.status);
        })
        .catch(error => {
            console.log('❌ Script endpoint failed:', error);
        });
    
    // Test API endpoint con diversi tipi di payload
    console.log('🧪 Testing API endpoint with pageview...');
    fetch('/analytics/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'pageview',
            payload: {
                website: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
                url: '/test-manual-pageview',
                title: 'Manual Test Pageview',
                hostname: window.location.hostname,
                language: navigator.language,
                screen: `${screen.width}x${screen.height}`
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Pageview API test result:', data);
    })
    .catch(error => {
        console.log('❌ Pageview API failed:', error);
    });
    
    setTimeout(() => {
        console.log('🧪 Testing API endpoint with event...');
        fetch('/analytics/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'event',
                payload: {
                    website: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
                    url: window.location.pathname,
                    name: 'test-manual-event',
                    data: { 
                        timestamp: new Date().toISOString(),
                        test: 'direct-api',
                        method: 'fetch'
                    }
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('✅ Event API test result:', data);
        })
        .catch(error => {
            console.log('❌ Event API failed:', error);
        });
    }, 500);
    
    if (typeof umami !== 'undefined') {
        console.log('Umami is available, testing track function...');
        try {
            umami.track('test-event', { test: 'manual-test', timestamp: new Date().toISOString() });
            console.log('✅ Test event sent successfully');
            
            // Test con evento più semplice
            umami.track('simple-test');
            console.log('✅ Simple test event sent');
        } catch (error) {
            console.error('❌ Error sending test event:', error);
        }
    } else {
        console.log('❌ Umami is not available');
        
        // Forza un reload dello script se non è disponibile
        console.log('🔄 Attempting to reload Umami script...');
        const script = document.createElement('script');
        script.src = '/analytics/script.js';
        script.setAttribute('data-website-id', 'a912f285-ced0-4c7f-9260-434d0ee8674a');
        script.setAttribute('data-endpoint', '/analytics/api');
        script.onload = () => {
            console.log('🔄 Script reloaded, testing again...');
            setTimeout(() => {
                if (typeof umami !== 'undefined') {
                    console.log('✅ Umami now available after reload!');
                    umami.track('test-after-reload', { reloaded: true });
                } else {
                    console.log('❌ Umami still not available after reload');
                }
            }, 1000);
        };
        script.onerror = (error) => {
            console.log('❌ Script reload failed:', error);
        };
        document.head.appendChild(script);
    }
    console.log('=== End Umami Test ===');
    
    // Aggiungi test completo dopo i test base
    setTimeout(() => {
        testAllUmamiMethods();
    }, 1000);
}

// Inizializzazione quando il DOM è carico
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Starting initialization...');
    console.log('Current URL:', window.location.href);
    console.log('Document ready state:', document.readyState);
    
    // Test immediato di Umami
    console.log('Initial Umami check:');
    console.log('- typeof umami:', typeof umami);
    console.log('- window.umami:', window.umami);
    
    // Rileva e imposta la lingua preferita
    const preferredLang = detectPreferredLanguage();
    console.log('Detected preferred language:', preferredLang);
    
    // Track della lingua iniziale PRIMA di cambiarla
    setTimeout(() => {
        console.log('🔄 Attempting to track initial page load...');
        console.log('Tracking initial page load with language:', preferredLang);
        console.log('Umami available for tracking?', typeof umami !== 'undefined');
        
        if (typeof umami !== 'undefined') {
            try {
                umami.track('page-load', { 
                    initial_language: preferredLang,
                    from_storage: localStorage.getItem('preferred-language') ? true : false,
                    browser_language: navigator.language || navigator.userLanguage,
                    timestamp: new Date().toISOString(),
                    test: 'initial-load'
                });
                console.log('✅ Umami page load tracking sent successfully');
            } catch (error) {
                console.error('❌ Error sending page load tracking:', error);
            }
        } else {
            console.log('❌ Umami not available for page load tracking');
        }
    }, 2000);
    
    changeLanguage(preferredLang);
    
    // Aggiungi event listeners per i pulsanti delle lingue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = btn.getAttribute('data-lang');
            console.log('Language button clicked:', lang);
            
            // Track button click in Umami
            if (typeof umami !== 'undefined') {
                umami.track('lang-button', { language: lang, from: currentLanguage });
                console.log('Umami button click tracking sent');
            } else {
                console.log('Umami not available for button tracking');
            }
            
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
    
    Debug Commands:
    • testUmamiTracking() - Testa il funzionamento di Umami
    • testAllUmamiMethods() - Testa tutti i metodi di tracking
    • debugUmamiProxy() - Debug avanzato del proxy
    • testTrackerConfiguration() - Mostra configurazione tracker
    • switchToManualTracking() - Passa al tracking manuale
    
    Grazie per aver visitato il mio CV!
    `);
    
    // Test Umami dopo il caricamento completo
    setTimeout(() => {
        testUmamiTracking();
    }, 3000);
});

// Gestione degli errori
window.addEventListener('error', (e) => {
    console.error('❌ ERRORE JAVASCRIPT CATTURATO:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error,
        stack: e.error ? e.error.stack : 'No stack trace'
    });
});

// Gestione degli errori di promesse non catturate
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ PROMISE REJECTION NON GESTITA:', e.reason);
});

// Log di fine script
console.log('===== SCRIPT LOADED SUCCESSFULLY =====');
console.log('All functions defined. Ready for DOM events.');

// Verifica finale se tutto è stato caricato
setTimeout(() => {
    console.log('===== FINAL STATUS CHECK =====');
    console.log('Document ready state:', document.readyState);
    console.log('Umami available:', typeof umami !== 'undefined');
    console.log('Script functions available:', {
        testUmamiTracking: typeof testUmamiTracking !== 'undefined',
        testAllUmamiMethods: typeof testAllUmamiMethods !== 'undefined',
        beforeSendHandler: typeof beforeSendHandler !== 'undefined'
    });
}, 5000);

// Export per possibili test (se necessario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        translations,
        changeLanguage,
        detectPreferredLanguage
    };
}

// Funzione per intercettare i dati prima dell'invio (debugging)
function beforeSendHandler(type, payload) {
    console.log('🚀 Before Send Handler:', {
        type: type,
        payload: payload,
        timestamp: new Date().toISOString()
    });
    
    // Log dettagliato del payload
    if (payload) {
        console.log('📊 Payload details:', {
            website: payload.website,
            url: payload.url,
            name: payload.name,
            data: payload.data,
            title: payload.title,
            referrer: payload.referrer,
            screen: payload.screen,
            language: payload.language
        });
    }
    
    // Continua con l'invio (return payload)
    // Per cancellare l'invio, return false
    return payload;
}

// Rendi la funzione disponibile globalmente per Umami
window.beforeSendHandler = beforeSendHandler;

// Funzione per testare la configurazione del tracker
function testTrackerConfiguration() {
    console.log('=== Testing Tracker Configuration ===');
    
    const script = document.querySelector('script[data-website-id]');
    if (script) {
        console.log('📋 Current Umami Configuration:', {
            src: script.src,
            websiteId: script.getAttribute('data-website-id'),
            endpoint: script.getAttribute('data-endpoint'),
            tag: script.getAttribute('data-tag'),
            domains: script.getAttribute('data-domains'),
            autoTrack: script.getAttribute('data-auto-track'),
            excludeSearch: script.getAttribute('data-exclude-search'),
            excludeHash: script.getAttribute('data-exclude-hash'),
            doNotTrack: script.getAttribute('data-do-not-track'),
            beforeSend: script.getAttribute('data-before-send')
        });
    }
    
    // Test del dominio corrente
    console.log('🌐 Current domain info:', {
        hostname: window.location.hostname,
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
    });
    
    console.log('=== End Configuration Test ===');
}

// Funzione per creare versione manuale del tracker
function switchToManualTracking() {
    console.log('🔄 Switching to manual tracking mode...');
    
    // Rimuovi script esistente
    const existingScript = document.querySelector('script[data-website-id]');
    if (existingScript) {
        existingScript.remove();
        console.log('🗑️ Removed existing auto-track script');
    }
    
    // Crea nuovo script con auto-track disabilitato
    const script = document.createElement('script');
    script.defer = true;
    script.src = '/analytics/script.js';
    script.setAttribute('data-website-id', 'a912f285-ced0-4c7f-9260-434d0ee8674a');
    script.setAttribute('data-endpoint', '/analytics/api');
    script.setAttribute('data-tag', 'cv-manual');
    script.setAttribute('data-auto-track', 'false');
    script.setAttribute('data-before-send', 'beforeSendHandler');
    
    script.onload = () => {
        console.log('✅ Manual tracking script loaded');
        
        // Test tracking manuale
        setTimeout(() => {
            if (typeof umami !== 'undefined') {
                console.log('🧪 Testing manual tracking...');
                
                // Pageview manuale
                umami.track();
                console.log('📄 Manual pageview sent');
                
                // Evento manuale
                umami.track('manual-test', { mode: 'manual', timestamp: Date.now() });
                console.log('🎯 Manual event sent');
            } else {
                console.log('❌ Umami not available after manual script load');
            }
        }, 1000);
    };
    
    script.onerror = (error) => {
        console.log('❌ Manual script failed to load:', error);
    };
    
    document.head.appendChild(script);
    console.log('🆕 Added manual tracking script');
}

// Funzione per debug avanzato del proxy e dell'API
function debugUmamiProxy() {
    console.log('=== Debug Umami Proxy ===');
    
    // Test dell'endpoint collect (alternativo)
    console.log('🔍 Testing /analytics/api/collect endpoint...');
    fetch('/analytics/api/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            website: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
            name: 'test-collect',
            data: { method: 'collect-endpoint' }
        })
    })
    .then(response => {
        console.log('Collect endpoint status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('✅ Collect endpoint result:', data);
    })
    .catch(error => {
        console.log('❌ Collect endpoint failed:', error);
    });
    
    // Verifica headers e risposta completa
    console.log('🔍 Testing with full headers...');
    fetch('/analytics/api/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': navigator.userAgent,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
            type: 'event',
            payload: {
                website: 'a912f285-ced0-4c7f-9260-434d0ee8674a',
                url: window.location.pathname,
                name: 'test-full-headers',
                data: { 
                    debug: true,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent.substring(0, 50)
                }
            }
        })
    })
    .then(response => {
        console.log('Full test - Status:', response.status);
        console.log('Full test - Headers:', Object.fromEntries(response.headers.entries()));
        return response.text();
    })
    .then(text => {
        console.log('Full test - Raw response:', text);
        try {
            const json = JSON.parse(text);
            console.log('Full test - Parsed JSON:', json);
        } catch (e) {
            console.log('Full test - Not JSON response');
        }
    })
    .catch(error => {
        console.log('❌ Full test failed:', error);
    });
    
    console.log('=== End Proxy Debug ===');
}

// Rendi le funzioni di test disponibili globalmente per debug
window.testUmamiTracking = testUmamiTracking;
window.testAllUmamiMethods = testAllUmamiMethods;
window.debugUmamiProxy = debugUmamiProxy;
window.testTrackerConfiguration = testTrackerConfiguration;
window.switchToManualTracking = switchToManualTracking;
