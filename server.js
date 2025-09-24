const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // token definido en .env

app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

const generateHandler = async (req, res) => {
  try {
    const { image } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'Debes enviar una imagen.' });
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

      return res.json({ images: result.data.map(img => img.b64_json) });
    } finally {
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.error('No se pudo eliminar el archivo temporal:', cleanupError);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fallo generando imagen.' });
  }
};

app.post('/api/generate', generateHandler);
app.post('/.netlify/functions/generate', generateHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});
