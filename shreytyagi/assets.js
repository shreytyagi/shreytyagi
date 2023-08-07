// assets.js
const cssFiles = [
  'css/style.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
];

const jsFiles = [
  'js/script.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
];

function addCssFiles() {
  for (const file of cssFiles) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
  }
}

function addJsFiles() {
  for (const file of jsFiles) {
    const script = document.createElement('script');
    script.src = file;
    document.body.appendChild(script);
  }
}

addCssFiles();
addJsFiles();
