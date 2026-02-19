# Firestore Security Rules

To fix the issue where data vanishes on refresh (because it wasn't actually saved to the database due to permission errors), you must update your Firestore Security Rules.

## 1. Go to Rules Tab
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Firestore Database** > **Rules** tab.

## 2. Replace with These Rules
Copy and paste the following code. It adds permission for the `dailyProgress` collection.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Application Rules
    match /applications/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Progress Tracker Rules (NEW)
    match /dailyProgress/{docId} {
      // Allow users to read/write their own progress
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // Allow creation
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Simpler Fallback (Optional - Use if the above doesn't work)
    // match /{document=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

## 3. Publish
Click **Publish** to save. The app should now correctly save and load your progress.
