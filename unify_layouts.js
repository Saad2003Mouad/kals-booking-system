const fs = require('fs');
const path = require('path');

// 1. Path definitions
const publicDir = path.join(__dirname, 'public');
const webflowDir = path.join(__dirname, 'boston-legend.webflow.io');

// 2. Read public/index.html to extract the master footer
const indexPath = path.join(publicDir, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error('Error: public/index.html not found! Run from the project root.');
    process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Extract the footer section
const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/gi;
const footerMatch = indexHtml.match(footerRegex);

if (!footerMatch) {
    console.error('Error: Could not find footer in public/index.html');
    process.exit(1);
}

// Clean the footer template: remove active page indicators (w--current and aria-current)
let masterFooter = footerMatch[0];
masterFooter = masterFooter.replace(/\s*w--current/gi, '');
masterFooter = masterFooter.replace(/\s*aria-current="page"/gi, '');

console.log('Successfully extracted master footer template from public/index.html');

// 3. Helper function to process directory
function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`Directory does not exist, skipping: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recurse into subdirectory
            processDirectory(filePath);
        } else if (file.endsWith('.html')) {
            let html = fs.readFileSync(filePath, 'utf-8');
            let modified = false;

            // Step A: Replace the header CTA button
            // Pattern 1: href before class
            const headerCtaRegex1 = /href="[^"]*"\s+class="link-bt menu-bt">Reserve Truck<\/a>/gi;
            if (headerCtaRegex1.test(html)) {
                html = html.replace(headerCtaRegex1, 'href="/login" class="link-bt menu-bt">Sign In or Sign Up</a>');
                modified = true;
            }

            // Pattern 2: class before href
            const headerCtaRegex2 = /class="link-bt menu-bt"\s+href="[^"]*">Reserve Truck<\/a>/gi;
            if (headerCtaRegex2.test(html)) {
                html = html.replace(headerCtaRegex2, 'class="link-bt menu-bt" href="/login">Sign In or Sign Up</a>');
                modified = true;
            }

            // Step B: Replace the footer section
            const isIndexFile = (filePath === indexPath);
            if (!isIndexFile) {
                if (footerRegex.test(html)) {
                    html = html.replace(footerRegex, masterFooter);
                    modified = true;
                } else {
                    console.warn(`Warning: No <footer class="footer"> found in ${filePath}`);
                }
            }

            // Step C: Save changes if modified
            if (modified) {
                fs.writeFileSync(filePath, html, 'utf-8');
                console.log(`Updated layout in: ${filePath}`);
            }
        }
    }
}

// 4. Process both directories
console.log('Processing public directory...');
processDirectory(publicDir);

console.log('Processing Webflow export directory...');
processDirectory(webflowDir);

console.log('Done unifying headers and footers across all HTML pages!');
