// Main Script - Coordinatore principale
// Gestisce l'inizializzazione e il coordinamento di tutti i moduli

// Gestione degli errori globali
window.addEventListener('error', (e) => {
    console.error('Si è verificato un errore:', e.error);
});

// Inizializzazione principale quando il DOM è carico
document.addEventListener('DOMContentLoaded', () => {
    // Inizializza traduzioni
    if (typeof initTranslations === 'function') {
        initTranslations();
    }
    
    // Inizializza miglioramenti UI
    if (typeof initUIEnhancements === 'function') {
        initUIEnhancements();
    }
    
    // Inizializza download PDF
    if (typeof initPDFDownload === 'function') {
        initPDFDownload();
    }
});

// Export per possibili test (se necessario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Eventuali funzioni da esportare
    };
}
