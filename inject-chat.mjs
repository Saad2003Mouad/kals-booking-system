import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");

function injectScript(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let html = fs.readFileSync(filePath, "utf-8");
  
  // Check if it already has bl-widgets.js
  if (html.includes('src="/bl-widgets.js"')) {
    console.log(`⏩ Already has bl-widgets: ${path.basename(filePath)}`);
    return;
  }
  
  // Inject before </body>
  const bodyClosePattern = /<\/body>/i;
  if (bodyClosePattern.test(html)) {
    html = html.replace(bodyClosePattern, `<script src="/bl-widgets.js"></script>\n</body>`);
    fs.writeFileSync(filePath, html, "utf-8");
    console.log(`✅ Injected bl-widgets into: ${path.basename(filePath)}`);
  } else {
    console.warn(`⚠️ No </body> found in: ${path.basename(filePath)}`);
  }
}

// Find all HTML files in public directory recursively
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith(".html")) {
      injectScript(fullPath);
    }
  }
}

processDir(PUBLIC);
console.log("Done injecting bl-widgets.js into HTML files!");
