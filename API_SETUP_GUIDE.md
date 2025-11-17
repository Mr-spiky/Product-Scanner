# API Setup Guide for Product Scanner

This guide will help you set up all the required APIs for your Product Scanner application.

## Overview

Your application requires these services:
1. **Firebase** (Authentication & Database) - ✅ **FREE** & **REQUIRED**
2. **OpenAI** (AI-powered analysis) - ⚠️ **OPTIONAL** (fallback analysis available for free)
3. **MongoDB** (Product caching) - ✅ **FREE** & **OPTIONAL**

---

## 1. Firebase Setup (Required for Authentication)

Firebase provides user authentication and real-time database features.

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Product Scanner")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Google"** sign-in provider
5. Add your support email
6. Click **"Save"**

### Step 3: Create a Web App

1. In Firebase Console, click the **gear icon** ⚙️ (Project Settings)
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** `</>`
4. Enter an app nickname (e.g., "Product Scanner Web")
5. Click **"Register app"**
6. Copy the `firebaseConfig` object

### Step 4: Get Frontend Firebase Config

Copy these values from the `firebaseConfig` object and add to **`frontend/.env.local`**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 5: Get Backend Firebase Service Account (For Admin SDK)

1. In Firebase Console, go to **Project Settings** ⚙️
2. Click the **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** - a JSON file will download
5. Open the JSON file and extract these values for **`backend/.env`**:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY_HERE\n-----END PRIVATE KEY-----"
```

**Important:** The private key must be wrapped in quotes and keep the `\n` characters.

### Step 6: Set Up Firestore Database

1. In Firebase Console, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to you
5. Click **"Enable"**

---

## 2. OpenAI API Setup (OPTIONAL - Basic Analysis Works Without It)

⚠️ **Good News**: The app now includes a **FREE fallback analysis system** that works without OpenAI!

**If you don't have a credit card or don't want to pay:**
- Skip this section entirely
- The app will use rule-based analysis (detects harmful ingredients, high sugar/salt, etc.)
- All features work except advanced AI-powered analysis

**If you want AI-powered analysis (requires payment):**

### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/api-keys)

### Step 2: Create API Key

1. Click **"Create new secret key"**
2. Give it a name (e.g., "Product Scanner")
3. Click **"Create secret key"**
4. **Copy the key immediately** (you won't see it again!)

### Step 3: Add Billing

1. Go to [Billing](https://platform.openai.com/account/billing)
2. Add a credit card (required for API access)
3. Set usage limits to control costs

### Step 4: Add to Backend Environment

Add to **`backend/.env`**:

```env
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OPENAI_MODEL=gpt-4o-mini
```

**Cost Estimate:** ~$0.15 per 1M input tokens. For testing, expect $5-10/month max.

---

## 3. MongoDB Setup (Optional - for Caching)

MongoDB is used to cache product data and reduce API calls.

### Option A: Local MongoDB (Recommended for Development)

1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run on `mongodb://127.0.0.1:27017` by default
4. Your **`backend/.env`** already has this configured:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/product_scanner_full
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new **FREE cluster** (M0)
4. Click **"Connect"**
5. Add your IP address to whitelist (or use `0.0.0.0/0` for all IPs - development only!)
6. Create a database user with username and password
7. Click **"Connect your application"**
8. Copy the connection string
9. Replace in **`backend/.env`**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/product_scanner_full?retryWrites=true&w=majority
   ```

---

## 4. Final Configuration

### Frontend Environment File (`frontend/.env.local`)

```env
# Firebase Config (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Admin emails (comma-separated)
NEXT_PUBLIC_ADMIN_EMAILS=your-email@gmail.com

# Backend URL
NEXT_PUBLIC_BACKEND_URL_RECENT=http://localhost:5000/api/products/recent-scans
```

### Backend Environment File (`backend/.env`)

```env
# MongoDB (local or Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/product_scanner_full

# OpenAI API
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OPENAI_MODEL=gpt-4o-mini

# Firebase Service Account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY_HERE\n-----END PRIVATE KEY-----"

# Server Config
FRONTEND_ORIGIN=http://localhost:3000
PORT=5000
CACHE_TTL_DAYS=7
```

---

## 5. Verify Setup

### Test Backend
```bash
cd backend
npm run dev
```

Should see:
- ✅ MongoDB connected
- ✅ Firebase initialized
- ✅ Server running at http://localhost:5000

### Test Frontend
```bash
cd frontend
npm run dev
```

Should see:
- ✅ Ready in X seconds
- No Firebase errors

### Test in Browser

1. Open http://localhost:3000
2. Try signing in with Google
3. Scan a product barcode (or search)
4. Check if AI analysis works

---

## Troubleshooting

### Firebase: "auth/api-key-not-valid"
- Check that API key in `.env.local` matches Firebase Console
- Make sure no extra spaces or quotes around the key
- Verify the web app is registered in Firebase Console

### OpenAI: "Incorrect API key"
- Verify the key starts with `sk-proj-` or `sk-`
- Check you have billing enabled
- Make sure no spaces in the key

### MongoDB: "Connection refused"
- Check MongoDB is running (if local)
- Verify connection string format
- For Atlas: check IP whitelist and credentials

### "Module not found" errors
- Run `npm install` in both frontend and backend folders

---

## Quick Start Summary

1. **Firebase**: Create project → Enable Google Auth → Get config → Add to `.env.local` ✅ **REQUIRED**
2. **OpenAI**: ⚠️ **OPTIONAL** - Skip if you don't have a credit card (app works with free fallback)
3. **MongoDB**: ✅ **OPTIONAL** - Install locally OR use Atlas free tier
4. Restart both servers
5. Open http://localhost:3000 and test!

**Minimum to run the app:** Just Firebase! Everything else is optional.

---

## Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **OpenAI API Docs**: https://platform.openai.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/

For issues, check the console logs in your browser (F12) and terminal output.
