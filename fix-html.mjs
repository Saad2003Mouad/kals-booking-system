import fs from 'fs';

const htmlFiles = fs.readdirSync('./public').filter(f => f.endsWith('.html'));

let updatedCount = 0;
for (const file of htmlFiles) {
  const filePath = './public/' + file;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Cache busting for bl-widgets.js
  if (content.includes('src="/bl-widgets.js"') && !content.includes('?v=')) {
    content = content.replace('src="/bl-widgets.js"', 'src="/bl-widgets.js?v=5"');
    changed = true;
  } else if (content.match(/src="\/bl-widgets\.js\?v=\d+"/)) {
    content = content.replace(/src="\/bl-widgets\.js\?v=\d+"/, 'src="/bl-widgets.js?v=5"');
    changed = true;
  }

  // 2. Fix layout bug: ensure home-header doesn't overlap and service-sec is above
  const fixStyle = '<style> .home-header { height: auto !important; min-height: 0 !important; overflow: visible !important; } .service-sec { position: relative; z-index: 99 !important; margin-top: 80px !important; clear: both; } </style></head>';
  if (!content.includes('.service-sec { position: relative; z-index: 99')) {
    content = content.replace('</head>', fixStyle);
    changed = true;
  }

  // Also reduce the size of the injected CTA form if it's there
  if (content.includes('min-height: 400px;')) {
    content = content.replace('min-height: 400px;', 'min-height: auto;');
    changed = true;
  }
  if (content.includes('margin: 40px 0;')) {
    content = content.replace('margin: 40px 0;', 'margin: 20px 0;');
    changed = true;
  }
  if (content.includes('padding: 60px 20px;')) {
    content = content.replace('padding: 60px 20px;', 'padding: 40px 20px;');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}
console.log('Fixed cache and layout in ' + updatedCount + ' HTML files.');
