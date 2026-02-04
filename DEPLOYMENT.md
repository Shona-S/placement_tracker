# Deployment to Netlify

Your project is already configured for deployment to Netlify.

## configuration Verification
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Routing:** SPA redirects are configured in `netlify.toml`.

## Environment Variables (CRITICAL)
Your application connects to Firebase, so you **must** add these environment variables in Netlify for it to work.

1.  Go to **Site configuration** > **Environment variables**.
2.  Click **Add a variable** > **Import from a .env file** (or add them one by one).
3.  Add the following keys (copy values from your local `.env` file):

    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`

**After adding these variables, you MUST trigger a new deployment** (go to Deploys > Trigger deploy > Deploy site).

## Option 1: Deploy via Git (Recommended)
This method establishes Continuous Deployment (CD), so your site updates automatically when you push to GitHub/GitLab/Bitbucket.

1.  **Push your code** to a Git provider (GitHub, GitLab, or Bitbucket).
2.  Log in to [Netlify](https://app.netlify.com/).
3.  Click **"Add new site"** > **"Import an existing project"**.
4.  Select your Git provider and authorize Netlify.
5.  Pick your repository (**SHONA-S/placement_tracker**).
6.  Netlify will detect the settings automatically from `netlify.toml`:
    -   **Build command:** `npm run build`
    -   **Publish directory:** `dist`
7.  Click **"Deploy site"**.

## Option 2: Manual Deploy (Drag & Drop)
If you don't want to use Git, you can manually deploy the build folder.

1.  Run `npm run build` in your terminal.
2.  Locate the `dist` folder created in your project directory.
3.  Log in to [Netlify](https://app.netlify.com/).
4.  Go to the **"Sites"** tab.
5.  Drag and drop the `dist` folder onto the "Drag and drop your site output folder here" area at the bottom of the page.

## Option 3: Netlify CLI
If you have the Netlify CLI installed:

1.  Run: `netlify deploy --prod`
2.  Select "Create & configure a new site".
3.  Set **Publish directory** to `dist`.
