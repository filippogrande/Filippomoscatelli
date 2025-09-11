#!/bin/bash

# Script di build per Filippomoscatelli CV Website da GitHub
# Uso: ./build-from-github.sh [tag]

set -e

# Configurazioni
GITHUB_REPO="https://github.com/filippogrande/Filippomoscatelli.git"
IMAGE_NAME="filippomoscatelli/cv-website"
IMAGE_TAG="${1:-latest}"
REPO_NAME="Filippomoscatelli"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica prerequisiti
log_info "Verificando prerequisiti..."
if ! command -v docker &> /dev/null; then
    log_error "Docker non è installato"
    exit 1
fi

if ! command -v git &> /dev/null; then
    log_error "Git non è installato"
    exit 1
fi

# Build diretto da GitHub usando Docker
log_info "Building Docker image from GitHub repository..."
log_info "Repository: $GITHUB_REPO"
log_info "Image: $IMAGE_NAME:$IMAGE_TAG"

# Build dell'immagine direttamente da GitHub
docker build -t $IMAGE_NAME:$IMAGE_TAG $GITHUB_REPO

# Tag con timestamp per backup
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:$TIMESTAMP

log_success "✅ Build completato!"
log_success "Immagine creata: $IMAGE_NAME:$IMAGE_TAG"
log_info "Tag di backup: $IMAGE_NAME:$TIMESTAMP"

echo ""
echo "Per avviare il container:"
echo "docker run -d -p 8080:80 --name cv-website $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "Per testare:"
echo "curl http://localhost:8080/health"
