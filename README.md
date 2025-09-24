# Drunkitties

Aplicación de ejemplo para vender camisetas, hoodies y mousepads con temática de mascotas. Permite subir la foto de tu mascota y
obtener diseños generados por IA usando la API de OpenAI.

## Requisitos
- Node.js 18+
- Dependencias instaladas (`npm install`)
- Un token de la API de OpenAI

## Configuración
1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Abre `.env` y reemplaza `coloca_tu_token_aqui` por tu token real de OpenAI.

## Ejecutar en local
```bash
npm start
```
El servidor se ejecutará en `http://localhost:3000`.

La aplicación ahora envía las imágenes como Base64, por lo que puedes probarla desde el navegador sin dependencias externas. Si estás usando Netlify CLI, también puedes ejecutar `netlify dev` para utilizar las funciones serverless localmente.

## Despliegue en Netlify
- El sitio está configurado para publicarse desde la carpeta `public/`.
- Las funciones serverless viven en `netlify/functions`.
- Define la variable de entorno `OPENAI_API_KEY` en los ajustes del sitio.
- El endpoint para generar variaciones es `/.netlify/functions/generate`.
