import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Boston Legend Ice Cream Truck",
  "image": "https://www.bostonlegendicecreamtruck.com/hero_legend.jpg",
  "url": "https://www.bostonlegendicecreamtruck.com",
  "telephone": "+16179993803",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Boston",
    "addressRegion": "MA",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "State", "name": "Massachusetts" }
  ],
  "priceRange": "$$"
};

const scriptTag = `\n<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>\n</head>`;

function injectSchema() {
  const files = fs.readdirSync(PUBLIC_DIR);
  let count = 0;
  
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    const filePath = path.join(PUBLIC_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('application/ld+json')) {
      console.log(`Skipping ${file} - already has schema.`);
      continue;
    }
    
    // Insert right before </head>
    if (content.includes('</head>')) {
      content = content.replace('</head>', scriptTag);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Injected schema into ${file}`);
      count++;
    }
  }
  console.log(`Successfully injected into ${count} files.`);
}

injectSchema();
