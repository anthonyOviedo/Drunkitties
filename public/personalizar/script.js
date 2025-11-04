const form = document.getElementById('personalizationForm');
const fileInput = document.getElementById('petImagePersonalizar');
const artStyle = document.getElementById('artStyle');
const productSize = document.getElementById('productSize');
const notes = document.getElementById('notes');
const preview = document.querySelector('.preview');
const spinner = document.querySelector('.spinner');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const [file] = fileInput.files;
  if (!file) {
    alert('Por favor, selecciona una imagen.');
    return;
  }

  const base64 = await readFileAsBase64(file);

  const payload = {
    seedImage: base64,
    positivePrompt: `Estilo: ${artStyle.value}, Tamaño: ${productSize.value}`,
    negativePrompt: notes.value || 'ninguno',
  };

  spinner.style.display = 'block';
  preview.innerHTML = '';

  try {
    const response = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error generando imagen.');

    const img = document.createElement('img');

    if (data.imageURL.startsWith('data:image')) {
      img.src = data.imageURL;
    } else if (data.imageURL.startsWith('http')) {
      img.src = data.imageURL;
    } else {
      img.src = `data:image/png;base64,${data.imageURL}`;
    }

    img.alt = 'Vista previa del diseño generado';
    img.className = 'preview__image';
    preview.appendChild(img);
  } catch (error) {
    console.error(error);
    alert('Error: ' + error.message);
  } finally {
    spinner.style.display = 'none';
  }
});

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Error leyendo el archivo.'));
    reader.readAsDataURL(file);
  });
