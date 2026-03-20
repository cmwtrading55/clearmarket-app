#!/usr/bin/env bash
# ClearMarket — dev environment bootstrap
# Run this at the start of every agent session
set -e

cd "$(dirname "$0")"

echo "=== ClearMarket init ==="

# 1. Install dependencies (fast if cached)
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies cached."
fi

# 2. Check env
if [ ! -f .env.local ]; then
  echo "WARNING: .env.local missing. Copy from .env.example or create with:"
  echo "  NEXT_PUBLIC_SUPABASE_URL=..."
  echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
  echo "  NEXT_PUBLIC_HELIUS_API_KEY=..."
  exit 1
fi

# 3. Build check (catches TypeScript errors before dev server)
echo "Running build check..."
npm run build 2>&1 | tail -5
BUILD_EXIT=$?
if [ $BUILD_EXIT -ne 0 ]; then
  echo "BUILD FAILED — fix errors before continuing."
  exit 1
fi
echo "Build OK."

# 4. Start dev server in background (if not already running)
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "Starting dev server..."
  npm run dev &
  DEV_PID=$!
  echo "Dev server PID: $DEV_PID"
  # Wait for it to be ready
  for i in $(seq 1 30); do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
      echo "Dev server ready at http://localhost:3000"
      break
    fi
    sleep 1
  done
else
  echo "Dev server already running at http://localhost:3000"
fi

echo "=== Ready ==="
echo "Features passing: $(grep -c '"passes": true' feature_list.json)/$(grep -c '"id"' feature_list.json)"
