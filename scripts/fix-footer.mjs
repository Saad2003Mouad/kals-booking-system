import fs from 'fs';
import path from 'path';

const correctCallUsBlock = `<div class="footer-titel-s">Call Us</div><div><a href="tel:6179993803" class="footer-link w-inline-block"><div class="footer-link-move"><div class="footer-link-w">617-999-3803</div><div class="footer-link-o">617-999-3803</div></div></a></div><div><a href="tel:6178662727" class="footer-link w-inline-block"><div class="footer-link-move"><div class="footer-link-w">617-866-2727</div><div class="footer-link-o">617-866-2727</div></div></a></div><div class="footer-titel-s">Work Hours</div>`;

const dirs = [
  path.join(process.cwd(), 'cities'),
  path.join(process.cwd(), 'public')
];

let filesFixed = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const regex = /<div class="footer-titel-s">Call Us<\/div>[\s\S]*?<div class="footer-titel-s">Work Hours<\/div>/;
    
    if (regex.test(content)) {
      const match = content.match(regex)[0];
      if (match !== correctCallUsBlock) {
        content = content.replace(regex, correctCallUsBlock);
        fs.writeFileSync(filePath, content, 'utf8');
        filesFixed++;
        console.log(`Standardized footer in ${file}`);
      }
    }
  }
}

// Also fix React components if they have the footer block
const tsxFooterPath = path.join(process.cwd(), 'src', 'components', 'SiteFooter.tsx');
if (fs.existsSync(tsxFooterPath)) {
  let tsxContent = fs.readFileSync(tsxFooterPath, 'utf8');
  // In TSX, we don't have the exact HTML string, we look for the phone block
  // Let's check how it's written in TSX:
  if (tsxContent.includes('617-999-3803') && tsxContent.match(/617-999-3803/g)?.length > 4) {
    console.log("SiteFooter.tsx might have duplicate numbers. Please check manually.");
  }
}

console.log(`Successfully standardized footer in ${filesFixed} HTML files.`);
