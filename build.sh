#!/bin/bash

echo "Iniciando script de compilación..."

# Crear directorio js si no existe
mkdir -p ./js
echo "Directorio js verificado"

# Mostrar variables de entorno disponibles (enmascaradas)
echo "Verificando variables de entorno disponibles:"
echo "FIREBASE_API_KEY existe: $(if [ -n "$FIREBASE_API_KEY" ]; then echo 'SÍ'; else echo 'NO'; fi)"
echo "FIREBASE_AUTH_DOMAIN existe: $(if [ -n "$FIREBASE_AUTH_DOMAIN" ]; then echo 'SÍ'; else echo 'NO'; fi)"
echo "FIREBASE_PROJECT_ID existe: $(if [ -n "$FIREBASE_PROJECT_ID" ]; then echo 'SÍ'; else echo 'NO'; fi)"
echo "FIREBASE_STORAGE_BUCKET existe: $(if [ -n "$FIREBASE_STORAGE_BUCKET" ]; then echo 'SÍ'; else echo 'NO'; fi)"
echo "FIREBASE_MESSAGING_SENDER_ID existe: $(if [ -n "$FIREBASE_MESSAGING_SENDER_ID" ]; then echo 'SÍ'; else echo 'NO'; fi)"
echo "FIREBASE_APP_ID existe: $(if [ -n "$FIREBASE_APP_ID" ]; then echo 'SÍ'; else echo 'NO'; fi)"

# Generar archivo config.js con valores de respaldo si las variables no existen
cat > ./js/config.js << EOL
// Configuración de Firebase generada automáticamente durante el despliegue
export const firebaseConfig = {
  apiKey: "${FIREBASE_API_KEY:-AIzaSyBpl6eYQ8TLR2L-OvbvgrBPBpbdEMaUmPA}",
  authDomain: "${FIREBASE_AUTH_DOMAIN:-nextjstodolist-89757.firebaseapp.com}",
  projectId: "${FIREBASE_PROJECT_ID:-nextjstodolist-89757}",
  storageBucket: "${FIREBASE_STORAGE_BUCKET:-nextjstodolist-89757.firebasestorage.app}",
  messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID:-806628273126}",
  appId: "${FIREBASE_APP_ID:-1:806628273126:web:b212788db574f2054e8427}"
};
EOL

echo "Archivo config.js generado correctamente"
echo "Estructura del archivo (sin mostrar valores reales):"
grep -v "apiKey\|appId" ./js/config.js
