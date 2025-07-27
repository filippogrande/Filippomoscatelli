# CV di Filippo Moscatelli

Un sito web moderno e responsive per il curriculum vitae con supporto multilingue (Italiano/Inglese).

## 🌟 Caratteristiche

- **Design Moderno**: Layout pulito e professionale con design responsive
- **Multilingue**: Supporto completo per Italiano e Inglese
- **Responsive**: Ottimizzato per desktop, tablet e mobile
- **Animazioni**: Effetti di transizione fluidi e animazioni CSS
- **Accessibilità**: Supporto per tastiera e lettori di schermo
- **Print-Friendly**: Ottimizzato per la stampa
- **Performance**: Caricamento veloce e ottimizzato
- **Analytics**: Integrazione con Umami Analytics per tracking privacy-friendly

## 🚀 Come Utilizzare

1. **Clona o scarica** i file del progetto
2. **Personalizza** i contenuti nel file `index.html` con le tue informazioni
3. **Modifica** le traduzioni nel file `script.js` se necessario
4. **Apri** `index.html` in un browser web

## 📁 Struttura del Progetto

```
├── index.html          # Pagina principale
├── styles.css          # Stili CSS
├── script.js           # Logica JavaScript e traduzioni
└── README.md           # Documentazione
```

## 🎨 Personalizzazione

### Modificare le Informazioni Personali

Modifica i seguenti elementi nel file `index.html`:

- **Nome**: Cambia il contenuto del tag `<h1 class="name">`
- **Foto**: Sostituisci l'URL nel tag `<img>` della sezione profilo
- **Contatti**: Aggiorna email, telefono, indirizzo, LinkedIn e GitHub
- **Descrizione**: Modifica il contenuto della sezione "About"
- **Progetti**: Aggiungi o modifica i progetti nella sezione dedicata

### Aggiungere Nuovi Progetti

Per aggiungere un nuovo progetto:

1. **HTML**: Aggiungi una nuova `<div class="project-card">` nella sezione progetti
2. **Traduzioni**: Aggiungi le chiavi di traduzione in `script.js` per entrambe le lingue (it/en)
3. **Stili**: I progetti utilizzano già la griglia responsive, quindi si adatteranno automaticamente

- **Competenze**: Aggiungi o rimuovi skill nelle varie categorie
- **Esperienza**: Aggiorna lavori e descrizioni
- **Istruzione**: Modifica formazione e qualifiche
- **Progetti**: Aggiungi i tuoi progetti personali

### Modificare le Traduzioni

Nel file `script.js`, modifica l'oggetto `translations` per:

- Aggiornare le traduzioni esistenti
- Aggiungere nuove stringhe traducibili
- Supportare lingue aggiuntive

### Personalizzare i Colori

Nel file `styles.css`, modifica le variabili dei colori:

- **Colore principale**: Cerca `#4f46e5` e sostituiscilo
- **Gradiente header**: Modifica `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Colori di sfondo**: Personalizza i colori delle sezioni

## 🔧 Funzionalità Avanzate

### Scorciatoie da Tastiera

- **Alt + I**: Cambia lingua in Italiano
- **Alt + E**: Cambia lingua in Inglese

### Memorizzazione Preferenze

Il sito ricorda automaticamente la lingua scelta dall'utente utilizzando il localStorage del browser.

### Rilevamento Lingua Automatico

Il sito rileva automaticamente la lingua preferita del browser dell'utente al primo accesso.

### Analytics Privacy-Friendly

Il sito integra Umami Analytics per tracciare:

- Visite e pagine viste
- Interazioni con link (social media, progetti, contatti)
- Cambio di lingua e preferenze utente
- Comportamento di navigazione (scroll depth, tempo sulla pagina)

**Privacy**: Gli analytics sono self-hosted e non condividono dati con terze parti.

## 🌐 Browser Supportati

- Chrome (versione 80+)
- Firefox (versione 75+)
- Safari (versione 13+)
- Edge (versione 80+)

## 📱 Responsive Design

Il sito è ottimizzato per:

- **Desktop**: Layout a due colonne con sidebar
- **Tablet**: Layout adattivo con elementi ridimensionati
- **Mobile**: Layout a colonna singola con navigazione mobile-friendly

## 🎯 SEO e Performance

- Meta tag ottimizzati
- Immagini ottimizzate
- CSS e JavaScript minificati (in produzione)
- Struttura semantica HTML5
- Schema markup (può essere aggiunto)

## 🛠️ Estensioni Future

### 🎨 Miglioramenti UI/UX

- [x] **Sistema di Analytics** (Umami Analytics integrato)
- [ ] **Modalità scura/chiara**: Toggle per switchare tra tema chiaro e scuro

### 📄 Funzionalità CV

- [ ] **Versione PDF scaricabile**: Pulsante per generare e scaricare automaticamente il CV in formato PDF (implementato con html2pdf.js)
- [x] **Schema markup**: Codice strutturato (JSON-LD) per aiutare i motori di ricerca a riconoscere il CV
- [ ] **Galleria progetti estesa**: Pagina dedicata con screenshot, descrizioni dettagliate e demo live

### 📊 Monitoring e Analytics _(richiede backend)_

- [x] **Statistiche di visita**: Analytics per monitorare visualizzazioni e interazioni (Umami integrato)
- [ ] **Performance monitoring**: Monitoraggio velocità di caricamento e ottimizzazioni

### 📝 Contenuti Futuri

- [ ] **Certificazioni**: Sezione dedicata quando otterrai certificazioni tecniche
- [ ] **Pubblicazioni**: Se inizierai a scrivere articoli o paper

## 📞 Supporto

Per domande o suggerimenti, contatta:

- **Email**: filipp28mo@gmail.com
- **LinkedIn**: [linkedin.com](https://www.linkedin.com/in/filippo-moscatelli-52b566202/)
- **GitHub**: [github.com](https://github.com/filippogrande)

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Sei libero di utilizzarlo e modificarlo per i tuoi scopi personali e commerciali.

---

_Creato con ❤️ da Filippo Moscatelli_
