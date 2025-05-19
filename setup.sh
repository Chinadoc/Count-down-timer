#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Countdown Timer App monorepo..."

# Install root dependencies
echo "📦 Installing root dependencies..."
yarn install

# Create symlinks for local packages
echo "🔗 Creating symlinks for local packages..."
yarn

# Add placeholder favicon for web
echo "🖼️ Adding placeholder favicon for web..."
touch ./apps/web/public/favicon.ico

# Add placeholder assets for mobile
echo "🖼️ Adding placeholder assets for mobile..."
touch ./apps/mobile/assets/icon.png
touch ./apps/mobile/assets/splash.png
touch ./apps/mobile/assets/adaptive-icon.png

echo "✅ Setup complete! You can now run:"
echo "   - yarn web     # Start Next.js web app"
echo "   - yarn mobile  # Start Expo mobile app"
echo "   - yarn ios     # Start iOS app in simulator"

echo ""
echo "📘 Check out the README.md for more details."
