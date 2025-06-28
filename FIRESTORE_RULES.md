# Firestore Security Rules Setup

Your app is connecting to Firebase successfully, but you're getting permission errors because Firestore is set to production mode with restrictive security rules.

## Quick Fix: Enable Test Mode (Temporary)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **courtroom-karma**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with this **temporary** test rule:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

6. Click **Publish**

⚠️ **Warning**: This allows all users to read/write all data until Dec 31, 2025. Only use for testing!

## Production Security Rules (Recommended)

For production, use these secure rules instead:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own stats
    match /userStats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only create their own judgment records
    match /judgments/{judgmentId} {
      allow create: if request.auth != null && 
                   request.auth.uid == resource.data.uid;
      allow read: if request.auth != null && 
                 request.auth.uid == resource.data.uid;
    }
    
    // Allow reading leaderboard data (optional)
    match /leaderboard/{document} {
      allow read: if request.auth != null;
    }
  }
}
```

## Steps to Apply Rules:

1. **Go to Firebase Console** → Your Project → Firestore Database → Rules
2. **Copy and paste** one of the rule sets above
3. **Click "Publish"**
4. **Refresh your app** - authentication should now work!

## Alternative: Use Firebase Emulator (Advanced)

For local development, you can also use the Firebase emulator:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
firebase emulators:start
```

Then update your Firebase config to use the emulator for local development.

## Current Status

✅ Firebase Authentication: **Working**  
❌ Firestore Database: **Permission Denied**  
🔧 **Action Required**: Update Firestore rules as shown above
