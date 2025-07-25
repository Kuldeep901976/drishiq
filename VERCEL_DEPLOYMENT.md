# 🚀 Vercel Deployment Guide for DrishiQ

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **GitHub Repository**: Your project should be on GitHub
4. **Environment Variables**: Supabase and Firebase credentials

## 🔧 Step 1: Environment Setup

### Required Environment Variables

You'll need these environment variables for your Vercel project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### How to Get These Values

1. **Supabase**:
   - Go to your Supabase project dashboard
   - Settings → API → Project URL and anon/public key
   - Settings → API → service_role key (for server operations)

2. **Firebase**:
   - Go to your Firebase project console
   - Project settings → General → Your apps → Web app
   - Copy the config values

## 🌐 Step 2: Create Vercel Project

1. **Go to Vercel Dashboard**: [vercel.com/new](https://vercel.com/new)
2. **Import from GitHub**: Select your `Kuldeep901976/drishiq` repository
3. **Configure Project**:
   - **Project Name**: `drishiq-production`
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `drishiq` (important!)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

## ⚙️ Step 3: Set Environment Variables

### Option A: Using Vercel Dashboard
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add each variable with environment set to "Production"

### Option B: Using Vercel CLI
```bash
# Run the setup script
npm run setup:vercel-env

# Or manually add each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# ... repeat for all variables
```

## 🚀 Step 4: Deploy

### First Deployment
```bash
# Deploy to production
vercel --prod

# Or use the deployment script
npm run deploy:prod
```

### Preview Deployments
```bash
# Deploy to preview
vercel

# Or use the script
npm run deploy:preview
```

## 🔍 Step 5: Verify Deployment

### Check Build Logs
1. Go to your Vercel project dashboard
2. Check the latest deployment
3. Verify no build errors

### Test Functionality
1. **Authentication**: Test sign up/sign in
2. **Phone Verification**: Test Firebase phone auth
3. **Multi-language**: Test language switching
4. **Responsive Design**: Test on mobile/desktop

## 🌍 Step 6: Custom Domain (Optional)

1. **Add Domain**: Go to project settings → Domains
2. **Configure DNS**: Follow Vercel's DNS instructions
3. **SSL Certificate**: Automatically provisioned by Vercel

## 🔧 Step 7: Environment-Specific Deployments

### Production Environment
- **Branch**: `main`
- **Domain**: Your custom domain or `drishiq-production.vercel.app`
- **Environment**: Production

### Staging Environment
- **Branch**: `staging` or `develop`
- **Domain**: `drishiq-staging.vercel.app`
- **Environment**: Preview

## 📱 Step 8: Mobile App Deployment

After web deployment is successful:

1. **Build Mobile App**:
   ```bash
   npm run mobile:build
   ```

2. **Android Deployment**:
   ```bash
   npm run mobile:android
   # Follow Android Studio deployment process
   ```

3. **iOS Deployment**:
   ```bash
   npm run mobile:ios
   # Follow Xcode deployment process
   ```

## 🔍 Troubleshooting

### Common Issues

1. **"No Next.js version detected"**
   - Ensure root directory is set to `drishiq`
   - Check `package.json` has Next.js dependency

2. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Verify environment variables are set
   - Check for missing dependencies

3. **Environment Variables Not Working**
   - Ensure variables are set for correct environment
   - Check variable names match code exactly
   - Redeploy after adding variables

4. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check Firebase configuration
   - Test in development first

### Debug Commands

```bash
# Check deployment readiness
npm run deploy:check

# Test build locally
npm run build

# Check TypeScript
npm run type-check

# Verify Supabase connection
npm run check-supabase
```

## 📊 Monitoring

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Monitor performance and errors
3. Set up alerts for build failures

### External Monitoring
- **Supabase**: Monitor database usage and auth
- **Firebase**: Monitor phone verification usage
- **Custom**: Set up error tracking (Sentry, etc.)

## 🔄 Continuous Deployment

### Automatic Deployments
- **Production**: Deploys on `main` branch push
- **Preview**: Deploys on pull requests
- **Manual**: Use Vercel CLI for manual deployments

### Deployment Hooks
- Set up webhooks for external services
- Configure post-deployment scripts
- Set up notifications for deployment status

## 📝 Post-Deployment Checklist

- [ ] All authentication flows work
- [ ] Phone verification functions
- [ ] Multi-language support works
- [ ] Responsive design on all devices
- [ ] Performance is acceptable
- [ ] SSL certificate is active
- [ ] Custom domain is configured
- [ ] Analytics are tracking
- [ ] Error monitoring is set up
- [ ] Backup strategy is in place

## 🆘 Support

If you encounter issues:

1. **Check Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Review Build Logs**: Detailed error information
3. **Test Locally**: Reproduce issues in development
4. **Check Environment Variables**: Verify all are set correctly

---

**🎉 Congratulations!** Your DrishiQ app is now deployed and ready for users. 