/**
 * Language Management Module
 * Gestisce il cambio lingua e le traduzioni del sito
 */

// Traduzioni complete
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

// Classe per la gestione delle lingue
class LanguageManager {
    constructor() {
        this.currentLanguage = 'it';
        this.translations = translations;
        this.initialized = false;
    }

    /**
     * Rileva la lingua preferita dall'utente
     * @returns {string} Codice lingua ('it' o 'en')
     */
    detectPreferredLanguage() {
        // Controlla se c'è una preferenza salvata
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && (savedLang === 'it' || savedLang === 'en')) {
            return savedLang;
        }
        
        // Altrimenti usa la lingua del browser
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith('it') ? 'it' : 'en';
        return detectedLang;
    }

    /**
     * Cambia la lingua del sito
     * @param {string} lang - Codice lingua ('it' o 'en')
     */
    changeLanguage(lang) {
        const previousLanguage = this.currentLanguage;
        
        // Aggiorna la lingua corrente
        this.currentLanguage = lang;
        
        // Aggiorna l'attributo lang del documento
        document.documentElement.lang = lang;
        
        // Aggiorna lo stato attivo dei pulsanti
        this.updateLanguageButtons(lang);
        
        // Aggiorna tutti gli elementi con data-key
        this.translateElements(lang);
        
        // Salva la preferenza nel localStorage
        localStorage.setItem('preferred-language', lang);
        
        // Aggiorna il titolo della pagina
        const newTitle = `Filippo Moscatelli - ${lang === 'it' ? 'CV' : 'Resume'}`;
        document.title = newTitle;
        
        // Track language change se Umami è disponibile
        this.trackLanguageChange(previousLanguage, lang);
        
        // Emetti evento personalizzato per altri moduli
        this.emitLanguageChangeEvent(previousLanguage, lang);
    }

    /**
     * Aggiorna lo stato attivo dei pulsanti lingua
     * @param {string} lang - Lingua attiva
     */
    updateLanguageButtons(lang) {
        const langButtons = document.querySelectorAll('.lang-btn');
        console.log('🌐 Found', langButtons.length, 'language buttons');
        
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
                console.log('🌐 Activated button for language:', lang);
            }
        });
    }

    /**
     * Traduce tutti gli elementi con data-key
     * @param {string} lang - Lingua target
     */
    translateElements(lang) {
        const elementsToTranslate = document.querySelectorAll('[data-key]');
        console.log('🌐 Found', elementsToTranslate.length, 'elements to translate');
        
        let translatedCount = 0;
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-key');
            if (this.translations[lang] && this.translations[lang][key]) {
                if (element.tagName === 'UL') {
                    // Per le liste, sostituisci l'HTML interno
                    element.innerHTML = this.translations[lang][key];
                } else if (key === 'about-description') {
                    // Per la descrizione about, usa innerHTML per supportare <br>
                    element.innerHTML = this.translations[lang][key];
                } else {
                    // Per altri elementi, sostituisci il testo
                    element.textContent = this.translations[lang][key];
                }
                translatedCount++;
            } else {
                console.log('⚠️ Translation missing for key:', key, 'language:', lang);
            }
        });
        
        console.log('🌐 Translated', translatedCount, 'elements');
    }

    /**
     * Traccia il cambio lingua in Umami
     * @param {string} previousLanguage - Lingua precedente
     * @param {string} newLanguage - Nuova lingua
     */
    trackLanguageChange(previousLanguage, newLanguage) {
        console.log('🌐 Language change detected:', previousLanguage, '→', newLanguage);
        
        // Non facciamo più tracking diretto qui - ora gestito da analytics.js
        // Il tracking avviene tramite CustomEvent 'languageChanged'
        console.log('📊 Language tracking delegated to analytics.js via CustomEvent');
    }

    /**
     * Emette un evento personalizzato per il cambio lingua
     * @param {string} previousLanguage - Lingua precedente
     * @param {string} newLanguage - Nuova lingua
     */
    emitLanguageChangeEvent(previousLanguage, newLanguage) {
        const event = new CustomEvent('languageChanged', {
            detail: {
                previousLanguage,
                newLanguage,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
        console.log('🌐 Language change event emitted:', previousLanguage, '→', newLanguage);
    }

    /**
     * Inizializza i listener per i pulsanti lingua
     */
    initializeLanguageButtons() {
        console.log('🌐 Initializing language buttons...');
        
        // Aspetta che il DOM sia completamente caricato
        const buttons = document.querySelectorAll('.lang-btn');
        console.log('🌐 Found language buttons:', buttons.length);
        
        if (buttons.length === 0) {
            console.warn('⚠️ No language buttons found! Retrying in 500ms...');
            setTimeout(() => this.initializeLanguageButtons(), 500);
            return;
        }
        
        buttons.forEach((btn, index) => {
            console.log(`🔘 Setting up button ${index}:`, {
                element: btn,
                dataLang: btn.getAttribute('data-lang'),
                textContent: btn.textContent,
                classList: btn.classList.toString()
            });
            
            // Rimuovi eventuali listener esistenti
            btn.removeEventListener('click', this.handleLanguageButtonClick);
            
            // Aggiungi il nuovo listener con bind
            btn.addEventListener('click', (e) => this.handleLanguageButtonClick(e, btn));
        });
        
        console.log('🌐 Language buttons initialized successfully');
    }
    
    /**
     * Gestisce il click sui pulsanti lingua
     */
    handleLanguageButtonClick(e, btn) {
        e.preventDefault();
        e.stopPropagation();
        
        const lang = e.target.getAttribute('data-lang') || btn.getAttribute('data-lang');
        console.log('🔘 Language button clicked:', {
            targetLang: lang,
            currentLang: this.currentLanguage,
            button: btn,
            target: e.target
        });
        
        if (!lang) {
            console.error('❌ No language found on button:', btn);
            return;
        }
        
        if (lang === this.currentLanguage) {
            console.log('⚠️ Same language selected, no change needed');
            return;
        }
        
        // Il tracking avviene tramite CustomEvent 'languageChanged' in analytics.js
        console.log('🔄 Language button clicked, delegating tracking to analytics.js');
        
        this.changeLanguage(lang);
        console.log('🔘 Language changed successfully to:', lang);
    }

    /**
     * Aggiunge supporto per scorciatoie da tastiera
     */
    addKeyboardSupport() {
        console.log('🌐 Adding keyboard support...');
        
        document.addEventListener('keydown', (e) => {
            // Alt + I per italiano
            if (e.altKey && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                this.changeLanguage('it');
                console.log('⌨️ Keyboard shortcut: Italian');
            }
            // Alt + E per inglese
            if (e.altKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                this.changeLanguage('en');
                console.log('⌨️ Keyboard shortcut: English');
            }
        });
        
        console.log('🌐 Keyboard support added');
    }

    /**
     * Inizializza il gestore delle lingue
     */
    initialize() {
        if (this.initialized) {
            console.log('🌐 LanguageManager already initialized');
            return;
        }

        console.log('🌐 Initializing LanguageManager...');
        
        // Rileva e imposta la lingua preferita
        const preferredLang = this.detectPreferredLanguage();
        this.changeLanguage(preferredLang);
        
        // Inizializza i pulsanti lingua
        this.initializeLanguageButtons();
        
        // Aggiungi supporto tastiera
        this.addKeyboardSupport();
        
        this.initialized = true;
        console.log('🌐 LanguageManager initialized successfully with language:', preferredLang);
    }

    /**
     * Getter per la lingua corrente
     * @returns {string} Lingua corrente
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Controlla se una traduzione esiste
     * @param {string} key - Chiave di traduzione
     * @param {string} lang - Lingua (opzionale, usa quella corrente)
     * @returns {boolean} True se la traduzione esiste
     */
    hasTranslation(key, lang = null) {
        const targetLang = lang || this.currentLanguage;
        return this.translations[targetLang] && this.translations[targetLang][key];
    }

    /**
     * Ottiene una traduzione specifica
     * @param {string} key - Chiave di traduzione
     * @param {string} lang - Lingua (opzionale, usa quella corrente)
     * @returns {string|null} Traduzione o null se non trovata
     */
    getTranslation(key, lang = null) {
        const targetLang = lang || this.currentLanguage;
        if (this.hasTranslation(key, targetLang)) {
            return this.translations[targetLang][key];
        }
        console.warn('🌐 Translation not found:', key, 'for language:', targetLang);
        return null;
    }
}

// Crea istanza globale del gestore lingue
const languageManager = new LanguageManager();

// Esporta per uso in altri moduli
if (typeof window !== 'undefined') {
    window.LanguageManager = LanguageManager; // Esporta la CLASSE
    window.languageManager = languageManager; // Esporta l'ISTANZA
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageManager, languageManager, translations };
}

console.log('🌐 Language module loaded successfully');
