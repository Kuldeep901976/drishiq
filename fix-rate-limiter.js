const fs = require('fs');
const path = require('path');

// Function to recursively find all .ts files in deployment/api directory
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

// Function to fix rate limiter usage in a file
function fixRateLimiter(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove rate limiter import
    if (content.includes("import { rateLimiter } from '@/lib/rate-limiter';")) {
      content = content.replace("import { rateLimiter } from '@/lib/rate-limiter';\n", '');
      content = content.replace("import { rateLimiter } from '@/lib/rate-limiter';", '');
      modified = true;
    }
    
    // Replace rate limiter usage with comment
    const rateLimitPattern = /\/\/ Rate limiting\s+const rateLimitResult = await rateLimiter\.checkRateLimit\(request\);\s+if \(!rateLimitResult\.success\) \{\s+return NextResponse\.json\(\s+\{ error: 'Too many requests\. Please try again later\.' \},\s+\{ status: 429 \}\s+\);\s+\}/g;
    
    if (rateLimitPattern.test(content)) {
      content = content.replace(rateLimitPattern, '// Rate limiting temporarily disabled for deployment');
      modified = true;
    }
    
    // Also handle single line rate limiter usage
    const singleLinePattern = /const rateLimitResult = await rateLimiter\.checkRateLimit\(request\);/g;
    if (singleLinePattern.test(content)) {
      content = content.replace(singleLinePattern, '// Rate limiting temporarily disabled for deployment');
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

// Main execution
const deploymentApiDir = path.join(__dirname, 'deployment', 'app', 'api');
const tsFiles = findTsFiles(deploymentApiDir);

console.log(`Found ${tsFiles.length} TypeScript files in deployment/api`);

let fixedCount = 0;
for (const file of tsFiles) {
  if (fixRateLimiter(file)) {
    fixedCount++;
  }
}

console.log(`Fixed rate limiter usage in ${fixedCount} files`); 