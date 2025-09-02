const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // token definido en .env

app.use(express.static('public'));

app.post('/api/generate', upload.single('petImage'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await openai.images.variations({
      model: 'gpt-image-1',
      image: fs.createReadStream(filePath),
      n: 2,
      size: '512x512'
    });
    fs.unlinkSync(filePath);
    res.json({ images: result.data.map(img => img.b64_json) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fallo generando imagen.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});
