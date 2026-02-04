# Placement Drive Tracker

A sleek, modern, dark-themed React application for tracking placement drives and job applications. Built with Vite, React, and Firebase.

## Features

- 📊 **Dashboard**: Real-time statistics of your application progress.
- 📝 **Application Management**: Add, Edit, Delete, and View applications.
- 🔍 **Search & Filter**: Easily find applications by company or status.
- 🔐 **Authentication**: Secure Login and Signup via Firebase.
- 📱 **Responsive Design**: Works on Desktop and Mobile.
- 🎨 **Dark Theme**: Professional dark mode UI with glassmorphism effects.

## Prerequisites

- Node.js (v16+)
- A Firebase Project (for Auth and Firestore)

## Setup

1. **Clone the repository** (if not already local).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Firebase**:
   - Rename `.env.example` to `.env`.
   - Add your Firebase configuration keys.
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   ...
   ```
4. **Run Locally**:
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

## Build

To create a production build:
```bash
npm run build
```
The output will be in the `dist` folder.

## Technologies

- **Frontend**: React, Vite, Vanilla CSS (Variables & Flexbox/Grid)
- **Backend Service**: Firebase (Auth, Firestore)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
