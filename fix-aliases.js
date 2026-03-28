const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  content = content.replace(/from\s+['"]@\/(.*?)['"]/g, (match, importPath) => {
    changed = true;
    const targetPath = path.join(rootDir, importPath);
    const fileDir = path.dirname(filePath);
    let relPath = path.relative(fileDir, targetPath);
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    relPath = relPath.replace(/\\/g, '/');
    // keep original quotes if possible, use standard double quotes as fallback
    let matchQuote = match.includes("'") ? "'" : '"';
    return `from ${matchQuote}${relPath}${matchQuote}`;
  });

  content = content.replace(/import\s*\(['"]@\/(.*?)['"]\)/g, (match, importPath) => {
    changed = true;
    const targetPath = path.join(rootDir, importPath);
    const fileDir = path.dirname(filePath);
    let relPath = path.relative(fileDir, targetPath);
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    relPath = relPath.replace(/\\/g, '/');
    let matchQuote = match.includes("'") ? "'" : '"';
    return `import(${matchQuote}${relPath}${matchQuote})`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed aliases in ${filePath.replace(rootDir, '')}`);
  }
}

function traverse(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) traverse(full);
    else if (full.endsWith('.ts')) fixFile(full);
  });
}

traverse(srcDir);
