import fs from 'fs';
const files = fs.readdirSync('./public').filter(f => f.endsWith('.html'));
let count = 0;
files.forEach(file => {
  let html = fs.readFileSync('./public/' + file, 'utf8');
  const newHtml = html.replace(
    '<script src="/bl-widgets.js" defer></script>',
    '<script src="/bl-widgets.js" async></script>'
  );
  if (newHtml !== html) {
    fs.writeFileSync('./public/' + file, newHtml, 'utf8');
    count++;
  }
});
console.log('Updated ' + count + ' files: defer -> async');
