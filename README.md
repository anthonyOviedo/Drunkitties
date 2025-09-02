# Drunkitties

Aplicación de ejemplo para vender camisetas, hoodies y mousepads con temática de mascotas. Permite subir la foto de tu mascota y obtener diseños generados por IA usando la API de OpenAI.

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

## Ejecutar
```bash
npm start
```
El servidor se ejecutará en `http://localhost:3000`.

Visita esa URL para subir la imagen de tu mascota y recibir diseños personalizados.
