# AITA Karma Courtroom - Setup Instructions

## Google OAuth and Firebase Setup

To enable authentication in your AITA Karma Courtroom app, follow these steps:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard to create your project
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Enable "Google" as a sign-in provider
4. Add your domain to the "Authorized domains" list (for production)

### 3. Set up Firestore Database

1. Click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

### 4. Get Firebase Configuration

1. Click on the gear icon (Project Settings)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the configuration object

### 5. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 6. Install Dependencies and Run

```bash
npm install
npm run dev
```

## Features

- **Google OAuth Authentication**: Secure sign-in with Google accounts
- **Real-time Data Sync**: User stats are saved to Firestore and sync across devices
- **Guest Mode**: Play without signing in (progress saved locally)
- **User Profiles**: View detailed stats, achievements, and progress
- **Persistent Progress**: Signed-in users never lose their progress

## Database Structure

The app creates the following Firestore collections:

- `users`: User profile information
- `userStats`: Game statistics for each user
- `judgments`: Individual judgment records for analytics

## Security Notes

- Never commit your `.env` file to version control
- Use Firebase Security Rules to protect your Firestore data
- In production, configure authorized domains in Firebase Authentication settings

## Troubleshooting

- If authentication isn't working, check your Firebase configuration
- Ensure your domain is added to Firebase authorized domains
- Check browser console for any Firebase-related errors
- Make sure Firestore is enabled and has the correct security rules
