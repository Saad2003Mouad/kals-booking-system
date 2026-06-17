import fs from 'fs';

// 1. Replace Hero Image in all HTML files
const htmlFiles = fs.readdirSync('./public').filter(f => f.endsWith('.html'));
const oldUrl = 'https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif';
const oldSrcset = 'srcset="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif 910w"';

let updatedCount = 0;
for (const file of htmlFiles) {
  const filePath = './public/' + file;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  if (content.includes(oldUrl)) {
    content = content.split(oldUrl).join('/hero_legend.jpg');
    changed = true;
  }
  if (content.includes(oldSrcset)) {
    content = content.split(oldSrcset).join('srcset="/hero_legend.jpg 500w, /hero_legend.jpg 910w"');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}
console.log('Updated hero image in ' + updatedCount + ' files.');

// 2. Fix bl-widgets.js z-index and add logs
let js = fs.readFileSync('./public/bl-widgets.js', 'utf8');
js = js.replace('z-index: 9999;', 'z-index: 2147483647; /* MAX Z-INDEX */');
js = js.replace('z-index: 9998;', 'z-index: 2147483646;');
if (!js.includes('console.log("Chat widget injected successfully")')) {
  js = js.replace('document.body.appendChild(chatRoot);', 'document.body.appendChild(chatRoot); console.log("Chat widget injected successfully");');
}
fs.writeFileSync('./public/bl-widgets.js', js, 'utf8');
console.log('Updated bl-widgets.js with max z-index.');
