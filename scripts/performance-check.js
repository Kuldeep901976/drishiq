const puppeteer = require('puppeteer');

async function checkPerformance() {
  console.log('🔍 Checking landing page performance...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Enable performance monitoring
  await page.setCacheEnabled(false);
  
  // Listen for performance metrics
  const metrics = {};
  
  page.on('metrics', data => {
    metrics.timestamp = data.metrics.Timestamp;
    metrics.documents = data.metrics.Documents;
    metrics.frames = data.metrics.Frames;
    metrics.jSEventListeners = data.metrics.JSEventListeners;
    metrics.nodes = data.metrics.Nodes;
    metrics.layoutCount = data.metrics.LayoutCount;
    metrics.recalcStyleCount = data.metrics.RecalcStyleCount;
    metrics.layoutDuration = data.metrics.LayoutDuration;
    metrics.recalcStyleDuration = data.metrics.RecalcStyleDuration;
    metrics.scriptDuration = data.metrics.ScriptDuration;
    metrics.taskDuration = data.metrics.TaskDuration;
    metrics.jsHeapUsedSize = data.metrics.JSHeapUsedSize;
    metrics.jsHeapTotalSize = data.metrics.JSHeapTotalSize;
  });

  // Navigate to the landing page
  const startTime = Date.now();
  await page.goto('http://localhost:3000', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  const loadTime = Date.now() - startTime;

  // Get performance timing
  const performanceTiming = await page.evaluate(() => {
    const timing = performance.timing;
    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
    };
  });

  // Get Core Web Vitals
  const webVitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      let lcp = 0;
      let fid = 0;
      let cls = 0;
      
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        lcp = entries[entries.length - 1].startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        fid = entries[0].processingStart - entries[0].startTime;
      }).observe({ entryTypes: ['first-input'] });
      
      // CLS
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          cls += entry.value;
        }
      }).observe({ entryTypes: ['layout-shift'] });
      
      setTimeout(() => resolve({ lcp, fid, cls }), 3000);
    });
  });

  await browser.close();

  // Display results
  console.log('\n📊 Performance Metrics:');
  console.log('========================');
  console.log(`⏱️  Total Load Time: ${loadTime}ms`);
  console.log(`📄 DOM Content Loaded: ${performanceTiming.domContentLoaded}ms`);
  console.log(`🔄 Page Load Complete: ${performanceTiming.loadComplete}ms`);
  console.log(`🎨 First Paint: ${performanceTiming.firstPaint}ms`);
  console.log(`🎯 First Contentful Paint: ${performanceTiming.firstContentfulPaint}ms`);
  
  console.log('\n🚀 Core Web Vitals:');
  console.log('==================');
  console.log(`📏 Largest Contentful Paint: ${webVitals.lcp}ms`);
  console.log(`⚡ First Input Delay: ${webVitals.fid}ms`);
  console.log(`📐 Cumulative Layout Shift: ${webVitals.cls}`);
  
  console.log('\n🔧 Technical Metrics:');
  console.log('====================');
  console.log(`📝 Documents: ${metrics.documents || 'N/A'}`);
  console.log(`🖼️  Frames: ${metrics.frames || 'N/A'}`);
  console.log(`🎯 Event Listeners: ${metrics.jSEventListeners || 'N/A'}`);
  console.log(`🌳 DOM Nodes: ${metrics.nodes || 'N/A'}`);
  console.log(`📐 Layout Count: ${metrics.layoutCount || 'N/A'}`);
  console.log(`🎨 Style Recalculations: ${metrics.recalcStyleCount || 'N/A'}`);
  console.log(`💾 JS Heap Used: ${Math.round((metrics.jsHeapUsedSize || 0) / 1024 / 1024)}MB`);
  console.log(`💾 JS Heap Total: ${Math.round((metrics.jsHeapTotalSize || 0) / 1024 / 1024)}MB`);

  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('===============================');
  
  if (loadTime > 3000) {
    console.log('⚠️  Load time is slow (>3s). Consider:');
    console.log('   - Optimizing images with WebP format');
    console.log('   - Implementing code splitting');
    console.log('   - Reducing bundle size');
  }
  
  if (webVitals.lcp > 2500) {
    console.log('⚠️  LCP is slow (>2.5s). Consider:');
    console.log('   - Optimizing hero images');
    console.log('   - Using priority loading for above-fold images');
    console.log('   - Implementing resource hints');
  }
  
  if (webVitals.cls > 0.1) {
    console.log('⚠️  CLS is high (>0.1). Consider:');
    console.log('   - Setting explicit image dimensions');
    console.log('   - Avoiding layout shifts during load');
    console.log('   - Using skeleton loaders');
  }
  
  if ((metrics.jsHeapUsedSize || 0) > 50 * 1024 * 1024) {
    console.log('⚠️  High memory usage (>50MB). Consider:');
    console.log('   - Reducing JavaScript bundle size');
    console.log('   - Implementing lazy loading');
    console.log('   - Optimizing component rendering');
  }

  console.log('\n✅ Performance check complete!');
}

// Run the check
checkPerformance().catch(console.error); 