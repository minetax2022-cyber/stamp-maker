const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'fonts');
const bufA = fs.readFileSync(path.join(fontsDir, 'HJ한전서A.ttf')).toString('base64');
const bufB = fs.readFileSync(path.join(fontsDir, 'HJ한전서B.ttf')).toString('base64');

const cssContent = `@font-face {
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
`;

fs.writeFileSync(path.join(fontsDir, 'fonts.css'), cssContent);
console.log('fonts.css generated successfully! Length:', cssContent.length);
