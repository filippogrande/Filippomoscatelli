// PDF Generation Module
// Gestione della generazione e download dei PDF

// Funzione principale per scaricare PDF (approccio migliorato con gestione CSS inline)
async function downloadPDF() {
    const link = document.getElementById('downloadPDF');
    const originalText = link.textContent;
    
    // Mostra loading
    link.textContent = currentLanguage === 'it' ? 'Generando PDF...' : 'Generating PDF...';
    link.style.pointerEvents = 'none';
    link.style.opacity = '0.6';
    
    console.log('Inizio generazione PDF...');
    
    let timeoutId;
    let isCompleted = false;
    
    // Funzione per ripristinare il pulsante
    function resetButton() {
        if (!isCompleted) {
            isCompleted = true;
            link.textContent = originalText;
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }
    
    // Timeout di sicurezza (15 secondi - aumentato per debug)
    timeoutId = setTimeout(() => {
        if (!isCompleted) {
            console.log('Timeout raggiunto, operazione annullata');
            resetButton();
            
            const timeoutMessage = currentLanguage === 'it' ? 
                'Timeout nella generazione del PDF. Riprova.' : 
                'PDF generation timeout. Please try again.';
            
            showNotification(timeoutMessage, 'error');
        }
    }, 15000);
    
    try {
        // Prepara il documento per il PDF
        await prepareDocumentForPDF();
        
        // Nascondi temporaneamente elementi non necessari per il PDF
        const elementsToHide = [
            '.language-selector',
            '.back-to-top',
            '.pdf-download-link',
            '.word-download-link'
        ];
        
        const hiddenElements = [];
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none') {
                    hiddenElements.push({element: el, originalDisplay: el.style.display});
                    el.style.display = 'none';
                }
            });
        });
        
        // Usa direttamente il body per catturare tutto il contenuto
        const element = document.body;
        
        console.log('Elemento da renderizzare:', element);
        console.log('Numero di fogli di stile presenti:', document.styleSheets.length);
        
        // Lista dei fogli di stile per debug
        for (let i = 0; i < document.styleSheets.length; i++) {
            try {
                console.log(`Stylesheet ${i}:`, document.styleSheets[i].href || 'inline');
            } catch (e) {
                console.log(`Stylesheet ${i}: accesso negato (CORS)`);
            }
        }

        // Forza lo scroll in cima per catturare tutto
        window.scrollTo(0, 0);
        
        // Configurazione PDF ottimizzata per font e qualità del testo
        const opt = {
            margin: [5, 5, 5, 5], // Margini appropriati
            filename: `Filippo_Moscatelli_CV_${currentLanguage.toUpperCase()}.pdf`,
            image: { 
                type: 'jpeg', 
                quality: 0.95 // Qualità alta ma bilanciata
            },
            html2canvas: { 
                scale: 2.5, // Scala ottimale per qualità vs prestazioni
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                logging: false, // Disabilita logging per prestazioni
                letterRendering: true, // Importante per font rendering
                scrollX: 0,
                scrollY: 0,
                dpi: 192, // DPI ottimizzato per web-to-print
                foreignObjectRendering: false,
                // Configurazioni specifiche per font rendering
                pixelRatio: 1, // Standardizzato per consistenza
                removeContainer: false, // Mantieni per meglio controllo layout
                textBaseline: 'alphabetic', // Baseline per font corretti
                // Callback migliorato per gestione stili e font
                onclone: function(clonedDoc) {
                    console.log('onclone callback eseguito');
                    
                    // Forza il caricamento di font web specifici
                    const fontLinks = [
                        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
                    ];
                    
                    fontLinks.forEach(href => {
                        const link = clonedDoc.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = href;
                        clonedDoc.head.appendChild(link);
                    });
                    
                    // Copia tutti gli stili dal documento originale
                    const originalStylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
                    
                    originalStylesheets.forEach(styleSheet => {
                        if (styleSheet.tagName === 'LINK') {
                            const clonedLink = styleSheet.cloneNode(true);
                            clonedDoc.head.appendChild(clonedLink);
                        } else {
                            const clonedStyle = styleSheet.cloneNode(true);
                            clonedDoc.head.appendChild(clonedStyle);
                        }
                    });
                    
                    // Aggiungi stili critici per font rendering ottimizzato
                    const criticalStyles = clonedDoc.createElement('style');
                    criticalStyles.innerHTML = `
                        /* OVERRIDE STILI PER PDF CON FONT RENDERING OTTIMIZZATO */
                        * {
                            margin: 0 !important;
                            padding: 0 !important;
                            box-sizing: border-box !important;
                            /* Font rendering ottimizzato per PDF */
                            -webkit-font-smoothing: subpixel-antialiased !important;
                            -moz-osx-font-smoothing: auto !important;
                            text-rendering: geometricPrecision !important;
                            font-variant-ligatures: normal !important;
                            font-feature-settings: "kern" 1 !important;
                            letter-spacing: normal !important;
                            word-spacing: normal !important;
                        }
                        
                        /* Stili generali con font system sicuri */
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                            line-height: 1.4 !important;
                            color: #1f2937 !important;
                            background-color: #ffffff !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            font-size: 13px !important;
                            font-weight: 400 !important;
                        }
                        .container { 
                            max-width: 1200px !important;
                            margin: 0 auto !important;
                            padding: 0 1rem !important;
                        }
                        
                        /* Header compatto ma leggibile */
                        .header { 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            color: white !important;
                            padding: 1.2rem 0 !important;
                            margin-bottom: 0.8rem !important;
                        }
                        .language-selector, .back-to-top, .pdf-download-link, .word-download-link { 
                            display: none !important; 
                        }
                        
                        /* Sezioni ben spaziate - ridotte per compattezza */
                        .section { 
                            background: white !important;
                            margin-bottom: 0.3rem !important;
                            padding: 0.8rem !important;
                            border-radius: 6px !important;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                        }
                        
                        /* Main container ben spaziato */
                        .main {
                            margin-bottom: 1rem !important;
                        }
                        
                        /* Profilo ben proporzionato */
                        .profile-section { 
                            display: flex !important;
                            align-items: center !important;
                            gap: 1.5rem !important;
                        }
                        .profile-image img { 
                            width: 90px !important;
                            height: 90px !important;
                            border-radius: 50% !important;
                            border: 3px solid rgba(255,255,255,0.2) !important;
                        }
                        .name { 
                            font-size: 1.8rem !important;
                            font-weight: 700 !important;
                            margin-bottom: 0.3rem !important;
                            color: white !important;
                            line-height: 1.2 !important;
                            letter-spacing: -0.02em !important;
                        }
                        .title { 
                            font-size: 1rem !important;
                            margin-bottom: 0.8rem !important;
                            opacity: 0.9 !important;
                            color: white !important;
                            font-weight: 400 !important;
                        }
                        
                        /* Contatti ben leggibili */
                        .contact-info { 
                            display: flex !important;
                            flex-wrap: wrap !important;
                            gap: 0.8rem !important;
                        }
                        .contact-item {
                            display: flex !important;
                            align-items: center !important;
                            gap: 0.4rem !important;
                            font-size: 0.85rem !important;
                            color: white !important;
                            margin-bottom: 0 !important;
                            font-weight: 400 !important;
                        }
                        .contact-item i {
                            width: 14px !important;
                            text-align: center !important;
                            opacity: 0.8 !important;
                            font-size: 0.8rem !important;
                        }
                        
                        /* Titoli sezioni ben leggibili */
                        h1, h2, h3, h4, h5, h6 { 
                            margin-top: 0 !important;
                            margin-bottom: 0.5rem !important;
                            padding: 0 !important;
                            font-weight: 600 !important;
                            letter-spacing: -0.01em !important;
                        }
                        h2 { 
                            color: #4f46e5 !important;
                            font-size: 1.3rem !important;
                            font-weight: 600 !important;
                            margin-bottom: 0.4rem !important;
                            border-bottom: 2px solid #4f46e5 !important;
                            padding-bottom: 0.2rem !important;
                            display: inline-block !important;
                        }
                        
                        /* Contenuto testo ben leggibile */
                        .section-content {
                            font-size: 0.9rem !important;
                            line-height: 1.4 !important;
                            margin: 0 !important;
                        }
                        
                        /* Paragrafi e testi con spaziatura adeguata */
                        p, li, span, div {
                            margin-bottom: 0.4rem !important;
                            margin-top: 0 !important;
                            padding: 0 !important;
                            font-size: 0.9rem !important;
                            line-height: 1.4 !important;
                            font-weight: 400 !important;
                        }
                        
                        /* Skills ben organizzate */
                        .skills-grid {
                            display: grid !important;
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
                            gap: 0.8rem !important;
                            margin-bottom: 0 !important;
                        }
                        .skill-category {
                            margin-bottom: 0.8rem !important;
                        }
                        .skill-category h3 {
                            font-size: 1rem !important;
                            margin-bottom: 0.4rem !important;
                            font-weight: 600 !important;
                        }
                        .skills-list {
                            margin: 0 !important;
                            gap: 0.3rem !important;
                        }
                        .skill-tag {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            color: white !important;
                            padding: 0.2rem 0.5rem !important;
                            border-radius: 6px !important;
                            font-size: 0.75rem !important;
                            font-weight: 500 !important;
                            margin: 0.1rem !important;
                            display: inline-block !important;
                        }
                        
                        /* Progetti ben strutturati */
                        .projects-grid {
                            display: grid !important;
                            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
                            gap: 0.8rem !important;
                        }
                        .project-card {
                            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
                            border-radius: 6px !important;
                            padding: 1rem !important;
                            border: 1px solid #e2e8f0 !important;
                            margin: 0 !important;
                        }
                        .project-card h3 {
                            font-size: 1rem !important;
                            margin-bottom: 0.4rem !important;
                            font-weight: 600 !important;
                        }
                        .project-card p {
                            font-size: 0.85rem !important;
                            margin-bottom: 0.5rem !important;
                            line-height: 1.4 !important;
                        }
                        .project-tech {
                            margin-bottom: 0.4rem !important;
                            gap: 0.2rem !important;
                        }
                        .tech-tag {
                            background: #e0e7ff !important;
                            color: #3730a3 !important;
                            padding: 0.1rem 0.3rem !important;
                            border-radius: 4px !important;
                            font-size: 0.7rem !important;
                            font-weight: 500 !important;
                            margin: 0.05rem !important;
                            display: inline-block !important;
                        }
                        
                        /* Timeline disabilitata - usa stile education */
                        .timeline {
                            position: static !important;
                            padding-left: 0 !important;
                            margin: 0 !important;
                        }
                        .timeline::before {
                            display: none !important;
                        }
                        .timeline-item {
                            margin-bottom: 0.4rem !important;
                            padding-left: 1rem !important;
                            border-left: 3px solid #4f46e5 !important;
                            position: relative !important;
                        }
                        .timeline-marker {
                            display: none !important;
                        }
                        .timeline-content h3 {
                            font-size: 1rem !important;
                            margin-bottom: 0.1rem !important;
                            font-weight: 600 !important;
                        }
                        .timeline-content .company {
                            font-size: 0.85rem !important;
                            margin-bottom: 0.1rem !important;
                            font-weight: 500 !important;
                            color: #4f46e5 !important;
                        }
                        .timeline-content .period {
                            font-size: 0.75rem !important;
                            margin-bottom: 0.2rem !important;
                            color: #6b7280 !important;
                        }
                        .timeline-content ul {
                            margin: 0 !important;
                            padding-left: 0 !important;
                            list-style: none !important;
                        }
                        .timeline-content ul li {
                            font-size: 0.8rem !important;
                            margin-bottom: 0.1rem !important;
                            padding-left: 1rem !important;
                            list-style: none !important;
                            position: relative !important;
                        }
                        .timeline-content ul li::before {
                            content: '•' !important;
                            position: absolute !important;
                            left: 0 !important;
                            color: #4f46e5 !important;
                        }
                        
                        /* Educazione ben organizzata - spaziatura ridotta */
                        .education-item {
                            padding-left: 1rem !important;
                            margin-bottom: 0.2rem !important;
                            border-left-width: 3px !important;
                        }
                        .education-item h3 {
                            font-size: 1rem !important;
                            margin-bottom: 0.1rem !important;
                            font-weight: 600 !important;
                        }
                        .education-item .school {
                            font-size: 0.85rem !important;
                            margin-bottom: 0.1rem !important;
                            font-weight: 500 !important;
                        }
                        .education-item .period {
                            font-size: 0.75rem !important;
                            margin-bottom: 0.1rem !important;
                            color: #6b7280 !important;
                        }
                        .education-skills {
                            margin-top: 0.1rem !important;
                            padding-top: 0.1rem !important;
                            margin-bottom: 0.1rem !important;
                        }
                        .education-skills h4 {
                            font-size: 0.85rem !important;
                            margin-bottom: 0.1rem !important;
                            font-weight: 600 !important;
                        }
                        
                        /* Fix brutale per sezione education - riduci padding finale */
                        .section {
                            padding-bottom: 0.3rem !important;
                        }
                        
                        /* Sezione experience con margin-top negativo */
                        [data-key="experience-title"] {
                            margin-top: -0.5rem !important;
                        }
                        
                        /* Selettore più specifico per sezione volontariato */
                        h2[data-key="experience-title"] {
                            margin-top: -0.3rem !important;
                        }
                        
                        /* Lingue ben organizzate */
                        .languages-grid {
                            display: grid !important;
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
                            gap: 0.8rem !important;
                        }
                        .language-item {
                            padding: 0.8rem !important;
                        }
                        .language-header h3 {
                            font-size: 0.9rem !important;
                            margin-bottom: 0.2rem !important;
                            font-weight: 600 !important;
                        }
                        .language-level {
                            font-size: 0.7rem !important;
                            padding: 0.1rem 0.3rem !important;
                        }
                        .language-bar {
                            height: 3px !important;
                            margin-top: 0.2rem !important;
                        }
                        
                        /* Footer ben spaziato */
                        .footer {
                            padding: 0.8rem 0 !important;
                            font-size: 0.75rem !important;
                            margin-top: 0.5rem !important;
                        }
                        
                        /* REGOLE ANTI-TAGLIO PAGINA - Evita parole e sezioni tranciate */
                        
                        /* Evita interruzioni di pagina per titoli */
                        h1, h2, h3, h4, h5, h6 {
                            page-break-after: avoid !important;
                            break-after: avoid !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            orphans: 3 !important;
                            widows: 3 !important;
                        }
                        
                        /* Evita interruzioni nelle sezioni principali */
                        .section {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            orphans: 3 !important;
                            widows: 3 !important;
                        }
                        
                        /* Evita interruzioni negli elementi specifici */
                        .education-item,
                        .timeline-item,
                        .project-card,
                        .language-item,
                        .skill-category {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            orphans: 2 !important;
                            widows: 2 !important;
                        }
                        
                        /* Evita taglio di liste e tag */
                        .timeline-content ul,
                        .education-skills .skills-list,
                        .skills-list,
                        .project-tech {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        .timeline-content li,
                        .skill-tag,
                        .tech-tag {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        /* Evita righe orfane e vedove per tutto il testo */
                        p, li, div, span {
                            orphans: 3 !important;
                            widows: 3 !important;
                        }
                        
                        /* Mantieni insieme titoli e contenuto correlato */
                        .section-title + .section-content,
                        .timeline-content h3 + .company,
                        .education-item h3 + .school,
                        .project-card h3 + p {
                            page-break-before: avoid !important;
                            break-before: avoid !important;
                        }
                        
                        /* Evita separazione di competenze dalla loro categoria */
                        .education-skills {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        .education-skills h4 + .skills-list {
                            page-break-before: avoid !important;
                            break-before: avoid !important;
                        }
                    `;
                    clonedDoc.head.appendChild(criticalStyles);
                    
                    console.log('Stili applicati al documento clonato');
                    
                    // Rimuovi elementi che non devono apparire nel PDF
                    const elementsToRemove = clonedDoc.querySelectorAll('.language-selector, .back-to-top, .pdf-download-link, .word-download-link');
                    elementsToRemove.forEach(el => el.remove());
                    
                    return clonedDoc;
                }
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true, // Compressione bilanciata
                precision: 2 // Precisione standard per prestazioni migliori
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.page-break-before',
                after: '.page-break-after', 
                avoid: ['.section', '.project-card', '.education-item', '.timeline-item', '.language-item', '.skill-category', '.education-skills', '.timeline-content', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
            },
            enableLinks: true // Mantieni i link cliccabili nel PDF
        };
        
        console.log('Configurazione PDF:', opt);
        console.log('Elemento da renderizzare:', element);
        
        // Attende il caricamento completo dei font prima di procedere
        await ensureFontsLoaded();
        
        // Usa l'API Worker di html2pdf.js per un controllo migliore
        const worker = html2pdf();
        
        worker
            .set(opt)
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                if (!isCompleted) {
                    console.log('PDF generato con successo!');
                    
                    // Ripristina elementi nascosti
                    hiddenElements.forEach(({element, originalDisplay}) => {
                        element.style.display = originalDisplay;
                    });
                    
                    resetButton();
                    
                    const successMessage = currentLanguage === 'it' ? 
                        'PDF scaricato con successo!' : 
                        'PDF downloaded successfully!';
                    
                    showNotification(successMessage, 'success');
                }
            })
            .save()
            .catch((error) => {
                if (!isCompleted) {
                    console.error('Errore html2pdf:', error);
                    
                    // Ripristina elementi nascosti
                    hiddenElements.forEach(({element, originalDisplay}) => {
                        element.style.display = originalDisplay;
                    });
                    
                    resetButton();
                    
                    const errorMessage = currentLanguage === 'it' ? 
                        'Errore nella generazione del PDF. Riprova.' : 
                        'PDF generation error. Please try again.';
                    
                    showNotification(errorMessage, 'error');
                }
            });
        
    } catch (error) {
        console.error('Errore generale:', error);
        
        // Ripristina elementi nascosti se esistono
        if (typeof hiddenElements !== 'undefined') {
            hiddenElements.forEach(({element, originalDisplay}) => {
                element.style.display = originalDisplay;
            });
        }
        
        resetButton();
        
        const errorMessage = currentLanguage === 'it' ? 
            'Errore nella generazione del PDF. Riprova.' : 
            'PDF generation error. Please try again.';
        
        showNotification(errorMessage, 'error');
    }
}

