const fs = require('fs');
const path = require('path');

// Function to recursively find all .ts and .tsx files
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.next')) {
      files.push(...findTsFiles(fullPath));
    } else if ((item.endsWith('.ts') || item.endsWith('.tsx')) && !item.includes('supabase.types')) {
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
    
    // Skip if it's already using the centralized supabase client
    if (content.includes('import { supabase } from')) {
      return false;
    }
    
    // Pattern 1: Replace createClient with direct env vars
    const createClientPattern = /const supabase = createClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY!\s*\);/g;
    if (createClientPattern.test(content)) {
      content = content.replace(createClientPattern, '');
      modified = true;
    }
    
    // Pattern 2: Replace createClient import
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
    
    // Pattern 4: Replace direct env var usage with ! operator
    const envVarPattern = /process\.env\.NEXT_PUBLIC_SUPABASE_URL!/g;
    if (envVarPattern.test(content)) {
      content = content.replace(envVarPattern, 'process.env.NEXT_PUBLIC_SUPABASE_URL || \'https://placeholder.supabase.co\'');
      modified = true;
    }
    
    // Add import if we made changes and it doesn't already exist
    if (modified && !content.includes('import { supabase } from')) {
      // Calculate relative path to lib/supabase
      const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'lib'));
      const importPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
      const importStatement = `import { supabase } from '${importPath}/supabase';\n`;
      
      // Find the last import statement
      const importMatch = content.match(/(import.*?;[\r\n]*)+/);
      if (importMatch) {
        const lastImport = importMatch[0];
        const newContent = content.replace(lastImport, lastImport + importStatement);
        content = newContent;
      } else {
        // If no imports, add at the top
        content = importStatement + content;
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
const rootDir = __dirname;
const tsFiles = findTsFiles(rootDir);

console.log(`Found ${tsFiles.length} TypeScript files`);

let fixedCount = 0;
for (const file of tsFiles) {
  if (fixSupabaseUrls(file)) {
    fixedCount++;
  }
}

console.log(`Fixed Supabase URL usage in ${fixedCount} files`); 