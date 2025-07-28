/**
 * Legacy Compatibility Module
 * Contiene funzioni di compatibilità per il vecchio script.js
 * Può essere rimosso una volta completata la migrazione
 */

// Funzioni di test legacy per compatibilità
window.testUmamiTracking = function() {
    //console.log('🔄 Legacy function: testUmamiTracking() -> redirecting to analyticsManager.testTracking()');
    if (window.analyticsManager) {
        window.analyticsManager.testTracking();
    } else {
        console.error('❌ Analytics manager not available');
    }
};

window.testAllUmamiMethods = function() {
    //console.log('🔄 Legacy function: testAllUmamiMethods() -> using new analytics system');
    if (window.analyticsManager) {
        window.analyticsManager.testTracking();
        //console.log('📊 Analytics tracking stats:', window.analyticsManager.getTrackingStats());
    } else {
        console.error('❌ Analytics manager not available');
    }
};

window.changeLanguage = function(lang) {
    //console.log('🔄 Legacy function: changeLanguage() -> redirecting to languageManager.changeLanguage()');
    if (window.languageManager) {
        window.languageManager.changeLanguage(lang);
    } else {
        console.error('❌ Language manager not available');
    }
};

window.detectPreferredLanguage = function() {
    //console.log('🔄 Legacy function: detectPreferredLanguage() -> redirecting to languageManager.detectPreferredLanguage()');
    if (window.languageManager) {
        return window.languageManager.detectPreferredLanguage();
    } else {
        console.error('❌ Language manager not available');
        return 'it';
    }
};

// Espone le variabili globali per compatibilità
Object.defineProperty(window, 'currentLanguage', {
    get: function() {
        return window.languageManager ? window.languageManager.getCurrentLanguage() : 'it';
    },
    set: function(value) {
        if (window.languageManager) {
            window.languageManager.changeLanguage(value);
        }
    }
});

Object.defineProperty(window, 'translations', {
    get: function() {
        return window.languageManager ? window.languageManager.translations : {};
    }
});

//console.log('🔄 Legacy compatibility layer loaded');
