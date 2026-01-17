# Firebase Setup Guide

Your portfolio now uses **Firebase Realtime Database** for cross-device sync! 🎉

## Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `jaya-portfolio` (or any name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Add Web App
1. In your Firebase project dashboard, click the **Web icon** `</>`
2. Enter app nickname: `Portfolio App`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click **"Register app"**
5. **Copy the Firebase configuration object** (looks like this):
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app-default-rtdb.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123"
};
```

### Step 3: Enable Realtime Database
1. In Firebase Console, go to **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Select location (closest to you)
4. Start in **"Test mode"** (for now)
5. Click **"Enable"**

### Step 4: Update Your Code
1. Open `firebase-config.js`
2. **Replace** the placeholder config with your Firebase config from Step 2
3. Save the file

### Step 5: Set Database Rules (Important!)
In Firebase Console → Realtime Database → **Rules** tab, paste this:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "true",
        ".write": "true"
      }
    }
  }
}
```

**Click "Publish"**

⚠️ **Note**: These rules allow anyone to read/write. For production, you should add authentication!

## Testing

1. Open your portfolio on desktop: `index.html`
2. Add tasks, upload profile image, check LeetCode days
3. Open the same portfolio on your phone (same URL)
4. **Magic!** ✨ All your data should appear instantly!

## Troubleshooting

### "Firebase is not defined" error
- Make sure `firebase-config.js` is loaded **after** Firebase SDK scripts in `index.html`

### Data not syncing
- Check browser console for errors
- Verify your `databaseURL` ends with `.firebaseio.com`
- Ensure Database Rules are published

### Want to reset all data?
- Go to Firebase Console → Realtime Database
- Delete the `users/jaya-raut` node

## Security (For Production)

To make this portfolio-ready:

1. **Enable Firebase Authentication**
2. Update database rules to require authentication
3. Consider adding password protection for sensitive operations

## Need Help?

Check out [Firebase Documentation](https://firebase.google.com/docs/database/web/start)
