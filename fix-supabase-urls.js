const fs = require('fs');
const path = require('path');

// Function to recursively find all .ts files in app/api directory
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix Supabase URL usage in a file
function fixSupabaseUrls(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern 1: Replace createClient with direct env vars
    const createClientPattern = /const supabase = createClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\);/g;
    if (createClientPattern.test(content)) {
      content = content.replace(createClientPattern, 'import { supabase } from \'../../../../lib/supabase\';');
      modified = true;
    }
    
    // Pattern 2: Replace createClient import and usage
    if (content.includes('import { createClient } from \'@supabase/supabase-js\';')) {
      content = content.replace('import { createClient } from \'@supabase/supabase-js\';', '');
      modified = true;
    }
    
    // Pattern 3: Replace direct env var usage in createClient calls
    const directEnvPattern = /createClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\)/g;
    if (directEnvPattern.test(content)) {
      content = content.replace(directEnvPattern, 'supabase');
      modified = true;
    }
    
    // Add import if we made changes and it doesn't already exist
    if (modified && !content.includes('import { supabase } from')) {
      // Find the last import statement
      const importMatch = content.match(/(import.*?;[\r\n]*)+/);
      if (importMatch) {
        const importStatement = importMatch[0];
        const newImport = importStatement + 'import { supabase } from \'../../../../lib/supabase\';\n';
        content = content.replace(importStatement, newImport);
      }
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

// Main execution
const apiDir = path.join(__dirname, 'app', 'api');
const tsFiles = findTsFiles(apiDir);

console.log(`Found ${tsFiles.length} TypeScript files in app/api`);

let fixedCount = 0;
for (const file of tsFiles) {
  if (fixSupabaseUrls(file)) {
    fixedCount++;
  }
}

console.log(`Fixed Supabase URL usage in ${fixedCount} files`); 