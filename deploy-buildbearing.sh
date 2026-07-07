#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

MODE="${1:-preview}"

if [[ "$MODE" != "preview" && "$MODE" != "prod" && "$MODE" != "check" ]]; then
  echo "Usage: ./deploy-buildbearing.sh [check|preview|prod]"
  exit 1
fi

echo "BuildBearing Command Centre"
echo "Mode: $MODE"
echo

if [[ "$MODE" == "prod" ]]; then
  if [[ -z "${CENTRE_PASSWORD:-}" ]]; then
    echo "Missing CENTRE_PASSWORD."
    echo "Set it in Vercel project environment variables before production deploy."
    exit 1
  fi

  if [[ -z "${CENTRE_SESSION_SECRET:-}" ]]; then
    echo "Missing CENTRE_SESSION_SECRET."
    echo "Set it in Vercel project environment variables before production deploy."
    exit 1
  fi
fi

echo "Running local checks..."
npm run check
node -e 'const fs=require("fs"); const traffic=fs.existsSync("data/traffic-summary.json")?"data/traffic-summary.json":"data/traffic-summary.example.json"; const search=fs.existsSync("data/search-summary.json")?"data/search-summary.json":"data/search-summary.example.json"; JSON.parse(fs.readFileSync("vercel.json","utf8")); JSON.parse(fs.readFileSync("public/connection-registry.json","utf8")); JSON.parse(fs.readFileSync("public/live-uptime-status.json","utf8")); JSON.parse(fs.readFileSync(traffic,"utf8")); JSON.parse(fs.readFileSync(search,"utf8")); console.log("JSON ok");'

if [[ -f ".vercel/project.json" ]]; then
  echo
  echo "Linked Vercel project detected."
  echo "If deploy fails with: No Next.js version detected"
  echo "change the Vercel project Framework Preset from Next.js to Other."
  echo "Vercel Dashboard -> Project -> Settings -> Build & Development Settings."
fi

if [[ "$MODE" == "check" ]]; then
  echo
  echo "Checks passed."
  exit 0
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo
  echo "Vercel CLI is not installed."
  echo "Install it with:"
  echo "  npm i -g vercel"
  echo
  echo "Then run:"
  echo "  ./deploy-buildbearing.sh preview"
  echo "  ./deploy-buildbearing.sh prod"
  exit 1
fi

echo
if [[ "$MODE" == "preview" ]]; then
  echo "Deploying preview..."
  vercel deploy
else
  echo "Deploying production..."
  vercel deploy --prod
fi
