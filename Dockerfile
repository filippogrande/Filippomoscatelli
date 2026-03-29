# Use nginx alpine slim as base image for serving static content
FROM nginx:1.29.1-alpine-slim

# Install git and curl for cloning repository
RUN apk add --no-cache git curl

# Use build context instead of cloning inside the image to ensure CI builds
# reflect the checked-out commit. Copy project files into a temporary build
# folder and then copy the needed assets into nginx html folder.
WORKDIR /usr/share/nginx/html

# Clean default content
RUN rm -rf /usr/share/nginx/html/*

# Copy repository files from build context and move required assets
COPY . /tmp/build
RUN cp -r /tmp/build/index.html . && \
    cp -r /tmp/build/css ./css && \
    cp -r /tmp/build/js ./js && \
    cp -r /tmp/build/data ./data && \
    cp -r /tmp/build/FoodDelivery ./FoodDelivery && \
    cp -r /tmp/build/k8s ./k8s 2>/dev/null || true && \
    cp -r /tmp/build/test-projects.html . 2>/dev/null || true && \
    cp -r /tmp/build/nginx.conf ./nginx.conf 2>/dev/null || true && \
    cp -r /tmp/build/*.pdf . 2>/dev/null || true && \
    cp -r /tmp/build/*.png . 2>/dev/null || true && \
    cp -r /tmp/build/*.svg . 2>/dev/null || true && \
    rm -rf /tmp/build

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
