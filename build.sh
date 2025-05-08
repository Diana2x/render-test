#!/bin/bash

# Crear directorio js si no existe
mkdir -p ./js

# Generar archivo config.js a partir de variables de entorno
echo "// Configuración de Firebase generada automáticamente durante el despliegue
export const firebaseConfig = {
  apiKey: \"$FIREBASE_API_KEY\",
  authDomain: \"$FIREBASE_AUTH_DOMAIN\",
  projectId: \"$FIREBASE_PROJECT_ID\",
  storageBucket: \"$FIREBASE_STORAGE_BUCKET\",
  messagingSenderId: \"$FIREBASE_MESSAGING_SENDER_ID\",
  appId: \"$FIREBASE_APP_ID\"
};" > ./js/config.js

echo "Archivo config.js generado correctamente"
