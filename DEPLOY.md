# 🚀 Deployment Guide - Filippomoscatelli CV Website

## ✅ Test Locale Rapido

L'immagine è pubblicata su **Docker Hub** e può essere usata direttamente:

```bash
# Test immediato (senza clonare repository)
docker run -d -p 8080:80 filippogrande/cv-website:latest

# Verifica che funzioni
curl http://localhost:8080/health
# Output: healthy

# Visita il sito
open http://localhost:8080
```

## 🛠️ Comandi Principali

### Test e Sviluppo

```bash
# Test completo automatico
make test-full

# Build da GitHub (raccomandato)
make build-github

# Build locale (per sviluppo)
make build

# Avvia per sviluppo
make dev
```

### Deployment

```bash
# Deploy completo in produzione
make prod

# Solo deployment (se immagine già ready)
make deploy

# Verifica stato
make status

# Rollback se necessario
make rollback
```

## 🐳 Docker Hub

L'immagine è disponibile pubblicamente su:
**[filippogrande/cv-website](https://hub.docker.com/r/filippogrande/cv-website)**

### Pull diretto:
```bash
docker pull filippogrande/cv-website:latest
```

### Caratteristiche immagine:
- ✅ Base: nginx:alpine (leggera e sicura)
- ✅ **Multi-platform**: linux/amd64 + linux/arm64 + linux/386
- ✅ **Compatibilità universale**: Intel, AMD, Apple Silicon, ARM servers, x86 legacy
- ✅ Build automatico da GitHub
- ✅ Health check configurato (`/health`)
- ✅ Security headers configurati
- ✅ Gzip compression abilitata
- ✅ Cache headers ottimizzati
- ✅ Multi-language support (IT/EN)

## ☸️ Kubernetes Quick Deploy

```bash
# Se hai kubectl configurato
kubectl apply -f k8s/

# Verifica deployment
kubectl get pods -l app=filippomoscatelli-cv
```

## 🤖 CI/CD Automatico

Il repository include GitHub Actions per:
- ✅ Build automatico su push
- ✅ Test di sicurezza
- ✅ Deploy automatico su K8s (se configurato)

## 📧 Support

Repository: https://github.com/filippogrande/Filippomoscatelli
Docker Hub: https://hub.docker.com/r/filippogrande/cv-website
