import fs from 'fs';
import path from 'path';

const dirs = [
  path.join(process.cwd(), 'cities'),
  path.join(process.cwd(), 'public')
];

let filesFixed = 0;

function fixEncoding(content) {
  let newContent = content;
  
  // Remove replacement characters (often from corrupted Webflow export timestamps)
  newContent = newContent.replace(/\uFFFD/g, '');
  
  // Fix Windows-1252 Mojibake
  newContent = newContent.replace(/â€™/g, "'");
  newContent = newContent.replace(/â€œ/g, '"');
  newContent = newContent.replace(/â€\x9D/g, '"'); // Right double quote
  newContent = newContent.replace(/â€/g, '"');    // Catch-all for broken quotes
  newContent = newContent.replace(/Ã©/g, 'é');
  newContent = newContent.replace(/Â/g, '');      // Non-breaking space artifacts
  
  return newContent;
}

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const fixedContent = fixEncoding(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      filesFixed++;
      console.log(`Fixed encoding in ${file}`);
    }
  }
}

console.log(`Successfully fixed encoding in ${filesFixed} files.`);
