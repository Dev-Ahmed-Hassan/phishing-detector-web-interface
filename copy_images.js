const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'images');
const destDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const map = {
  'Code Alpha.png': 'code-alpha.png',
  'PCT Fielding Coach.png': 'pct-fielding-coach.png',
  'Ubexis.jpeg': 'ubexis.jpeg'
};

for (const [src, dest] of Object.entries(map)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest}`);
  }
}
