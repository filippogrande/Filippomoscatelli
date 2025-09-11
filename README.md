# CV di Filippo Moscatelli

Un sito web moderno e responsive per il curriculum vitae con supporto multilingue (Italiano/Inglese), containerizzato con Docker e deployabile su Kubernetes.

## 🌟 Caratteristiche

- **Design Moderno**: Layout pulito e professionale con design responsive
- **Multilingue**: Supporto completo per Italiano e Inglese
- **Responsive**: Ottimizzato per desktop, tablet e mobile
- **Animazioni**: Effetti di transizione fluidi e animazioni CSS
- **Accessibilità**: Supporto per tastiera e lettori di schermo
- **Print-Friendly**: Ottimizzato per la stampa
- **Performance**: Caricamento veloce e ottimizzato
- **Analytics**: Integrazione con Umami Analytics per tracking privacy-friendly
- **Containerizzato**: Docker container pronto per production
- **Cloud-Ready**: Deployment automatizzato su Kubernetes
- **Scalabilità**: Auto-scaling con HPA (Horizontal Pod Autoscaler)

## 📁 Struttura del Progetto

```
├── index.html              # Pagina principale
├── css/                    # File CSS modulari
│   ├── main.css           # Stili principali
│   ├── base.css           # Stili di base
│   ├── components.css     # Componenti riutilizzabili
│   ├── responsive.css     # Media queries responsive
│   └── ...               # Altri file CSS specializzati
├── js/                    # JavaScript modulare
│   ├── main.js           # Script principale
│   ├── language.js       # Gestione multilingue
│   ├── analytics.js      # Integrazione analytics
│   └── ...              # Altri moduli JavaScript
├── k8s/                  # Manifest Kubernetes
│   ├── deployment.yaml   # Deployment configuration
│   ├── service.yaml      # Service configuration
│   ├── ingress.yaml      # Ingress configuration
│   └── ...              # Altri manifest K8s
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Compose per testing locale
├── nginx.conf           # Configurazione Nginx
├── deploy.sh            # Script di deployment
├── Makefile            # Comandi automatizzati
└── README.md           # Documentazione
```

## 🚀 Quick Start

### Deployment da Repository GitHub

Il sistema è configurato per fare build direttamente dal repository GitHub, permettendo deployment senza dover clonare localmente:

```bash
# Build diretto da GitHub (metodo più semplice)
./build-from-github.sh

# Oppure con make
make build-github

# Test del container
docker run -d -p 8080:80 --name cv-test filippomoscatelli/cv-website:latest
curl http://localhost:8080/health
```

### Sviluppo Locale

```bash
# Clone del repository (solo per sviluppo locale)
git clone https://github.com/filippogrande/Filippomoscatelli.git
cd Filippomoscatelli

# Avvia in locale con Docker
make dev
# oppure
docker-compose up -d

# Il sito sarà disponibile su http://localhost:8080
```

### Build e Test

```bash
# Build locale dell'immagine Docker
make build

# Build da GitHub (raccomandato per production)
make build-github

# Test del container
make test

# Visualizza logs
make logs

# Ferma il container
make stop
```

### Deploy su Kubernetes

```bash
# Deploy completo (build + push + deploy)
make prod

# Solo deploy (se l'immagine è già buildutta)
make deploy

# Verifica stato deployment
make status

# Rollback se necessario
make rollback
```

## 🐳 Docker

### Build Manuale

```bash
# Build dell'immagine
docker build -t filippomoscatelli/cv-website:latest .

# Run del container
docker run -d -p 8080:80 --name cv-website filippomoscatelli/cv-website:latest
```

### Configurazione

Il container usa Nginx Alpine per servire i file statici con:

- Compressione Gzip abilitata
- Cache headers ottimizzati
- Security headers configurati
- Health check endpoint su `/health`
- Supporto per routing multilingue

## ☸️ Kubernetes

### Prerequisiti

