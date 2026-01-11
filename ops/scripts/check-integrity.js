const fs = require('fs');
const path = require('path');

const CRITICAL_FILES = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'ops/manifest.json',
  '.github/workflows/integrity.yml'
];

const REQUIRED_DIRS = [
  'prompts',
  'reports',
  'ops',
  'infra',
  'apps/api',
  'apps/web',
  'apps/mobile',
  'packages/shared'
];

let hasError = false;

function error(msg) {
  console.error(`[FAIL] ${msg}`);
  hasError = true;
}

function info(msg) {
  console.log(`[PASS] ${msg}`);
}

// 1. Check Critical Files Existence and Size
console.log('--- Checking Critical Files ---');
CRITICAL_FILES.forEach(file => {
  if (!fs.existsSync(file)) {
    error(`Missing critical file: ${file}`);
  } else {
    const stats = fs.statSync(file);
    if (stats.size === 0) {
      error(`Critical file is empty: ${file}`);
    } else {
      info(`Exists and non-empty: ${file}`);
    }
  }
});

// 2. Check Required Directories
console.log('\n--- Checking Required Directories ---');
REQUIRED_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    error(`Missing required directory: ${dir}`);
  } else {
    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) {
      error(`Path is not a directory: ${dir}`);
    } else {
      info(`Directory exists: ${dir}`);
    }
  }
});

// 3. Scan for Null Bytes and JSON Validity
console.log('\n--- Scanning for Corruption (Null Bytes & JSON) ---');
function scanDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relPath = path.relative(process.cwd(), fullPath);
    
    if (item === 'node_modules' || item === '.git' || item === 'dist' || item === '.DS_Store') continue;

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      scanDir(fullPath);
    } else if (stats.isFile()) {
      // Check for null bytes
      const buffer = fs.readFileSync(fullPath);
      if (buffer.includes(0)) {
        // Allow images/binary extensions
        const ext = path.extname(fullPath).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf'].includes(ext)) {
           error(`Null byte detected in text file: ${relPath}`);
        }
      }

      // Check JSON validity
      if (path.extname(fullPath) === '.json') {
        try {
          JSON.parse(buffer.toString());
        } catch (e) {
          error(`Malformed JSON in ${relPath}: ${e.message}`);
        }
      }
    }
  }
}

scanDir('.');

if (hasError) {
  console.error('\n*** INTEGRITY CHECK FAILED ***');
  process.exit(1);
} else {
  console.log('\n*** INTEGRITY CHECK PASSED ***');
  process.exit(0);
}
