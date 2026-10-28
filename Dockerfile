# Base image fissata a una patch recente: 1.31.0-alpine-slim e' stato costruito a
# maggio 2026 e da allora si portava dietro openssl e pcre2 non patchati (alert
# Trivy #46 #51 #78 #83 openssl, #115 #116 #117 #118 pcre2). 1.31.8-alpine-slim
# e' del 24 ottobre 2026. Resta la stessa serie 1.31, quindi nessun salto di
# comportamento: cambiano solo i pacchetti alpine sotto.
FROM nginx:1.31.8-alpine-slim

# Nessun pacchetto extra: git non serve piu' (il build usa il context, non un clone)
# e curl serviva solo all'HEALTHCHECK, che usa il wget di busybox gia' presente
# nell'immagine base. Ogni pacchetto in meno e' una superficie CVE in meno.

WORKDIR /usr/share/nginx/html

# Clean default content
RUN rm -rf /usr/share/nginx/html/*

# Copy repository files from build context and move the assets nginx must serve.
# Volutamente NON si copiano nella web root:
#   - nginx.conf (era servito pubblicamente su /nginx.conf: esponeva header
#     policy, regole di cache e path interni). Serve solo in /etc/nginx.
#   - k8s/ (manifest di un cluster in dismissione, senza alcun uso a runtime).
COPY . /tmp/build
RUN cp -r /tmp/build/index.html . && \
    cp -r /tmp/build/print-cv.html . && \
    cp -r /tmp/build/css ./css && \
    cp -r /tmp/build/js ./js && \
    cp -r /tmp/build/data ./data && \
    cp -r /tmp/build/FoodDelivery ./FoodDelivery && \
    cp -r /tmp/build/*.pdf . 2>/dev/null || true && \
    cp -r /tmp/build/*.png . 2>/dev/null || true && \
    cp -r /tmp/build/*.svg . 2>/dev/null || true && \
    rm -rf /tmp/build

# Configurazione nginx: va solo in /etc/nginx, mai nella web root.
COPY nginx.conf /etc/nginx/nginx.conf

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
