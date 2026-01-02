const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// SVG content for the icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <g transform="translate(256, 256)" fill="white">
    <line x1="0" y1="-120" x2="0" y2="120" stroke="white" stroke-width="20" stroke-linecap="round"/>
    <line x1="-104" y1="-60" x2="104" y2="60" stroke="white" stroke-width="20" stroke-linecap="round"/>
    <line x1="-104" y1="60" x2="104" y2="-60" stroke="white" stroke-width="20" stroke-linecap="round"/>
    <line x1="0" y1="-120" x2="-30" y2="-90" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="0" y1="-120" x2="30" y2="-90" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="0" y1="120" x2="-30" y2="90" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="0" y1="120" x2="30" y2="90" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="-104" y1="-60" x2="-74" y2="-75" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="-104" y1="-60" x2="-89" y2="-30" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="104" y1="60" x2="74" y2="75" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="104" y1="60" x2="89" y2="30" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="-104" y1="60" x2="-74" y2="75" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="-104" y1="60" x2="-89" y2="30" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="104" y1="-60" x2="74" y2="-75" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <line x1="104" y1="-60" x2="89" y2="-30" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="25" fill="white"/>
  </g>
</svg>`;

async function generateIcons() {
  // Ensure directory exists
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  // Generate PNGs from SVG
  for (const size of sizes) {
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(iconDir, `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }

  console.log('All icons generated!');
}

generateIcons().catch(console.error);
