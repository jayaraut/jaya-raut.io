# Firebase Authentication Setup

## Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/project/jaya-raut/authentication/providers)
2. Click **"Authentication"** in the left menu
3. Click **"Get started"** (if first time)
4. Go to **"Sign-in method"** tab
5. Click **"Email/Password"**
6. **Enable** the first toggle (Email/Password)
7. Click **"Save"**

## Step 2: Create Your Admin Account

1. Go to **"Users"** tab
2. Click **"Add user"**
3. Enter your email (e.g., `jaya.raut@gmail.com`)
4. Enter a strong password
5. Click **"Add user"**

## Step 3: Update Database Rules

Go to **Realtime Database → Rules** and replace with these **secure rules**:

```json
{
  "rules": {
    "users": {
      "jaya-raut": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

Click **"Publish"**

## How It Works

### For You (Admin):
1. Open your portfolio
2. Click the **🔒 lock icon** (bottom-left)
3. Enter your email and password
4. Now you can edit tasks, upload images, check LeetCode days
5. Click **🔓** to sign out when done

### For Interviewers (Viewers):
- Portfolio loads automatically in **read-only mode**
- They can see everything but can't edit
- No sign-in required for viewing
- Your data is protected! 🔒

## Security Benefits

✅ **Only you can edit** - Authentication required for writes  
✅ **Everyone can view** - No login needed to see your portfolio  
✅ **No accidental changes** - Interviewers can't modify your data  
✅ **Password protected** - Only you know the credentials  

## Database Rules Explained

```json
{
  "rules": {
    "users": {
      "jaya-raut": {
        ".read": true,              // ← Anyone can read (public portfolio)
        ".write": "auth != null"    // ← Only authenticated users can write
      }
    }
  }
}
```

This means:
- **Read**: Public (anyone visiting your portfolio)
- **Write**: Protected (only when signed in)

Perfect for a portfolio website! 🚀
