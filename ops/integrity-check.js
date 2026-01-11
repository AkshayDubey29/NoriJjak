const fs = require('fs');
const path = require('path');

const CRITICAL_FILES = [
  'package.json',
  'pnpm-workspace.yaml',
  'apps/api/package.json',
  'apps/web/package.json',
  'apps/mobile/package.json',
  'packages/shared/package.json',
  'apps/api/prisma/schema.prisma',
  'infra/docker-compose.yml',
  'ops/manifest.json'
];

const REQUIRED_FOLDERS = [
  'apps/api/src',
  'apps/web/src',
  'apps/mobile/src',
  'packages/shared/src'
];

function checkIntegrity() {
  let errors = [];

  // 1. Check critical files
  CRITICAL_FILES.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing critical file: ${file}`);
      return;
    }

    const stats = fs.statSync(fullPath);
    if (stats.size === 0) {
      errors.push(`Critical file is empty: ${file}`);
    }

    const content = fs.readFileSync(fullPath);
    if (content.includes('\0')) {
      errors.push(`Critical file contains null bytes: ${file}`);
    }

    if (file.endsWith('.json')) {
      try {
        JSON.parse(content.toString());
      } catch (e) {
        errors.push(`Malformed JSON in ${file}: ${e.message}`);
      }
    }
  });

  // 2. Check required folders
  REQUIRED_FOLDERS.forEach(folder => {
    const fullPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      errors.push(`Missing required folder: ${folder}`);
    }
  });

  // 3. Scan all source files for null bytes (Recursive)
  const scanSource = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.next' && file !== 'dist') {
          scanSource(fullPath);
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.md')) {
        const stats = fs.statSync(fullPath);
        if (stats.size === 0) {
          errors.push(`Empty source file detected: ${path.relative(process.cwd(), fullPath)}`);
        }
        const content = fs.readFileSync(fullPath);
        if (content.includes('\0')) {
          errors.push(`Null bytes detected in source file: ${path.relative(process.cwd(), fullPath)}`);
        }
      }
    });
  };

  ['apps', 'packages', 'ops'].forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) scanSource(fullPath);
  });

  if (errors.length > 0) {
    console.error('INTEGRITY CHECK FAILED:');
    errors.forEach(err => console.error(`- ${err}`));
    process.exit(1);
  } else {
    console.log('Integrity check passed.');
  }
}

checkIntegrity();

