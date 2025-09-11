#!/bin/bash

# Script di test completo per Filippomoscatelli CV Website
# Uso: ./test-deployment.sh

set -e

# Configurazioni
IMAGE_NAME="filippomoscatelli/cv-website"
CONTAINER_NAME="cv-test-$(date +%s)"
TEST_PORT="8081"

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

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up test container..."
    docker rm -f $CONTAINER_NAME 2>/dev/null || true
}

# Trap per cleanup automatico
trap cleanup EXIT

# Test del container
test_container() {
    log_info "🧪 Starting container tests..."
    
    # Avvia il container
    log_info "Starting test container on port $TEST_PORT..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p $TEST_PORT:80 \
        $IMAGE_NAME:latest
    
    # Attendi che il container si avvii
    log_info "Waiting for container to be ready..."
    sleep 10
    
    # Test health check
    log_info "Testing health check endpoint..."
    if curl -f "http://localhost:$TEST_PORT/health" > /dev/null 2>&1; then
        log_success "✅ Health check passed!"
    else
        log_error "❌ Health check failed!"
        return 1
    fi
    
    # Test pagina principale
    log_info "Testing main page..."
    if curl -f "http://localhost:$TEST_PORT/" > /dev/null 2>&1; then
        log_success "✅ Main page accessible!"
    else
        log_error "❌ Main page not accessible!"
        return 1
    fi
    
    # Test file CSS
    log_info "Testing CSS files..."
    if curl -f "http://localhost:$TEST_PORT/css/main.css" > /dev/null 2>&1; then
        log_success "✅ CSS files accessible!"
    else
        log_warning "⚠️  CSS files might not be accessible"
    fi
    
    # Test file JS
    log_info "Testing JavaScript files..."
    if curl -f "http://localhost:$TEST_PORT/js/main.js" > /dev/null 2>&1; then
        log_success "✅ JavaScript files accessible!"
    else
        log_warning "⚠️  JavaScript files might not be accessible"
    fi
    
    # Test Content-Type headers
    log_info "Testing Content-Type headers..."
    CONTENT_TYPE=$(curl -s -I "http://localhost:$TEST_PORT/" | grep -i content-type | awk '{print $2}' | tr -d '\r')
    if [[ $CONTENT_TYPE == *"text/html"* ]]; then
        log_success "✅ Correct Content-Type for HTML!"
    else
        log_warning "⚠️  Unexpected Content-Type: $CONTENT_TYPE"
    fi
    
    # Test compressione Gzip
    log_info "Testing Gzip compression..."
    ENCODING=$(curl -s -H "Accept-Encoding: gzip" -I "http://localhost:$TEST_PORT/" | grep -i content-encoding | awk '{print $2}' | tr -d '\r')
    if [[ $ENCODING == *"gzip"* ]]; then
        log_success "✅ Gzip compression enabled!"
    else
        log_warning "⚠️  Gzip compression might not be enabled"
    fi
    
    # Test security headers
    log_info "Testing security headers..."
    HEADERS=$(curl -s -I "http://localhost:$TEST_PORT/")
    
    if echo "$HEADERS" | grep -qi "x-frame-options"; then
        log_success "✅ X-Frame-Options header present!"
    else
        log_warning "⚠️  X-Frame-Options header missing"
    fi
    
    if echo "$HEADERS" | grep -qi "x-content-type-options"; then
        log_success "✅ X-Content-Type-Options header present!"
    else
        log_warning "⚠️  X-Content-Type-Options header missing"
    fi
    
    log_success "🎉 All container tests completed!"
}

# Main execution
main() {
    echo "🚀 Filippomoscatelli CV Website - Test Suite"
    echo "============================================="
    echo ""
    
    # Verifica che Docker sia in esecuzione
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running!"
        exit 1
    fi
    
    # Verifica che l'immagine esista
    if ! docker image inspect $IMAGE_NAME:latest > /dev/null 2>&1; then
        log_error "Image $IMAGE_NAME:latest not found!"
        log_info "Build the image first with: make build-github"
        exit 1
    fi
    
    # Verifica che la porta sia libera
    if netstat -tuln | grep -q ":$TEST_PORT "; then
        log_error "Port $TEST_PORT is already in use!"
        exit 1
    fi
    
    # Esegui i test
    test_container
    
    echo ""
    log_success "🎉 All tests passed! The website is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "- Deploy to Kubernetes: make deploy"
    echo "- Push to registry: docker push $IMAGE_NAME:latest"
    echo "- Access website: http://localhost:$TEST_PORT"
}

# Esegui main se lo script è chiamato direttamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
