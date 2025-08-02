#!/bin/bash

# DrishiQ Render Deployment Script

echo "🚀 Starting DrishiQ deployment to Render..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please create a render.yaml file first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Please create it with your environment variables."
    echo "   You can copy from env.example and fill in your values."
fi

# Build the project locally to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the build errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
fi

echo "📋 Deployment checklist:"
echo "1. ✅ Project builds successfully"
echo "2. ✅ render.yaml configuration exists"
echo "3. ⚠️  Please ensure you have:"
echo "   - A GitHub/GitLab repository connected to Render"
echo "   - Environment variables configured in Render dashboard"
echo "   - Proper environment variables in .env.local"

echo ""
echo "🌐 To deploy:"
echo "1. Push your code to GitHub/GitLab"
echo "2. Connect your repository to Render"
echo "3. Render will automatically deploy using render.yaml"
echo ""
echo "🔗 Or visit: https://dashboard.render.com/new/web-service"

echo "✅ Deployment script completed!" 