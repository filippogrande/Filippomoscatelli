// SCRIPT SEMPLIFICATO PER DEBUG
console.log('🚀 SCRIPT SIMPLE STARTED');

// Test immediato
console.log('Current time:', new Date().toISOString());
console.log('Location:', window.location.href);
console.log('Umami available:', typeof umami !== 'undefined');

// Funzione di test semplice
function simpleTest() {
    console.log('=== Simple Test ===');
    console.log('Document ready state:', document.readyState);
    console.log('Scripts in page:', document.scripts.length);
    
    // Test script Umami
    const umamiScript = document.querySelector('script[data-website-id]');
    if (umamiScript) {
        console.log('✅ Umami script found:', umamiScript.src);
    } else {
        console.log('❌ Umami script not found');
    }
    
    // Test umami object
    if (typeof umami !== 'undefined') {
        console.log('✅ Umami is available!');
        try {
            umami.track('simple-test', { timestamp: Date.now() });
            console.log('✅ Test event sent');
        } catch (error) {
            console.error('❌ Test event failed:', error);
        }
    } else {
        console.log('❌ Umami not available');
    }
}

// Traduzioni semplificate
const translations = {
    it: {
        'job-title': 'Studente in Informatica per la Comunicazione Digitale'
    },
    en: {
        'job-title': 'Computer Science Student for Digital Communication'
    }
};

console.log('✅ Translations defined');

// Event listener semplificato
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM LOADED');
    
    setTimeout(() => {
        simpleTest();
    }, 2000);
    
    // Test ogni 5 secondi
    setInterval(() => {
        console.log('⏰ Periodic check - Umami:', typeof umami !== 'undefined');
    }, 5000);
});

console.log('✅ Event listeners set up');

// Rendi disponibile per test
window.simpleTest = simpleTest;

console.log('🎯 SCRIPT SIMPLE COMPLETED');
