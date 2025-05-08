#!/bin/bash

echo "Iniciando script de compilación..."

# Crear directorio js si no existe
mkdir -p ./js
echo "Directorio js verificado"

# Generar archivo config.js a partir de variables de entorno sin valores predeterminados
# para evitar exponer credenciales en el repositorio
cat > ./js/config.js << EOL
// Configuración de Firebase generada automáticamente durante el despliegue
export const firebaseConfig = {
  apiKey: "${FIREBASE_API_KEY}",
  authDomain: "${FIREBASE_AUTH_DOMAIN}",
  projectId: "${FIREBASE_PROJECT_ID}",
  storageBucket: "${FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${FIREBASE_APP_ID}"
};
EOL

echo "Archivo config.js generado correctamente"
echo "AVISO: Las claves API y otras credenciales no se muestran en los logs por seguridad"
