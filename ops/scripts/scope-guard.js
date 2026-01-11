const { execSync } = require('child_process');
const path = require('path');

// Usage: node scope-guard.js <allowed_modules_comma_separated>
// Example: node scope-guard.js apps/mobile,packages/shared

const allowedModules = process.argv[2] ? process.argv[2].split(',') : [];

if (allowedModules.length === 0) {
  console.log('No scope restriction provided. Skipping scope check.');
  process.exit(0);
}

console.log(`Checking scope compliance against allowed modules: ${allowedModules.join(', ')}`);

try {
  // Get list of changed files compared to main
  const changedFiles = execSync('git diff --name-only main')
    .toString()
    .trim()
    .split('\n')
    .filter(f => f.length > 0);

  if (changedFiles.length === 0) {
    console.log('No changes detected against main.');
    process.exit(0);
  }

  const violations = [];

  changedFiles.forEach(file => {
    // Always allowed: ops/, reports/, package.json (root), pnpm-lock.yaml, prompts/
    if (file.startsWith('ops/') || 
        file.startsWith('reports/') || 
        file.startsWith('prompts/') ||
        file === 'package.json' || 
        file === 'pnpm-lock.yaml' ||
        file === 'pnpm-workspace.yaml' ||
        file === '.cursorrules' ||
        file === '.gitignore') {
      return;
    }

    const isAllowed = allowedModules.some(module => file.startsWith(module));
    if (!isAllowed) {
      violations.push(file);
    }
  });

  if (violations.length > 0) {
    console.error('\nSCOPE VIOLATION DETECTED:');
    console.error('The following files are outside the allowed modules for this step:');
    violations.forEach(v => console.error(` - ${v}`));
    console.error('\nPlease revert these changes or update the allowed scope.');
    process.exit(1);
  } else {
    console.log('Scope check passed.');
    process.exit(0);
  }
} catch (error) {
  console.error('Failed to run scope check:', error.message);
  process.exit(1);
}
