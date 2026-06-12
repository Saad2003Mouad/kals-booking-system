import fs from 'fs';
import { JSDOM } from 'jsdom';

const args = process.argv.slice(2);
const inputFile = args[0];
const outputFile = args[1];

if (!fs.existsSync(inputFile)) {
    console.error(`File not found: ${inputFile}`);
    process.exit(1);
}

const html = fs.readFileSync(inputFile, 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Remove header/nav
const header = document.querySelector('header');
if (header) header.remove();
const navbar = document.querySelector('.navbar');
if (navbar) navbar.remove();

// Remove footer
const footer = document.querySelector('footer');
if (footer) footer.remove();

// Remove specific hidden webflow elements like generic embedded styles or scripts
Array.from(document.querySelectorAll('script, style, noscript, .w-condition-invisible')).forEach(el => el.remove());

let siteWrapper = document.querySelector('.site-wrapper');
let bodyContent = siteWrapper ? siteWrapper.innerHTML : document.body.innerHTML;

// Reactify attributes
bodyContent = bodyContent.replace(/class="/g, 'className="');
bodyContent = bodyContent.replace(/for="/g, 'htmlFor="');
bodyContent = bodyContent.replace(/tabindex="/g, 'tabIndex="');
bodyContent = bodyContent.replace(/autocomplete="/g, 'autoComplete="');
bodyContent = bodyContent.replace(/ readonly /g, ' readOnly ');
bodyContent = bodyContent.replace(/ readonly>/g, ' readOnly>');
bodyContent = bodyContent.replace(/colspan="/g, 'colSpan="');
bodyContent = bodyContent.replace(/rowspan="/g, 'rowSpan="');
bodyContent = bodyContent.replace(/srcset="/g, 'srcSet="');
bodyContent = bodyContent.replace(/datetime="/g, 'dateTime="');

// Convert inline styles to objects
bodyContent = bodyContent.replace(/style="([^"]+)"/g, (match, styleString) => {
  const styles = styleString.split(';').filter(s => s.trim() !== '');
  const styleObj = {};
  styles.forEach(s => {
    const [key, ...values] = s.split(':');
    if (key && values.length > 0) {
      const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      styleObj[camelKey] = values.join(':').trim();
    }
  });
  return `style={${JSON.stringify(styleObj)}}`;
});

// Fix self-closing tags
bodyContent = bodyContent.replace(/<img([^>]*[^\/])>/gi, "<img$1 />");
bodyContent = bodyContent.replace(/<input([^>]*[^\/])>/gi, "<input$1 />");
bodyContent = bodyContent.replace(/<br>/gi, "<br />");
bodyContent = bodyContent.replace(/<hr>/gi, "<hr />");
// remove duplicate slashes if they occur
bodyContent = bodyContent.replace(/ \/> \/>/gi, " />");

// Fix inline svgs with unclosed tags
bodyContent = bodyContent.replace(/<path([^>]*[^\/])>/gi, "<path$1 />");
bodyContent = bodyContent.replace(/<polyline([^>]*[^\/])>/gi, "<polyline$1 />");
bodyContent = bodyContent.replace(/<polygon([^>]*[^\/])>/gi, "<polygon$1 />");
bodyContent = bodyContent.replace(/<circle([^>]*[^\/])>/gi, "<circle$1 />");
bodyContent = bodyContent.replace(/<rect([^>]*[^\/])>/gi, "<rect$1 />");

// HTML Comments to JSX Comments
bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

let componentName = outputFile.split('/').pop().replace('.tsx', '').replace(/[^a-zA-Z0-9]/g, '');
if (componentName === 'page') componentName = 'Page';

const tsxContent = `import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MotionWrapper from "@/components/MotionWrapper";

export default function ${componentName}() {
  return (
    <>
      <SiteHeader />
      <div className="site-wrapper">
        ${bodyContent}
      </div>
      <SiteFooter />
    </>
  );
}
`;

fs.writeFileSync(outputFile, tsxContent);
console.log(`Successfully converted ${inputFile} to ${outputFile}`);
