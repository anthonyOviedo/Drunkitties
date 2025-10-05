const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('petImage');
const variationInput = document.getElementById('variationCount');
const sizeSelect = document.getElementById('imageSize');
const preview = document.getElementById('preview');
const statusMessage = document.getElementById('formStatus');
const results = document.getElementById('resultados');

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('No pudimos leer el archivo.'));
    reader.readAsDataURL(file);
  });

const clearResults = () => {
  results.innerHTML = '';
  results.setAttribute('aria-busy', 'false');
};

const setStatus = (message, type = 'info') => {
  statusMessage.textContent = message;
  statusMessage.dataset.statusType = type;
};

const showPreview = (file) => {
  preview.innerHTML = '';
  if (!file) {
    preview.innerHTML = '<p class="preview__placeholder">Tu imagen aparecerá aquí en cuanto la selecciones.</p>';
    return;
  }

  const img = document.createElement('img');
  img.alt = `Vista previa de ${file.name}`;
  img.className = 'preview__image';
  img.src = URL.createObjectURL(file);
  preview.appendChild(img);
};

fileInput.addEventListener('change', () => {
  const [file] = fileInput.files;
  showPreview(file);
  clearResults();
  setStatus('Listo para generar tus diseños ✨');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const [file] = fileInput.files;

  if (!file) {
    setStatus('Selecciona primero la foto de tu mascota.', 'error');
    return;
  }

  if (file.size > 4 * 1024 * 1024) {
    setStatus('La imagen supera los 4 MB permitidos.', 'error');
    return;
  }

  try {
    form.classList.add('is-loading');
    results.setAttribute('aria-busy', 'true');
    clearResults();
    setStatus('Generando magia felina… esto puede tardar unos segundos.');

    const base64 = await readFileAsBase64(file);
    const payload = {
      image: base64,
      variations: variationInput.value,
      size: sizeSelect.value
    };

    const response = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.details || data?.error || 'Fallo inesperado.');
    }

    setStatus('¡Listo! Descarga tus nuevos diseños y compártelos.', 'success');

    if (!data.images?.length) {
      results.innerHTML = '<p class="results__empty">No se generaron imágenes. Intenta nuevamente.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    data.images.forEach((base64Image, index) => {
      const figure = document.createElement('figure');
      figure.className = 'result-card';

      const img = document.createElement('img');
      img.src = `data:image/png;base64,${base64Image}`;
      img.alt = `Variación ${index + 1} de tu mascota`;
      img.loading = 'lazy';

      const caption = document.createElement('figcaption');
      caption.textContent = `Variación ${index + 1}`;

      figure.appendChild(img);
      figure.appendChild(caption);
      fragment.appendChild(figure);
    });

    results.appendChild(fragment);
  } catch (error) {
    console.error(error);
    setStatus(error.message, 'error');
  } finally {
    form.classList.remove('is-loading');
    results.setAttribute('aria-busy', 'false');
  }
});
