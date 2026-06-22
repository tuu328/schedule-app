import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
    <rect width="192" height="192" rx="40" fill="#f9f6f3"/>
    <circle cx="96" cy="72" r="32" fill="#f8bbd0"/>
    <circle cx="84" cy="68" r="4" fill="#fff"/>
    <circle cx="108" cy="68" r="4" fill="#fff"/>
    <path d="M80 84 Q96 96 112 84" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="48" y="120" width="96" height="8" rx="4" fill="#e8ddd0"/>
    <rect x="48" y="140" width="72" height="8" rx="4" fill="#e8ddd0"/>
    <rect x="48" y="160" width="48" height="8" rx="4" fill="#e8ddd0"/>
</svg>
`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const outputDir = path.join(process.cwd(), 'public', 'icons');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
    for (const size of sizes) {
        await sharp(Buffer.from(svgContent))
            .resize(size, size)
            .png()
            .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
        console.log(`Generated icon-${size}x${size}.png`);
    }
    console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
    console.error('Error generating icons:', err);
    process.exit(1);
});