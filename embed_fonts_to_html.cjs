const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'fonts');
const bufA = fs.readFileSync(path.join(fontsDir, 'HJ한전서A.ttf')).toString('base64');
const bufB = fs.readFileSync(path.join(fontsDir, 'HJ한전서B.ttf')).toString('base64');

const htmlPath1 = path.join(__dirname, 'index.html');
const htmlPath2 = path.join(__dirname, '..', 'index.html');

function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf-8');

  // Replace @font-face for HJ한전서A and HJ한전서B with Base64 embedded fonts
  const fontStyleRegex = /\/\* Local Installed Fonts \([\s\S]*?\/\* 4 Column Font Classes \*\//;
  const newFontStyle = `/* Local Installed Fonts (@font-face base64 embedded) */
    @font-face {
      font-family: 'HJ한전서A';
      src: url('data:font/ttf;charset=utf-8;base64,${bufA}') format('truetype'),
           url('./fonts/HJ한전서A.ttf') format('truetype'),
           local('HJ한전서A'), local('HJ-HanJeonSeoA'), local('HJHanJeonSeoA'), local('HanjeonseoA'), local('한전서A');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'HJ한전서B';
      src: url('data:font/ttf;charset=utf-8;base64,${bufB}') format('truetype'),
           url('./fonts/HJ한전서B.ttf') format('truetype'),
           local('HJ한전서B'), local('HJ-HanJeonSeoB'), local('HJHanJeonSeoB'), local('HanjeonseoB'), local('한전서B');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }

    /* 4 Column Font Classes */`;

  html = html.replace(fontStyleRegex, newFontStyle);
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('Successfully updated Base64 fonts in:', filePath);
}

updateHtmlFile(htmlPath1);
updateHtmlFile(htmlPath2);
