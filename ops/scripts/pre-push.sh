#!/bin/sh
#
# Pre-push hook to run integrity and gates
#

echo "Running pre-push checks..."

# 1. Integrity
echo "Checking integrity..."
npm run integrity
if [ $? -ne 0 ]; then
  echo "Integrity check failed. Push aborted."
  exit 1
fi

# 2. Lint (optional, can be slow)
echo "Running lint..."
pnpm lint
if [ $? -ne 0 ]; then
  echo "Lint failed. Push aborted."
  exit 1
fi

# 3. Test (optional, can be slow)
# echo "Running tests..."
# pnpm test
# if [ $? -ne 0 ]; then
#   echo "Tests failed. Push aborted."
#   exit 1
# fi

echo "All checks passed. Pushing..."
exit 0
