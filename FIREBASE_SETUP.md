# Firebase Configuration Guide

## Problema Resuelto: Proyectos no se guardan en Firebase

Este proyecto ahora incluye las reglas de seguridad necesarias para Firestore y Storage.

## 🚀 Configuración Rápida (Recomendado)

### 1. Ejecutar el Script de Configuración Rápida

```bash
node setup-cors-quick.js
```

Este script:
- Crea el archivo `cors.json` si no existe
- Te da instrucciones claras para configurar CORS
- Te explica alternativas si CORS es complicado

### 2. Configurar CORS (Paso Crítico)

**Este es el paso más importante para resolver el error de CORS.**

Ejecuta el comando que te da el script:

```bash
gsutil cors set cors.json gs://studio-7639868049-100f7.firebasestorage.app
```

### 3. Verificar Funcionamiento

1. Ve al panel de admin (`/admin`)
2. Inicia sesión con Google
3. Ve a la pestaña "Projects"
4. Haz click en "Test Connection" para verificar la conectividad
5. Crea un proyecto de prueba con una imagen
6. Verifica que aparezca en la lista y en el homepage

## 🔧 Configuración Manual (Alternativa)

Si no puedes usar el script automático, sigue estos pasos:

### Firestore Security Rules

Ve a Firebase Console > Firestore Database > Rules y reemplaza las reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection - allow read/write for authenticated users
    match /projects/{document} {
      allow read, write: if request.auth != null;
    }

    // Content collection - allow read/write for authenticated users
    match /content/{document} {
      allow read, write: if request.auth != null;
    }

    // About collection - allow read/write for authenticated users
    match /about/{document} {
      allow read, write: if request.auth != null;
    }

    // Settings collection - allow read/write for authenticated users
    match /settings/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules

Ve a Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Projects images - allow read/write for authenticated users
    match /projects/{allPaths=**} {
      allow read, write: if request.auth != null;
    }

    // Content images - allow read/write for authenticated users
    match /content/{allPaths=**} {
      allow read, write: if request.auth != null;
    }

    // About images - allow read/write for authenticated users
    match /about/{allPaths=**} {
      allow read, write: if request.auth != null;
    }

    // Allow read access to all files for public viewing
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

### CORS Configuration

Configura CORS manualmente en Google Cloud Console:

1. Ve a https://console.cloud.google.com/storage/browser
2. Selecciona el bucket `studio-7639868049-100f7.firebasestorage.app`
3. Ve a la pestaña "Configuration"
4. En "CORS configuration", pega:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:9002", "https://studio-7639868049-100f7.web.app", "https://studio-7639868049-100f7.firebaseapp.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "Accept-Encoding", "X-CSRF-Token"]
  }
]
```

## 🛠️ Solución Rápida Sin CORS

Si la configuración de CORS es demasiado complicada, puedes:

1. **Usar URLs de Imágenes Directas**: Sube tus imágenes a servicios como:
   - Imgur
   - Cloudinary
   - GitHub (como releases)
   - ImgBB

2. **En el Admin Panel**: Cuando crees proyectos, pega la URL directa de la imagen en el campo "Image URL" en lugar de subir un archivo.

## 🔍 Debugging

Si los proyectos no se guardan:

1. **Verifica la autenticación**: Asegúrate de estar logueado
2. **Revisa las reglas**: Confirma que las reglas de Firestore estén actualizadas
3. **Configura CORS**: Este es el paso más común que se olvida
4. **Verifica la consola**: Los logs detallados te dirán exactamente qué está fallando
5. **Test Connection**: Usa el botón de prueba para verificar la conectividad

## 📁 Archivos de Configuración

- `firestore.rules`: Reglas de seguridad para Firestore
- `storage.rules`: Reglas de seguridad para Storage
- `cors.json`: Configuración CORS para Storage
- `setup-cors-quick.js`: Script de configuración rápida

## 🎯 Próximos Pasos

1. Ejecuta `node setup-cors-quick.js`
2. Sigue las instrucciones que te da
3. Prueba crear un proyecto con imagen
4. ¡Todo debería funcionar!