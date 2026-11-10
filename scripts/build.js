import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT, 'public');

console.log('Compiling Tailwind CSS to style.css...');
execSync('tailwindcss -i ./src/input.css -o ./style.css --minify', { stdio: 'inherit', cwd: ROOT });

console.log('Populating Vercel public output directory...');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Copy static assets
const filesToCopy = ['index.html', 'style.css', 'favicon.svg'];
for (const file of filesToCopy) {
  const src = path.join(ROOT, file);
  const dest = path.join(PUBLIC_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

// Copy directories (js modules and self-hosted fonts)
const dirsToCopy = ['js', 'fonts'];
for (const dir of dirsToCopy) {
  const srcDir = path.join(ROOT, dir);
  const destDir = path.join(PUBLIC_DIR, dir);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
  }
}

console.log('Build complete: public directory is ready for Vercel deployment.');
