const { execSync } = require('child_process');

function checkPeerConflicts() {
  console.log('🔍 Checking for peer dependency conflicts...');
  try {
    const output = execSync('npm ls --all --json', { encoding: 'utf8' });
    const tree = JSON.parse(output);
    const peerConflicts = [];

    function walkDeps(deps, parent = '') {
      if (!deps) return;
      for (const [name, dep] of Object.entries(deps)) {
        if (dep.peerMissing) {
          peerConflicts.push({
            package: parent,
            missing: name,
            required: dep.required || 'unknown',
          });
        }
        walkDeps(dep.dependencies, name);
      }
    }

    walkDeps(tree.dependencies);

    if (peerConflicts.length === 0) {
      console.log('✅ No peer dependency conflicts found.');
    } else {
      console.log('❌ Peer dependency conflicts found:');
      peerConflicts.forEach(conflict => {
        console.log(`- ${conflict.package} is missing peer: ${conflict.missing} (required: ${conflict.required})`);
      });
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Error checking peer dependencies:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  checkPeerConflicts();
} 