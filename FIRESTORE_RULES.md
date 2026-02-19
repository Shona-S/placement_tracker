# Firestore Security Rules

To fix the "Missing or insufficient permissions" error, you need to update your database rules to allow logged-in users to write data.

## 1. Go to Rules Tab
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Firestore Database** > **Rules** tab.

## 2. Replace the Rules
Delete the existing code and paste this instead:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow users to read/write only their own data
    match /applications/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // Allow creation if the userId matches the authenticated user
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Fallback for other collections (or if you want a simpler rule for now)
    // Uncomment the line below to allow ANY logged-in user to read/write EVERYTHING (Easier for testing)
    // match /{document=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

### Simpler Rule (Recommended for now)
If the above rule gives you trouble, just use this simple one which allows **any logged-in user** to read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3. Publish
Click **Publish** to save changes. Your app should work immediately after this (no redeploy needed).
