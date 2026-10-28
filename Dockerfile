# Base image fissata a una patch recente: 1.31.0-alpine-slim e' stato costruito a
# maggio 2026 e da allora si portava dietro openssl e pcre2 non patchati (alert
# Trivy #46 #51 #78 #83 openssl, #115 #116 #117 #118 pcre2). 1.31.8-alpine-slim
# e' del 24 ottobre 2026. Resta la stessa serie 1.31, quindi nessun salto di
# comportamento: cambiano solo i pacchetti alpine sotto.
FROM nginx:1.31.8-alpine-slim

# Nessun pacchetto extra: git non serve piu' (il build usa il context, non un clone)
# e curl serviva solo all'HEALTHCHECK, che ora usa il wget di busybox gia' presente
# nell'immagine base. Ogni pacchetto in meno e' una superficie CVE in meno: git e curl
# trascinavano expat, brotli e parte di pcre2 (alert Trivy #149 #125 #124 #173).

# Use build context instead of cloning inside the image to ensure CI builds
# reflect the checked-out commit. Copy project files into a temporary build
# folder and then copy the needed assets into nginx html folder.
WORKDIR /usr/share/nginx/html

# Clean default content
RUN rm -rf /usr/share/nginx/html/*

# Copy repository files from build context and move required assets
COPY . /tmp/build
RUN cp -r /tmp/build/index.html . && \
    cp -r /tmp/build/print-cv.html . && \
    cp -r /tmp/build/css ./css && \
    cp -r /tmp/build/js ./js && \
    cp -r /tmp/build/data ./data && \
    cp -r /tmp/build/FoodDelivery ./FoodDelivery && \
    cp -r /tmp/build/k8s ./k8s 2>/dev/null || true && \
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

# Health check (wget di busybox: nessun pacchetto da installare).
# 127.0.0.1 e non 'localhost': dentro l'immagine localhost risolve prima in IPv6
# (::1) e il nostro nginx.conf ascolta solo su IPv4 -> connection refused.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
