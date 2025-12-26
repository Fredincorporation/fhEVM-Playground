#!/bin/bash

# Setup script for fhEVM Playground Pro
# Makes npx prompts automatic and improves overall npm experience

echo "🔧 Setting up fhEVM Playground Pro for optimal experience..."

# Configure npm to auto-confirm npx downloads
npm config set yes true
echo "✅ Configured npm to auto-answer prompts"

# Optional: Disable audit warnings for cleaner output
npm config set audit false
echo "✅ Disabled audit warnings for cleaner output"

# Optional: Disable fund messages
npm config set fund false
echo "✅ Disabled fund messages"

echo ""
echo "🎉 Setup complete! You can now run:"
echo ""
echo "  npx create-fhevm-playground-pro guided"
echo ""
echo "without any prompts appearing."
echo ""
