const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'index.html');
const file2 = path.join(__dirname, '..', 'index.html');

const newDrawFunc = `    // 5 & 6. Corporate Circle Seal (원형 법인 인감 - 1~4열 도넛 테두리원 아주 꽉 채우기 + 1~2열 원 안 대표이사 한자 전서체 꽉채우기, 3~4열 한글 대표이사 유지)
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

      // 3. Center Text inside Inner Circle
      if (colIndex === 1 || colIndex === 2) {
        // 1열, 2열: 한자 전서체 "代表理事" - 원 안에 여백 없이 꽉 채우기
        const xOffset = 16.5;
        const yOffset = 18.5;

        const hanjaPositions = [
          { char: '代', x: cx + xOffset, y: cy - yOffset },
          { char: '表', x: cx + xOffset, y: cy + yOffset },
          { char: '理', x: cx - xOffset, y: cy - yOffset },
          { char: '事', x: cx - xOffset, y: cy + yOffset }
        ];

        const hanjaFontSize = 44; // 원 안 여백 없이 꽉 채우는 전서체 한자 폰트 크기
        const centerFont = colIndex === 1
          ? \`\${hanjaFontSize}px 'HJ한전서A', 'HJ한전서B', 'Noto Serif KR', serif\`
          : \`\${hanjaFontSize}px 'HJ한전서B', 'HJ한전서A', 'Noto Serif KR', serif\`;

        hanjaPositions.forEach(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1.12, 1.22);
          ctx.font = centerFont;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.lineWidth = 1.5;
          ctx.strokeText(p.char, 0, 0);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      } else {
        // 3열, 4열: 기존 한글 "대표이사" ('대', '표', '이', '사') 손대지 않고 유지
        const xOffset = 17.5;
        const yOffset = 19.5;

        const hangeulPositions = [
          { char: '대', x: cx + xOffset, y: cy - yOffset },
          { char: '표', x: cx + xOffset, y: cy + yOffset },
          { char: '이', x: cx - xOffset, y: cy - yOffset },
          { char: '사', x: cx - xOffset, y: cy + yOffset }
        ];

        const hangeulFontSize = 44;
        hangeulPositions.forEach(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1.12, 1.24);
          ctx.font = \`bold \${hangeulFontSize}px \${fontCss}\`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.lineWidth = 1.4;
          ctx.strokeText(p.char, 0, 0);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      }

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
      ctx.font = \`bold \${Math.max(26, style.fontSize)}px 'Noto Serif KR', 'Nanum Myeongjo', serif\`;
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

        ctx.font = (colIndex === 1 || colIndex === 2)
          ? \`\${style.fontSize}px \${fontCss}\`
          : \`bold \${style.fontSize}px \${fontCss}\`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = style.strokeWidth;
        ctx.strokeText(char, 0, 0);
        ctx.fillText(char, 0, 0);
        ctx.restore();
      });
    }`;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  const funcRegex = /\/\/\s*5\s*&\s*6\.\s*Corporate Circle Seal[\s\S]*?^    \}/m;
  content = content.replace(funcRegex, newDrawFunc);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully updated drawCorporateCircle in:', filePath);
}

processFile(file1);
processFile(file2);
