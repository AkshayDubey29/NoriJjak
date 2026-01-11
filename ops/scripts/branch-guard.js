const { execSync } = require('child_process');

// Usage: node branch-guard.js <required_branch>
// Example: node branch-guard.js main

const requiredBranch = process.argv[2] || 'main';

try {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();

  console.log(`Checking branch rule: Current branch is '${currentBranch}', required is '${requiredBranch}'`);

  if (currentBranch !== requiredBranch) {
    console.error(`\nBRANCH RULE VIOLATION:`);
    console.error(`Current branch '${currentBranch}' must be '${requiredBranch}' before completion.`);
    console.error(`Please merge your changes into '${requiredBranch}' and push.`);
    process.exit(1);
  } else {
    console.log('Branch rule check passed.');
    process.exit(0);
  }
} catch (error) {
  console.error('Failed to run branch check:', error.message);
  process.exit(1);
}
