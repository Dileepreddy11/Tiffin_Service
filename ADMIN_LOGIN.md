# Admin Panel Login

Your admin panel is now protected with secure authentication. When users click the "Admin Panel" button, they will need to enter credentials to access the dashboard.

## Default Credentials

```
Admin Key: TIFFIN_ADM_7K9xQ2mL
Password: SecurePass@2024!Tiffin
```

**⚠️ IMPORTANT: Change these credentials before deploying to production!**

## How to Change Credentials

Edit `.env.local` and update:
```
NEXT_PUBLIC_ADMIN_KEY=YOUR_NEW_KEY
NEXT_PUBLIC_ADMIN_PASSWORD=YOUR_NEW_PASSWORD
```

Then regenerate the hashes by running:
```bash
node lib/setup-credentials.js
```

## Features

- **Secure Modal Login**: Beautiful centered login dialog on `/admin`
- **Session Management**: 24-hour session expiration with secure HTTPOnly cookies
- **Firebase Integration**: Login attempts are logged in Firebase for audit trail
- **Logout Option**: Admin header includes logout button for security
- **Original Dashboard**: Full menu, orders, and customer management features

## Access the Admin Panel

Navigate to `http://localhost:3000/admin` and enter your credentials.

## Firebase Setup (Optional)

Login audit logging is configured to work with Firebase. Your Firebase config is in `lib/firebase.ts` with your Tiffin Service project credentials.

## Deployment

When deploying to Vercel:
1. Set environment variables in Vercel project settings:
   - `NEXT_PUBLIC_ADMIN_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
2. All other functionality remains the same
3. Data is stored in localStorage (can be upgraded to Firebase later)
