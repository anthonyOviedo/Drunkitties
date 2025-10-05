# Drunkitties

Una experiencia web para generar merchandising felino con ayuda de la IA. Sube la foto de tu mascota y obtén variaciones listas para imprimir, perfectas para camisetas, hoodies o accesorios.

## Características
- Interfaz moderna en español con vista previa instantánea.
- Generación de hasta cuatro variaciones mediante el modelo `gpt-image-1` de OpenAI.
- Funcionamiento serverless preparado para desplegar en Netlify.

## Requisitos
- Node.js 18 o superior.
- Cuenta y clave de API de [OpenAI](https://platform.openai.com/).
- (Opcional) [Netlify CLI](https://docs.netlify.com/cli/get-started/) para desarrollo local.

## Configuración local
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` con tu clave de OpenAI (también puedes usar `.env.example` como plantilla):
   ```bash
   cp .env.example .env
   # edita .env y define OPENAI_API_KEY
   ```
3. Inicia el entorno de desarrollo con Netlify CLI:
   ```bash
   npx netlify dev
   ```
   Esto servirá los archivos estáticos desde `public/` y ejecutará la función serverless `/.netlify/functions/generate`.

> **Nota:** si no deseas instalar Netlify CLI de forma global puedes ejecutar los comandos anteriores con `npx`.

## Despliegue en Netlify
1. Crea un nuevo sitio en Netlify y vincúlalo con este repositorio.
2. Configura la variable de entorno `OPENAI_API_KEY` en la sección **Site settings → Environment variables**.
3. Netlify utilizará el archivo [`netlify.toml`](netlify.toml) incluido para saber que el directorio público es `public/` y que las funciones viven en `netlify/functions/`.
4. Publica el sitio. Una vez desplegado podrás acceder a la interfaz y generar tus diseños directamente desde tu navegador.

## Scripts disponibles
- `npm start`: alias de `npm run dev` para facilitar el uso en servicios como Netlify.
- `npm run dev`: ejecuta `netlify dev`.
- `npm run build`: comando vacío (no hay proceso de compilación, pero Netlify requiere un script).
- `npm test`: placeholder sin pruebas automatizadas por ahora.

## Licencia
Distribuido bajo la licencia ISC. Consulta el archivo [LICENSE](LICENSE) para más detalles.
