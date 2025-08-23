#!/bin/bash
set -e

echo "🔧 Starting Vercel build process..."

# Generate Prisma Client
echo "📚 Generating Prisma Client..."
npx prisma generate

# Build Next.js app
echo "🏗️ Building Next.js application..."
npx next build

echo "✅ Build completed successfully!"
