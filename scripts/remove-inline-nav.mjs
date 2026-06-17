import fs from 'fs';

const htmlFiles = fs.readdirSync('./public').filter(f => f.endsWith('.html'));

let updated = 0;
for (const file of htmlFiles) {
  const filePath = './public/' + file;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // The script starts with <script>\n(function(){\n  function initNav(){ and ends with })();\n</script>
  const regex = /<script>\s*\(function\(\)\{\s*function initNav\(\)[\s\S]*?\)\(\);\s*<\/script>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log(`Removed inline script from ${file}`);
  }
}

console.log(`Cleaned up ${updated} files.`);
