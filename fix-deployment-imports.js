const fs = require('fs');
const path = require('path');

function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.next')) {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixImportPaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix import paths with too many dots
    const importPattern = /import\s+{\s*supabase\s*}\s+from\s+['"]([^'"]*\.\.\.[^'"]*\.\.\.[^'"]*\.\.\.[^'"]*\.\.\.[^'"]*\.\.\.[^'"]*lib\/supabase[^'"]*)['"]/g;
    if (importPattern.test(content)) {
      content = content.replace(importPattern, (match, importPath) => {
        // Count the number of ../ in the path
        const dotCount = (importPath.match(/\.\.\//g) || []).length;
        // Calculate the correct number of ../ needed
        const fileDepth = filePath.split(path.sep).length - 1;
        const targetDepth = 2; // lib folder is at depth 2 from root
        const neededDots = fileDepth - targetDepth;
        
        if (neededDots > 0) {
          return `import { supabase } from '${'../'.repeat(neededDots)}lib/supabase'`;
        } else {
          return `import { supabase } from '${'./'.repeat(-neededDots)}lib/supabase'`;
        }
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

const deploymentDir = path.join(__dirname, 'deployment');
const tsFiles = findTsFiles(deploymentDir);
console.log(`Found ${tsFiles.length} TypeScript files in deployment`);

let fixedCount = 0;
for (const file of tsFiles) {
  if (fixImportPaths(file)) {
    fixedCount++;
  }
}

console.log(`Fixed import paths in ${fixedCount} files`); 