// generate_badges.js
// Node version >= 12 recommended

const fs = require('fs');
const path = require('path');

const username = "mayankkmauryaa";
const label = "Mayank+Maurya";

const colors = [
    "brightgreen", "green", "yellow", "yellowgreen", "orange", "red", "blue",
    "grey", "lightgrey", "blueviolet", "dc143c", "ff69b4"
];

const styles = ["flat", "flat-square", "plastic", "for-the-badge", "pixel"];

// ---- Helper generators ----
function badgeUrl(params) {
    return `https://komarev.com/ghpvc/?username=${username}&${params}&label=${label}`;
}

function mkCardHtml(title, url) {
    return `<div class="card"><div class="label">${title}</div><div class="badge"><img alt="${title}" src="${url}" /></div></div>`;
}

// ---- Build HTML fragments ----
const colorsHtml = colors.map(c => mkCardHtml(c, badgeUrl(`color=${c}`))).join('\n');
const stylesHtml = styles.map(s => mkCardHtml(s, badgeUrl(`style=${s}&color=blueviolet`))).join('\n');

const baseHtml = styles.map(s => mkCardHtml(`base=1000 • ${s}`, badgeUrl(`base=1000&style=${s}&color=blueviolet`))).join('\n');
const abbrevHtml = styles.map(s => mkCardHtml(`abbreviated=true • ${s}`, badgeUrl(`abbreviated=true&style=${s}&color=blueviolet`))).join('\n');

// ---- Read the base HTML template and replace placeholders ----
const htmlPath = path.join(__dirname, 'badges.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the HTML comment placeholders with generated content
html = html.replace('<!-- Colors -->', colorsHtml);
html = html.replace('<!-- Styles -->', stylesHtml);
html = html.replace('<!-- Base -->', baseHtml);
html = html.replace('<!-- Abbrev -->', abbrevHtml);

// Write out the new badges.html
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Wrote badges.html with badge grid.');

// ---- Ensure styles.css exists (skip write if already present) ----
const cssPath = path.join(__dirname, 'styles.css');
if (!fs.existsSync(cssPath)) {
    const css = `/* generated styles.css (minimal) */\n` + fs.readFileSync(path.join(__dirname, 'styles.css.template') || cssPath, 'utf8');
    // If styles.css.template doesn't exist, the repo already contains styles.css from earlier instructions.
    try {
        fs.writeFileSync(cssPath, css, 'utf8');
        console.log('Wrote styles.css');
    } catch (e) {
        console.log('styles.css write skipped or template missing.');
    }
} else {
    console.log('styles.css exists — left unchanged.');
}

// ---- Generate Markdown tables for README injection ----
function mdTable(title, rows) {
    return `### ${title}\n\n| Option | Badge |\n|---:|:---|\n${rows.map(r => `| ${r.label} | ![](${r.url}) |`).join('\n')}\n\n`;
}

const colorsRows = colors.map(c => ({ label: c, url: badgeUrl(`color=${c}`) }));
const stylesRows = styles.map(s => ({ label: s, url: badgeUrl(`style=${s}&color=blueviolet`) }));
const baseRows = [{ label: 'default', url: badgeUrl(`base=1000`) }].concat(styles.map(s => ({ label: `${s}`, url: badgeUrl(`base=1000&style=${s}&color=blueviolet`) })));
const abbrevRows = [{ label: 'default', url: badgeUrl(`abbreviated=true`) }].concat(styles.map(s => ({ label: `${s}`, url: badgeUrl(`abbreviated=true&style=${s}&color=blueviolet`) })));

const mdContent = `<!-- BADGES-START -->
## GitHub Profile Counter Badges

${mdTable('Colors (&color=...)', colorsRows)}
${mdTable('Styles (&style=...)', stylesRows)}
${mdTable('Base=1000 (&base=1000)', baseRows)}
${mdTable('Abbreviated (&abbreviated=true)', abbrevRows)}
<!-- BADGES-END -->`;

// Inject into README.md between markers
const readmePath = path.join(__dirname, 'README.md');
let readme = '';
if (fs.existsSync(readmePath)) readme = fs.readFileSync(readmePath, 'utf8');
else readme = `# README\n\n<!-- BADGES-START -->\n\n<!-- BADGES-END -->\n`;

if (readme.includes('<!-- BADGES-START -->')) {
    const newReadme = readme.replace(/<!-- BADGES-START -->([\s\S]*?)<!-- BADGES-END -->/m, mdContent);
    fs.writeFileSync(readmePath, newReadme, 'utf8');
    console.log('Injected badges into README.md between markers.');
} else {
    // If markers missing, append at end
    const combined = readme + '\n\n' + mdContent;
    fs.writeFileSync(readmePath, combined, 'utf8');
    console.log('Appended badges block to README.md (markers missing).');
}

console.log('Done.');














// just run node generate_badges.js