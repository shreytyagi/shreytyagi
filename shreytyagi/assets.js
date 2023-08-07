// assets.js
const cssFiles = [
  'css/style.css',
  'css/bootstrap.min.css',
];

const jsFiles = [
  'js/script.js',
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
