# Makefile per Filippomoscatelli CV Website

.PHONY: help build run stop clean deploy status rollback test pdf

# Variabili
IMAGE_NAME = filippogrande/cv-website
IMAGE_TAG = latest
CONTAINER_NAME = filippomoscatelli-cv-local

help: ## Mostra questo messaggio di aiuto
	@echo "Filippomoscatelli CV Website - Comandi disponibili:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build dell'immagine Docker dal repository locale
	@echo "🏗️  Building Docker image from local files..."
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "✅ Build completata!"

build-github: ## Build dell'immagine Docker da GitHub (multi-platform)
	@echo "🏗️  Building Docker image from GitHub (AMD64 + ARM64 + x86)..."
	./build-from-github.sh $(IMAGE_TAG)
	@echo "✅ Build da GitHub completata!"

push: ## Push dell'immagine su Docker Hub (multi-platform)
	@echo "📤 Pushing multi-platform image to Docker Hub..."
	docker buildx build --platform linux/amd64,linux/arm64,linux/386 -t $(IMAGE_NAME):$(IMAGE_TAG) --push .
	@echo "✅ Push completato!"

run: ## Avvia il container in locale
	@echo "🚀 Starting container..."
	docker-compose up -d
	@echo "✅ Container avviato su http://localhost:8080"

stop: ## Ferma il container
	@echo "🛑 Stopping container..."
	docker-compose down
	@echo "✅ Container fermato!"

logs: ## Mostra i log del container
	docker-compose logs -f cv-website

clean: ## Pulisce immagini e container non utilizzati
	@echo "🧹 Cleaning up..."
	docker-compose down --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup completato!"

test: ## Testa il container in locale
	@echo "🧪 Testing container..."
	@if curl -f http://localhost:8080/health > /dev/null 2>&1; then \
		echo "✅ Health check passed!"; \
	else \
		echo "❌ Health check failed!"; \
	fi

test-full: ## Test completo del deployment
	@echo "🧪 Running full deployment test..."
	./test-deployment.sh

pdf: ## Genera i PDF del CV da print-cv.html (richiede Chrome/Chromium)
	@echo "📄 Generating CV PDFs from print-cv.html..."
	cd scripts && npm install --no-audit --no-fund && npm run build
	@echo "✅ PDF generati: filippomoscatelli_it.pdf, filippomoscatelli_en.pdf"

deploy-build: ## Build e deploy su Kubernetes (da GitHub)
	@echo "🚀 Building from GitHub and deploying..."
	./deploy.sh all

deploy-build-local: ## Build e deploy su Kubernetes (da file locali)
	@echo "🚀 Building from local files and deploying..."
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) . && ./deploy.sh deploy

deploy: ## Deploy su Kubernetes
	@echo "📦 Deploying to Kubernetes..."
	./deploy.sh deploy

status: ## Mostra lo stato del deployment
	@echo "📊 Checking deployment status..."
	./deploy.sh status

rollback: ## Rollback del deployment
	@echo "⏪ Rolling back deployment..."
	./deploy.sh rollback

k8s-cleanup: ## Rimuove tutto da Kubernetes
	@echo "🧹 Cleaning up Kubernetes resources..."
	./deploy.sh cleanup

dev: build run ## Build e avvia per sviluppo locale

prod: deploy-build ## Deploy completo in produzione

# Target di default
.DEFAULT_GOAL := help
