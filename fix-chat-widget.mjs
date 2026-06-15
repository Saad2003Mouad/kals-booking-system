/**
 * fix-chat-widget.mjs
 * Ensures bl-widgets.js is loaded ONCE and correctly in every HTML file.
 * Removes duplicate/versioned script tags and injects a clean one before </body>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

let fixed = 0;
let alreadyOk = 0;

for (const file of files) {
  const filePath = path.join(publicDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // Remove ALL existing bl-widgets.js script tags (including versioned ones)
  const cleaned = html.replace(/<script[^>]*src=["'][^"']*bl-widgets\.js[^"']*["'][^>]*><\/script>/gi, '');

  // Check if we actually removed something
  const removedCount = (html.match(/<script[^>]*src=["'][^"']*bl-widgets\.js[^"']*["'][^>]*><\/script>/gi) || []).length;

  // Inject ONE clean script tag right before </body>
  const scriptTag = '<script src="/bl-widgets.js" defer></script>';
  
  let result;
  if (cleaned.includes('</body>')) {
    result = cleaned.replace('</body>', scriptTag + '\n</body>');
  } else {
    result = cleaned + scriptTag;
  }

  if (result !== html || removedCount !== 1) {
    fs.writeFileSync(filePath, result, 'utf-8');
    console.log(`✅ Fixed: ${file} (removed ${removedCount} old tags, injected 1 clean)`);
    fixed++;
  } else {
    alreadyOk++;
  }
}

console.log(`\n🎉 Done! Fixed: ${fixed} | Already OK: ${alreadyOk}`);
