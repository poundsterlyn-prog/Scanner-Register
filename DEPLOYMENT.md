# Scanner Register - Render Deployment Guide

This guide will help you deploy Scanner Register to Render.com completely independently of Replit.

## Prerequisites

- A [GitHub](https://github.com) account
- A [Render](https://render.com) account (free tier works fine)
- Git installed on your computer (optional, but recommended)

## Step 1: Push Your Code to GitHub

### Option A: Using Git Command Line (Recommended)

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Scanner Register app"
   ```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it `scanner-register` (or any name you prefer)
   - Keep it Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/scanner-register.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your GitHub username.

### Option B: Using GitHub Web Interface

1. **Download your project**:
   - In Replit, click the three dots menu in the file tree
   - Select "Download as zip"
   - Extract the zip file on your computer

2. **Create repository and upload**:
   - Go to https://github.com/new
   - Name it `scanner-register`
   - Click "Create repository"
   - Click "uploading an existing file"
   - Drag all your project files (except `node_modules` folder)
   - Commit the files

## Step 2: Deploy to Render

### Option A: Using Blueprint (Automatic - Recommended)

1. **Sign up / Log in to Render**:
   - Go to https://render.com
   - Sign up with GitHub (easiest way to connect your repos)

2. **Deploy from Blueprint**:
   - Click **"New +"** → **"Blueprint"**
   - Connect your `scanner-register` repository
   - Render will automatically detect `render.yaml` and configure everything
   - Review the settings and click **"Apply"**
   - Done! Your app will build and deploy automatically

### Option B: Manual Web Service Creation

1. **Sign up / Log in to Render**:
   - Go to https://render.com
   - Sign up with GitHub (easiest way to connect your repos)

2. **Create New Web Service**:
   - From your Render dashboard, click **"New +"** button
   - Select **"Web Service"**

3. **Connect Your Repository**:
   - Find and select your `scanner-register` repository
   - Click **"Connect"**

4. **Configure Your Service**:
   - **Name**: `scanner-register` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Select **Free** (sufficient for most use cases)

5. **Environment Variables** (Optional):
   - Render auto-detects `NODE_ENV=production` from `render.yaml`
   - If you need session secrets later, you can add:
     - `SESSION_SECRET` = (generate a random string)

6. **Deploy**:
   - Click **"Create Web Service"**
   - Render will automatically:
     - Install dependencies (`npm install`)
     - Build your app (`npm run build`)
     - Start the server (`npm start`)
   - This takes 2-5 minutes for the first deploy

## Step 3: Access Your App

1. **Get Your URL**:
   - Once deployed, Render gives you a URL like:
     `https://scanner-register.onrender.com`
   - This is your live app URL!

2. **Test It**:
   - Open the URL in your browser
   - Log in with default credentials:
     - Username: `admin`
     - Password: `admin`
   - Register some scanners and test the features

## Important Notes

### Data Storage
- **Scanner Register uses IndexedDB** (browser-based storage)
- All data stays on each user's device
- No server database required
- Data is NOT shared between devices
- If you clear browser data, you lose all scanner/driver records

### Free Tier Limitations (Render)
- Apps spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds to wake up
- 750 hours/month free (plenty for small teams)
- For always-on service, upgrade to paid tier ($7/month)

### Custom Domain (Optional)
1. Go to your Render service settings
2. Click "Custom Domains"
3. Add your domain
4. Update your DNS records as instructed

## Updating Your Deployment

Whenever you make changes:

1. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```

2. **Automatic Deploy**:
   - Render automatically deploys when you push to GitHub
   - Or click "Manual Deploy" → "Deploy latest commit" in Render dashboard

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure `package.json` has correct `build` and `start` scripts
- Verify all dependencies are in `package.json`, not just installed

### App Won't Start
- Check runtime logs in Render dashboard
- Ensure `PORT` environment variable is not hardcoded (Render sets this automatically)
- Current setup uses port 5000 by default, which Render handles correctly

### Can't Access App
- Check if the service is "Live" in Render dashboard
- If on free tier, wait ~30 seconds for cold start
- Check browser console for errors (F12)

## Support

For Render-specific issues:
- [Render Documentation](https://render.com/docs)
- [Render Community Forum](https://community.render.com)

For app-specific issues:
- Check the browser console (F12) for errors
- IndexedDB data is stored locally - check Application tab in DevTools

---

**Your Scanner Register app is now live and independent of Replit! 🚀**
