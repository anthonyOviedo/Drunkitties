document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('petImage');
  const formData = new FormData();
  formData.append('petImage', fileInput.files[0]);

  const res = await fetch('/api/generate', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = '';
  if (data.images) {
    data.images.forEach((b64) => {
      const img = document.createElement('img');
      img.src = `data:image/png;base64,${b64}`;
      contenedor.appendChild(img);
    });
  } else {
    contenedor.textContent = data.error || 'Error desconocido';
  }
});
