const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'index.html');
const file2 = path.join(__dirname, '..', 'index.html');

function fixSymbolFont(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf-8');

  // Replace line: ctx.font = `bold ${Math.max(26, style.fontSize)}px ${fontCss}`;
  // with guaranteed font for symbols (● and ★)
  const oldLine = /ctx\.font = `bold \${Math\.max\(26, style\.fontSize\)}px \${fontCss}`;/g;
  const newLine = `ctx.font = \`bold \${Math.max(26, style.fontSize)}px 'Noto Serif KR', 'Nanum Myeongjo', 'Gungsuh', sans-serif\`;`;

  html = html.replace(oldLine, newLine);
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('Successfully updated symbol font in:', filePath);
}

fixSymbolFont(file1);
fixSymbolFont(file2);
