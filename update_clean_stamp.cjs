const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'index.html');
const file2 = path.join(__dirname, '..', 'index.html');

const fontsCssBlock = `    /* Local Installed Fonts (@font-face mapping) */
    @font-face {
      font-family: 'HJ한전서A';
      src: url('./fonts/HJ한전서A.ttf') format('truetype'),
           url('./fonts/hanjeonseo-a.ttf') format('truetype'),
           local('HJ한전서A'), local('HJ-HanJeonSeoA'), local('HJHanJeonSeoA'), local('HanjeonseoA'), local('한전서A');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'HJ한전서B';
      src: url('./fonts/HJ한전서B.ttf') format('truetype'),
           url('./fonts/hanjeonseo-b.ttf') format('truetype'),
           local('HJ한전서B'), local('HJ-HanJeonSeoB'), local('HJHanJeonSeoB'), local('HanjeonseoB'), local('한전서B');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    /* 4 Column Font Classes */`;

const fontColumnsBlock = `    const FONT_COLUMNS = [
      { id: 'col1', name: 'HJ한전서A', fontCss: "'HJ한전서A', 'HanjeonseoA', 'Song Myung', 'Noto Serif KR', serif" },
      { id: 'col2', name: 'HJ한전서B', fontCss: "'HJ한전서B', 'HanjeonseoB', 'Song Myung', 'Noto Serif KR', serif" },
      { id: 'col3', name: 'Gungsuh', fontCss: "'Gungsuh', '궁서체', 'Song Myung', serif" },
      { id: 'col4', name: 'Noto Serif KR', fontCss: "'Noto Serif KR', 'Nanum Myeongjo', serif" }
    ];`;

const drawCorporateCircleBlock = `    // 5 & 6. Corporate Circle Seal (원형 법인 인감 - 1~4열 도넛 테두리와 원 안 모두 테두리 글자와 동일한 폰트로 여백 없이 꽉 채우기)
    function drawCorporateCircle(ctx, width, height, rawText, symbol, fontCss, colIndex) {
      const cx = width / 2;
      const cy = height / 2;

      const outerR = 110;
      const middleR = 64;
      const ringR = 86.5;

      // 1. Outer Circle
      ctx.lineWidth = 6.0;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Middle Circle (Inner Circle Border)
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cx, cy, middleR, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Center Text inside Inner Circle ("대표이사" / "代表理事")
      // 테두리 글자(fontCss)와 100% 동일한 폰트를 사용하여 1열, 2열, 3열, 4열 모두 원 안에 여백 없이 꽉 채우기
      const xOffset = 17.0;
      const yOffset = 19.0;
      const langVal = (document.getElementById('langSelect')?.value) || 'ko';
      const isHanja = langVal === 'han';

      const positions = isHanja ? [
        { char: '代', x: cx + xOffset, y: cy - yOffset },
        { char: '表', x: cx + xOffset, y: cy + yOffset },
        { char: '理', x: cx - xOffset, y: cy - yOffset },
        { char: '事', x: cx - xOffset, y: cy + yOffset }
      ] : [
        { char: '대', x: cx + xOffset, y: cy - yOffset },
        { char: '표', x: cx + xOffset, y: cy + yOffset },
        { char: '이', x: cx - xOffset, y: cy - yOffset },
        { char: '사', x: cx - xOffset, y: cy + yOffset }
      ];

      const fontSize = 44; // 원 안 여백 없이 꽉 채우는 폰트 크기
      positions.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(1.14, 1.25);
        ctx.font = \`bold \${fontSize}px \${fontCss}\`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = 1.4;
        ctx.strokeText(p.char, 0, 0);
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      // 4. Circular Outer Ring Text (도넛 테두리원에 상호명 아주 꽉 채우기 + 상단 구분기호 2행: ●, 3행: ★)
      const companyName = rawText.trim();
      const chars = companyName.split('');
      const totalItems = chars.length + 1;

      const angleStep = (2 * Math.PI) / totalItems;
      const startAngle = 0; // 12 o'clock position

      const style = getDonutTextStyle(chars.length);

      // Top Symbol (2행: ●, 3행: ★)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle);
      ctx.translate(0, -ringR);
      ctx.font = \`bold \${Math.max(26, style.fontSize)}px \${fontCss}\`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = style.strokeWidth;
      ctx.strokeText(symbol, 0, 0);
      ctx.fillText(symbol, 0, 0);
      ctx.restore();

      chars.forEach((char, i) => {
        const angle = startAngle + (i + 1) * angleStep;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.translate(0, -ringR);
        ctx.scale(style.scaleX, style.scaleY);

        ctx.font = \`bold \${style.fontSize}px \${fontCss}\`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = style.strokeWidth;
        ctx.strokeText(char, 0, 0);
        ctx.fillText(char, 0, 0);
        ctx.restore();
      });
    }`;

function processHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf-8');

  // Replace font styles block
  const fontStyleRegex = /\/\* Local Installed Fonts [\s\S]*?\/\* 4 Column Font Classes \*\//;
  if (fontStyleRegex.test(html)) {
    html = html.replace(fontStyleRegex, fontsCssBlock);
  }

  // Replace FONT_COLUMNS block
  const fontColumnsRegex = /const FONT_COLUMNS = \[[\s\S]*?\];/;
  if (fontColumnsRegex.test(html)) {
    html = html.replace(fontColumnsRegex, fontColumnsBlock);
  }

  // Replace drawCorporateCircle block
  const funcRegex = /\/\/\s*5\s*&\s*6\.\s*Corporate Circle Seal[\s\S]*?^    \}/m;
  if (funcRegex.test(html)) {
    html = html.replace(funcRegex, drawCorporateCircleBlock);
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('Successfully processed:', filePath);
}

processHtml(file1);
processHtml(file2);
