import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cssDir = path.join(__dirname, 'src');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if(file.endsWith('.css') || file.endsWith('.jsx')) filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const filesToProcess = walkSync(cssDir);

const colorMap = [
  // Backgrounds
  { regex: /(background(?:-color)?\s*:\s*)#fff\b/gi, replacement: '$1var(--bg-card)' },
  { regex: /(background(?:-color)?\s*:\s*)#f0f7ff\b/gi, replacement: '$1var(--bg-body)' },
  { regex: /(background(?:-color)?\s*:\s*)#f4f6f9\b/gi, replacement: '$1var(--bg-body)' },
  { regex: /(background(?:-color)?\s*:\s*)#f9fafb\b/gi, replacement: '$1var(--bg-content)' },
  
  // Text Colors
  { regex: /(color\s*:\s*)#333\b/gi, replacement: '$1var(--text-primary)' },
  { regex: /(color\s*:\s*)#666\b/gi, replacement: '$1var(--text-secondary)' },
  { regex: /(color\s*:\s*)#222\b/gi, replacement: '$1var(--text-primary)' },
  { regex: /(color\s*:\s*)#1e3a8a\b/gi, replacement: '$1var(--primary-color)' },
  
  // Borders
  { regex: /(border(?:-left|-right|-top|-bottom|-color)?\s*:\s*.*)#e2e8f0\b/gi, replacement: '$1var(--border-color)' },
  { regex: /(border(?:-left|-right|-top|-bottom|-color)?\s*:\s*.*)#e5e7eb\b/gi, replacement: '$1var(--border-color)' },
  { regex: /(border(?:-left|-right|-top|-bottom|-color)?\s*:\s*.*)#cbd5e1\b/gi, replacement: '$1var(--border-color)' },
  { regex: /(border(?:-left|-right|-top|-bottom|-color)?\s*:\s*.*)#d1d5db\b/gi, replacement: '$1var(--border-color)' },
  { regex: /(border(?:-left|-right|-top|-bottom|-color)?\s*:\s*.*)#ccc\b/gi, replacement: '$1var(--border-color)' },
  { regex: /(border(?:-left|-right|-top|-bottom|-color)?\s*:\s*.*)#ddd\b/gi, replacement: '$1var(--border-color)' },

  // Inline React Styles
  { regex: /backgroundColor:\s*['"]#ffffff['"]/gi, replacement: "backgroundColor: 'var(--bg-card)'" },
  { regex: /backgroundColor:\s*['"]#fff['"]/gi, replacement: "backgroundColor: 'var(--bg-card)'" },
  { regex: /color:\s*['"]#333['"]/gi, replacement: "color: 'var(--text-primary)'" },
  { regex: /color:\s*['"]#666['"]/gi, replacement: "color: 'var(--text-secondary)'" },
];

let filesModified = 0;

filesToProcess.forEach(file => {
  if(file.includes('index.css') || file.includes('App.css') || file.includes('DashboardLayout.css') || file.includes('Navbar.css') || file.includes('Sidebar.css')) return;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  colorMap.forEach(mapping => {
    content = content.replace(mapping.regex, mapping.replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesModified++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Total files modified: ${filesModified}`);
