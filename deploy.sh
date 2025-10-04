#!/bin/bash

# Script di deployment per Filippomoscatelli CV Website
# Uso: ./deploy.sh [build|deploy|all]

set -e

# Configurazioni
IMAGE_NAME="filippogrande/cv-website"
IMAGE_TAG="latest"
NAMESPACE="default"
CONTEXT="default"  # Modifica con il tuo context Kubernetes
GITHUB_REPO="https://github.com/filippogrande/Filippomoscatelli.git"
REPO_NAME="Filippomoscatelli"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzioni di utility
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verificando prerequisiti..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker non è installato"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl non è installato"
        exit 1
    fi
    
    # Verifica connessione al cluster Kubernetes
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Impossibile connettersi al cluster Kubernetes"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Build dell'immagine Docker
build_image() {
    log_info "Building Docker image from GitHub repository..."
    
    # Crea directory temporanea per il clone
    TEMP_DIR=$(mktemp -d)
    log_info "Cloning repository to temporary directory: $TEMP_DIR"
    
    # Clone del repository
    git clone $GITHUB_REPO $TEMP_DIR/$REPO_NAME
    
    # Naviga nella directory clonata
    cd $TEMP_DIR/$REPO_NAME
    
    # Build dell'immagine dalla directory clonata
    docker build -t $IMAGE_NAME:$IMAGE_TAG .
    
    # Tag con timestamp per rollback
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:$TIMESTAMP
    
    # Cleanup della directory temporanea
    cd - > /dev/null
    rm -rf $TEMP_DIR
    
    log_success "Immagine Docker creata: $IMAGE_NAME:$IMAGE_TAG"
    log_info "Tag di backup creato: $IMAGE_NAME:$TIMESTAMP"
}

# Push dell'immagine (opzionale, se usi un registry)
push_image() {
    log_info "Pushing image to registry..."
    
    # Uncomment se usi Docker Hub o un registry privato
    # docker push $IMAGE_NAME:$IMAGE_TAG
    # docker push $IMAGE_NAME:$TIMESTAMP
    
    log_warning "Push dell'immagine saltato (configurare se necessario)"
}

# Deploy su Kubernetes
deploy_k8s() {
    log_info "Deploying to Kubernetes..."
    
    # Applica i manifest
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/hpa.yaml
    
    # Applica ingress solo se specificato
    if [ -f k8s/ingress.yaml ]; then
        log_info "Applying ingress configuration..."
        kubectl apply -f k8s/ingress.yaml
    fi
    
    # Attendi il rollout
    log_info "Waiting for deployment to complete..."
    kubectl rollout status deployment/filippomoscatelli-cv --timeout=300s
    
    log_success "Deployment completato"
}

# Verifica stato del deployment
check_status() {
    log_info "Checking deployment status..."
    
    echo "Pods:"
    kubectl get pods -l app=filippomoscatelli-cv
    
    echo -e "\nServices:"
    kubectl get services filippomoscatelli-cv-service
    
    echo -e "\nIngress:"
    kubectl get ingress filippomoscatelli-cv-ingress 2>/dev/null || log_warning "Ingress not configured"
    
    echo -e "\nHPA:"
    kubectl get hpa filippomoscatelli-cv-hpa
}

# Rollback
rollback() {
    log_info "Rolling back deployment..."
    kubectl rollout undo deployment/filippomoscatelli-cv
    kubectl rollout status deployment/filippomoscatelli-cv --timeout=300s
    log_success "Rollback completato"
}

# Cleanup
cleanup() {
    log_info "Cleaning up..."
    kubectl delete -f k8s/ --ignore-not-found=true
    log_success "Cleanup completato"
}

# Menu principale
case $1 in
    "build")
        check_prerequisites
        build_image
        ;;
    "deploy")
        check_prerequisites
        deploy_k8s
        check_status
        ;;
    "all")
        check_prerequisites
        build_image
        push_image
        deploy_k8s
        check_status
        ;;
    "status")
        check_status
        ;;
    "rollback")
        rollback
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Uso: $0 [build|deploy|all|status|rollback|cleanup]"
        echo ""
        echo "Comandi:"
        echo "  build     - Build dell'immagine Docker"
        echo "  deploy    - Deploy su Kubernetes"
        echo "  all       - Build + Push + Deploy"
        echo "  status    - Mostra stato del deployment"
        echo "  rollback  - Rollback all'ultima versione"
        echo "  cleanup   - Rimuove tutto da Kubernetes"
        exit 1
        ;;
esac
