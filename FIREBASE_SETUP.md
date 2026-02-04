# How to Set Up Firebase for Placement Tracker

Follow these steps to get your backend running in 5 minutes.

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Create a project"**.
3. Name it (e.g., `placement-tracker`) and click **Continue**.
4. Disable Google Analytics (optional, makes setup faster) and click **Create project**.
5. Wait for it to finish and click **Continue**.

## Step 2: Register Your App
1. You should be on the "Project Overview" page.
2. Click the **Web icon** `</>` (it looks like a coding bracket) to add an app.
3. Name it (e.g., `Placement Web App`).
4. Click **Register app**.
5. **Copy the `firebaseConfig` object keys**. You only need the values inside the quotes.
   - You will need these for your `.env` file later.

## Step 3: Enable Authentication
1. On the left sidebar, click **Build** > **Authentication**.
2. Click **Get Started**.
3. Under "Sign-in method", click **Email/Password**.
4. Turn on the **Enable** switch.
5. Click **Save**.

## Step 4: Enable Firestore Database
1. On the left sidebar, click **Build** > **Firestore Database**.
2. Click **Create Database**.
3. Select a Location (e.g., `nam5 (us-central)` or one closest to you). Click **Next**.
4. **Important**: Select **Start in Test Mode**.
   - This allows you to write data without complex security rules for now.
5. Click **Create**.

## Step 5: Update Your Project Configuration
1. Go back to your VS Code / Project folder.
2. Create a new file named `.env` in the root folder (`d:/Projects/Placements/.env`).
   - *Note: Don't call it `.env.local` or `.env.development` strictly, usually just `.env` is safest for Vite to pick up defaults.*
3. Copy the content from `.env.example` into `.env`.
4. Replace the values with the ones you copied in Step 2.

Exmaple `.env`:
```
VITE_FIREBASE_API_KEY=AIzaSyDOC...
VITE_FIREBASE_AUTH_DOMAIN=placement-tracker.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=placement-tracker
VITE_FIREBASE_STORAGE_BUCKET=placement-tracker.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
```

## Step 6: Restart
1. Go to your terminal where `npm run dev` is running.
2. Press `Ctrl + C` to stop it.
3. Run `npm run dev` again.
4. Reload the page in your browser.
