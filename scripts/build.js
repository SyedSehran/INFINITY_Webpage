import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT, 'public');
const DIST_DIR = path.resolve(ROOT, 'dist');

// Ensure output directories exist first
for (const dir of [PUBLIC_DIR, DIST_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Attempt Tailwind compilation with safe fallbacks
try {
  console.log('Compiling Tailwind CSS to style.css...');
  const binTailwind = path.join(ROOT, 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');
  if (fs.existsSync(binTailwind)) {
    execSync(`"${binTailwind}" -i ./src/input.css -o ./style.css --minify`, { stdio: 'inherit', cwd: ROOT });
  } else {
    execSync('npx tailwindcss -i ./src/input.css -o ./style.css --minify', { stdio: 'inherit', cwd: ROOT });
  }
} catch (err) {
  console.warn('Tailwind dynamic build notice (proceeding with committed production style.css):', err.message);
}

// Populate both public and dist directories for universal Vercel / Netlify compatibility
const targetDirs = [PUBLIC_DIR, DIST_DIR];
const filesToCopy = ['index.html', 'style.css', 'favicon.svg'];
const dirsToCopy = ['js', 'fonts'];

for (const targetDir of targetDirs) {
  for (const file of filesToCopy) {
    const src = path.join(ROOT, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  for (const dir of dirsToCopy) {
    const srcDir = path.join(ROOT, dir);
    const destDir = path.join(targetDir, dir);
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, destDir, { recursive: true });
    }
  }
}

console.log('Build successfully prepared: both public/ and dist/ directories populated.');
