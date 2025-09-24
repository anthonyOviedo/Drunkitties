const fs = require('fs');
const os = require('os');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { image } = body;

    if (!image) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Debes enviar una imagen.' })
      };
    }

    const buffer = Buffer.from(image, 'base64');
    const tempPath = path.join(os.tmpdir(), `upload-${Date.now()}.png`);
    fs.writeFileSync(tempPath, buffer);

    try {
      const result = await openai.images.variations({
        model: 'gpt-image-1',
        image: fs.createReadStream(tempPath),
        n: 2,
        size: '512x512'
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: result.data.map(img => img.b64_json) })
      };
    } finally {
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.error('No se pudo eliminar el archivo temporal:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error generando variaciones:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Fallo generando imagen.' })
    };
  }
};
