# Use nginx alpine slim as base image for serving static content
FROM nginx:1.29.1-alpine-slim

# Install git and curl for cloning repository
RUN apk add --no-cache git curl

# Set working directory
WORKDIR /tmp

# Clone the repository from GitHub
RUN git clone https://github.com/filippogrande/Filippomoscatelli.git

# Set working directory to nginx html
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy website files from cloned repository
RUN cp -r /tmp/Filippomoscatelli/index.html . && \
    cp -r /tmp/Filippomoscatelli/css/ ./css/ && \
    cp -r /tmp/Filippomoscatelli/js/ ./js/ && \
    cp -r /tmp/Filippomoscatelli/data/ ./data/ && \
    cp -r /tmp/Filippomoscatelli/FoodDelivery/ ./FoodDelivery/ && \
    cp -r /tmp/Filippomoscatelli/k8s/ ./k8s/ 2>/dev/null || true && \
    cp -r /tmp/Filippomoscatelli/*.pdf . 2>/dev/null || true && \
    cp -r /tmp/Filippomoscatelli/*.png . 2>/dev/null || true && \
    cp -r /tmp/Filippomoscatelli/*.svg . 2>/dev/null || true && \
    cp -r /tmp/Filippomoscatelli/*.md . 2>/dev/null || true

# Copy custom nginx configuration from repository (if exists), otherwise use local copy
COPY nginx.conf /tmp/local-nginx.conf
RUN if [ -f /tmp/Filippomoscatelli/nginx.conf ]; then \
    cp /tmp/Filippomoscatelli/nginx.conf /etc/nginx/nginx.conf; \
    else \
    cp /tmp/local-nginx.conf /etc/nginx/nginx.conf; \
    fi

# Clean up temporary files
RUN rm -rf /tmp/Filippomoscatelli

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