- Cluster Kubernetes funzionante
- kubectl configurato
- Nginx Ingress Controller (opzionale, per l'ingress)
- Cert-Manager (opzionale, per SSL/TLS)

### Deployment

```bash
# Usando lo script di deployment
./deploy.sh all

# Oppure manualmente
kubectl apply -f k8s/
```

## 🤖 CI/CD con GitHub Actions

Il repository include un workflow automatizzato che:

1. **Build automatico** su ogni push al branch `main`
2. **Test di sicurezza** con Trivy scanner
3. **Deploy automatico** su Kubernetes (se configurato)
4. **Multi-platform builds** (AMD64, ARM64)

### Configurazione GitHub Actions

Per abilitare il deployment automatico, configura questi secrets nel repository GitHub:

```bash
# Docker Hub credentials
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password

# Kubernetes config (base64 encoded)
KUBECONFIG=your-kubernetes-config-base64
```

### Trigger manuale

Puoi anche triggerare manualmente il deployment:

1. Vai su **Actions** nel repository GitHub
2. Seleziona **Build and Deploy CV Website**
3. Clicca **Run workflow**
4. Abilita **Deploy to Kubernetes** se necessario

### Configurazione

I manifest Kubernetes includono:

- **Deployment**: 2 repliche con rolling update
- **Service**: ClusterIP per comunicazione interna
- **Ingress**: Esposizione esterna con SSL/TLS
- **HPA**: Auto-scaling basato su CPU/memoria
- **ConfigMap**: Configurazioni environment-specific

### Monitoring

```bash
# Stato dei pod
kubectl get pods -l app=filippomoscatelli-cv

# Logs dei pod
kubectl logs -l app=filippomoscatelli-cv -f

# Metriche HPA
kubectl get hpa filippomoscatelli-cv-hpa

# Eventi del deployment
kubectl describe deployment filippomoscatelli-cv
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

- **Desktop**: Layout standard, è il sistema su cui è specificatamente pensato
- **Tablet**: Layout adattivo con elementi ridimensionati
- **Mobile**: Layout a colonna singola con navigazione mobile-friendly

## 🎯 SEO e Performance

- Meta tag ottimizzati
- Immagini ottimizzate
- CSS e JavaScript minificati
- Struttura semantica HTML5
- Schema markup (può essere aggiunto)

## 🛠️ Estensioni Future

### 🎨 Miglioramenti UI/UX

- [x] **Sistema di Analytics** (Umami Analytics integrato)
- [ ] **Modalità scura/chiara**: Toggle per switchare tra tema chiaro e scuro

### 📄 Funzionalità CV

- [x] **Versione PDF scaricabile**: Pulsante per generare e scaricare automaticamente il CV in formato PDF (è stato implementato con un file statico pdf ottenuto da un sito)
- [x] **Schema markup**: Codice strutturato (JSON-LD) per aiutare i motori di ricerca a riconoscere il CV
- [ ] **Miglioramento delle competenze**: le competenze on mouse over fanno vedere dove sono state acquisite
- [ ] **Galleria progetti estesa**: Pagina dedicata con screenshot, descrizioni dettagliate e demo live

### 📊 Monitoring e Analytics _(richiede backend)_

- [x] **Statistiche di visita**: Analytics per monitorare visualizzazioni e interazioni (Umami integrato)
- [ ] **Performance monitoring**: Monitoraggio velocità di caricamento e ottimizzazioni

### 📝 Contenuti Futuri

- [ ] **Certificazioni**: Sezione dedicata quando otterrai certificazioni tecniche
- [ ] **Pubblicazioni**: Se inizierai a scrivere articoli o paper

## 📞 Supporto

Per domande o suggerimenti, contatta:

- **Email**: filippo.moscatelli@proton.me
- **LinkedIn**: [linkedin.com](https://www.linkedin.com/in/filippo-moscatelli-52b566202/)
- **GitHub**: [github.com](https://github.com/filippogrande)

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Sei libero di utilizzarlo e modificarlo per i tuoi scopi personali e commerciali.
