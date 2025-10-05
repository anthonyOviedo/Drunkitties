const fs = require('fs');
const os = require('os');
const path = require('path');
const { OpenAI } = require('openai');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falta la variable de entorno OPENAI_API_KEY.' })
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No se recibió ninguna imagen.' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const { image, size = '512x512' } = payload;
    let { variations = 2 } = payload;

    if (!image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La imagen es obligatoria.' })
      };
    }

    variations = clamp(parseInt(variations, 10) || 2, 1, 4);

    const buffer = Buffer.from(image, 'base64');
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'drunkitties-'));
    const tempFile = path.join(tempDir, 'mascota.png');
    await fs.promises.writeFile(tempFile, buffer);

    try {
      const response = await openai.images.variations({
        model: 'gpt-image-1',
        image: fs.createReadStream(tempFile),
        n: variations,
        size
      });

      const images = (response.data || [])
        .map((img) => img.b64_json)
        .filter(Boolean);

      return {
        statusCode: 200,
        body: JSON.stringify({ images })
      };
    } finally {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.error('Fallo en la función generate:', error);
    const message = error?.response?.data?.error?.message || error.message || 'Fallo generando imagen.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fallo generando imagen.', details: message })
    };
  }
};