// Funzione per preparare il documento per la generazione PDF
function prepareDocumentForPDF() {
    // Assicura che tutte le animazioni siano completate
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'none';
        section.style.animation = 'none';
    });
    
    // Forza il caricamento di tutte le immagini
    const images = document.querySelectorAll('img');
    return Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = resolve;
            }
        });
    }));
}

// Funzione helper per mostrare notifiche
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4f46e5' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funzione per assicurarsi che i font siano caricati
async function ensureFontsLoaded() {
    // Controlla se document.fonts è disponibile
    if ('fonts' in document) {
        try {
            // Attende che tutti i font siano caricati
            await document.fonts.ready;
            console.log('Font caricati completamente');
            
            // Carica esplicitamente i font più comuni usati
            const fontsToLoad = [
                'Inter',
                'Roboto', 
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI'
            ];
            
            for (const fontFamily of fontsToLoad) {
                try {
                    const fontFace = new FontFace(fontFamily, `local(${fontFamily})`);
                    await fontFace.load();
                    document.fonts.add(fontFace);
                } catch (e) {
                    // Font non disponibile, ignora
                    console.log(`Font ${fontFamily} non disponibile:`, e.message);
                }
            }
            
            // Attendi un momento extra per stabilizzare
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.log('Errore nel caricamento font:', error);
            // Fallback: attendi comunque un momento
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    } else {
        // Fallback per browser che non supportano document.fonts
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Inizializzazione event listener per PDF
function initPDFDownload() {
    const pdfLink = document.getElementById('downloadPDF');
    if (pdfLink) {
        pdfLink.addEventListener('click', function(e) {
            e.preventDefault();
            downloadPDF();
        });
    }
}

// Export per possibili test
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        downloadPDF,
        showNotification,
        initPDFDownload
    };
}
