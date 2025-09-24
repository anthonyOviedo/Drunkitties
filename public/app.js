document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('petImage');
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = '';

  const file = fileInput.files[0];
  if (!file) {
    contenedor.textContent = 'Debes seleccionar una imagen de tu mascota.';
    return;
  }

  try {
    const base64 = await readFileAsBase64(file);
    const res = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: base64 })
    });

    if (!res.ok) {
      throw new Error('Error al generar las variaciones.');
    }

    const data = await res.json();

    if (data.images) {
      data.images.forEach((b64) => {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${b64}`;
        contenedor.appendChild(img);
      });
    } else {
      contenedor.textContent = data.error || 'Error desconocido';
    }
  } catch (error) {
    console.error(error);
    contenedor.textContent = 'Ocurrió un problema al generar las imágenes.';
  }
});

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
