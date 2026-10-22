function initAsciiBackground() {
  const output = document.getElementById('ascii-background');
  const sampler = document.getElementById('ascii-sampler');
  if (!output || !sampler) return;

  const outputContext = output.getContext('2d');
  const samplerContext = sampler.getContext('2d', { willReadFrequently: true });
  if (!outputContext || !samplerContext) return;

  const characters = '@%#*+=-:. ';
  const opacity = 0.32;
  const fontSizeCss = 7;
  const state = { pointerX: 0, pointerY: 0 };
  const image = new Image();
  let resizeFrame = 0;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  function render() {
    if (!image.naturalWidth) return;

    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    output.width = width;
    output.height = height;
    output.style.opacity = String(opacity);

    const fontSize = fontSizeCss * ratio;
    outputContext.font = `${fontSize}px monospace`;
    outputContext.textBaseline = 'top';
    const characterWidth = Math.max(1, outputContext.measureText('M').width);
    const columns = Math.ceil(width / characterWidth);
    const rows = Math.ceil(height / fontSize);

    sampler.width = columns;
    sampler.height = rows;
    samplerContext.clearRect(0, 0, columns, rows);

    const downShift = (2 * 96 / 2.54) * ratio;
    const safeEdge = 24 * ratio;
    const scale = Math.max(
      (width + safeEdge * 2) / image.naturalWidth,
      (height + downShift * 2 + safeEdge * 2) / image.naturalHeight
    );
    const targetPixelWidth = image.naturalWidth * scale;
    const targetPixelHeight = image.naturalHeight * scale;
    const shiftX = state.pointerX * Math.max(2 * ratio, (targetPixelWidth - width) * 0.12);
    const shiftY = state.pointerY * Math.max(1 * ratio, (targetPixelHeight - height - downShift * 2) * 0.1);
    const x = ((width - targetPixelWidth) / 2 + shiftX) / characterWidth;
    const y = ((height - targetPixelHeight) / 2 + downShift + shiftY) / fontSize;
    const targetWidth = targetPixelWidth / characterWidth;
    const targetHeight = targetPixelHeight / fontSize;
    samplerContext.drawImage(image, x, y, targetWidth, targetHeight);

    const pixels = samplerContext.getImageData(0, 0, columns, rows).data;
    outputContext.clearRect(0, 0, width, height);
    outputContext.fillStyle = '#4d493e';

    for (let row = 0; row < rows; row += 1) {
      let line = '';
      for (let column = 0; column < columns; column += 1) {
        const offset = (row * columns + column) * 4;
        const alpha = pixels[offset + 3];
        if (alpha < 24) {
          line += ' ';
          continue;
        }
        const luminance = (pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722) / 255;
        const contrasted = clamp((luminance - 0.12) / 0.76, 0, 1);
        const index = clamp(Math.floor(contrasted * (characters.length - 1)), 0, characters.length - 1);
        line += characters[index];
      }
      outputContext.fillText(line, 0, row * fontSize);
    }
  }

  function scheduleRender() {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(render);
  }

  document.addEventListener('pointermove', event => {
    state.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    state.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    scheduleRender();
  }, { passive: true });

  window.addEventListener('resize', scheduleRender, { passive: true });
  image.addEventListener('load', render);
  image.src = '/images/nier/2b_wallpaper.jpg';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAsciiBackground, { once: true });
} else {
  initAsciiBackground();
}
