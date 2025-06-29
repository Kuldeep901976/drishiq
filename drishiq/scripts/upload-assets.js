const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

// Asset categories mapping
const assetCategories = {
  'images': 'images',
  'logo': 'logos', 
  'other-Icons': 'icons',
  'social-icons': 'social-icons'
};

async function uploadAsset(filePath, category, filename) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const { url } = await put(`${category}/${filename}`, fileBuffer, {
      access: 'public',
    });
    console.log(`✅ Uploaded: ${category}/${filename} -> ${url}`);
    return url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function uploadAllAssets() {
  const assetsPath = 'C:\\Users\\Admin\\Desktop\\drishiq-assets';
  const results = {
    success: [],
    failed: []
  };

  console.log('🚀 Starting asset upload to Vercel Blob...\n');

  // Process each category folder
  for (const [folderName, category] of Object.entries(assetCategories)) {
    const folderPath = path.join(assetsPath, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Folder not found: ${folderPath}`);
      continue;
    }

    console.log(`📁 Processing ${folderName}...`);
    
    const files = fs.readdirSync(folderPath);
    
    for (const file of files) {
      if (file.startsWith('.')) continue; // Skip hidden files
      
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const url = await uploadAsset(filePath, category, file);
        if (url) {
          results.success.push({
            category,
            filename: file,
            url,
            size: stats.size
          });
        } else {
          results.failed.push({
            category,
            filename: file,
            size: stats.size
          });
        }
      }
    }
  }

  // Generate results summary
  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successful: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.success.length > 0) {
    console.log('\n📋 Successfully uploaded assets:');
    results.success.forEach(item => {
      console.log(`  ${item.category}/${item.filename} (${(item.size / 1024).toFixed(1)}KB)`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed uploads:');
    results.failed.forEach(item => {
      console.log(`  ${item.category}/${item.filename}`);
    });
  }

  // Generate asset mapping file
  if (results.success.length > 0) {
    const assetMap = {};
    results.success.forEach(item => {
      if (!assetMap[item.category]) {
        assetMap[item.category] = {};
      }
      assetMap[item.category][item.filename] = item.url;
    });

    fs.writeFileSync(
      'asset-urls.json', 
      JSON.stringify(assetMap, null, 2)
    );
    console.log('\n💾 Asset URLs saved to: asset-urls.json');
  }

  return results;
}

// Run the upload
uploadAllAssets().catch(console.error); 