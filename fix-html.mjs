import fs from 'fs';

const htmlFiles = fs.readdirSync('./public').filter(f => f.endsWith('.html'));

let updatedCount = 0;
for (const file of htmlFiles) {
  const filePath = './public/' + file;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Bump cache version to v6
  if (content.match(/src="\/bl-widgets\.js(\?v=\d+)?"\s*async/)) {
    const newContent = content.replace(/src="\/bl-widgets\.js(\?v=\d+)?"(\s*async)?/, 'src="/bl-widgets.js?v=6" async');
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  } else if (content.includes('src="/bl-widgets.js"')) {
    content = content.replace('src="/bl-widgets.js"', 'src="/bl-widgets.js?v=6" async');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}
console.log('Updated ' + updatedCount + ' HTML files to v6.');
