let uuidv4;

const handler = async (event) => {
  try {
    if (!uuidv4) {
      const { v4 } = await import('uuid');
      uuidv4 = v4;
    }

    const { positivePrompt, negativePrompt, seedImage, strength, width, height, steps } = JSON.parse(event.body || '{}');

    if (!seedImage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El parámetro 'seedImage' (imagen base) es obligatorio para image-to-image." }),
      };
    }

    const payload = [
      {
        taskType: 'imageInference',
        taskUUID: uuidv4(),
        model: 'runware:101@1',
        positivePrompt: positivePrompt || 'Artistic portrait in watercolor style',
        negativePrompt: negativePrompt || '',
        seedImage,
        strength: strength || 0.9,
        width: width || 1024,
        height: height || 1024,
        steps: steps || 30,
      },
    ];
    
    console.log('Payload enviado a Runware:', JSON.stringify(payload, null, 2));
    
    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RUNWARE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Respuesta completa de Runware:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Error en la API de Runware:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.errors || 'Error al generar la imagen.' }),
      };
    }

    const imageURL = data?.data?.[0]?.imageURL;

    if (!imageURL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No se encontró imagen en la respuesta de Runware.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ imageURL }),
    };
  } catch (error) {
    console.error('Error interno en la función generate:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = { handler };