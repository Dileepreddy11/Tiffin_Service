# Admin Dashboard Setup Guide

## Overview
This is a secure Firebase-backed admin dashboard for the Tiffin Service application. Only you can access the admin dashboard with your unique key and password.

## Default Admin Credentials

Your admin portal uses the following credentials (stored securely):

- **Admin Key**: `TIFFIN_ADM_7K9xQ2mL`
- **Password**: `SecurePass@2024!Tiffin`

### IMPORTANT: Change These Immediately!

⚠️ **These are default credentials. You MUST change them before deploying to production.**

## How to Change Your Admin Credentials

### Step 1: Update Your Credentials
Edit `.env.local` in the project root and change:

```env
NEXT_PUBLIC_ADMIN_KEY=YOUR_NEW_SECURE_KEY
NEXT_PUBLIC_ADMIN_PASSWORD=YOUR_NEW_SECURE_PASSWORD
```

**Requirements for strong credentials:**
- Admin Key: At least 12 characters, mix of letters and numbers
- Password: At least 16 characters, include uppercase, lowercase, numbers, and special characters

**Example:**
```env
NEXT_PUBLIC_ADMIN_KEY=TIFFIN_ADM_9Kx8L2pQmN
NEXT_PUBLIC_ADMIN_PASSWORD=SecurePass@2024!TiffinAdmin$Secure123
```

### Step 2: Restart the Application
```bash
npm run dev
```

### Step 3: Login with New Credentials
1. Go to `http://localhost:3000/admin/login` (or your deployed URL)
2. Enter your new admin key
3. Enter your new password
4. Click "Login"

## Accessing the Admin Dashboard

### Local Development
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/login`
3. Enter your admin key and password
4. You'll be redirected to the admin dashboard

### Production (Vercel)
1. Your app will be deployed to Vercel
2. Navigate to your deployment URL `/admin/login`
3. Enter your credentials
4. You'll be redirected to the secure admin dashboard

## Admin Dashboard Features

### 1. Menu Items Management
- **Add Items**: Create new tiffin menu items
- **Edit Items**: Modify existing menu items (name, price, description, category)
- **Delete Items**: Remove items from the menu
- **View Details**: See all menu items and their details

### 2. Orders Management
- **View All Orders**: See customer orders with status
- **Order Details**: Click on orders to see full details
- **Update Status**: Change order status (pending, preparing, ready, delivered)
- **Track Revenue**: Monitor total revenue and completed orders

### 3. Customers & Rewards
- **View Customers**: See all registered customers
- **Reward Points**: Track customer loyalty points
- **Unlocked Rewards**: See which rewards customers have earned
- **Total Orders**: Monitor customer ordering frequency

### 4. Security & Audit Logs
- **Login History**: View all admin login attempts
- **Success/Failure Logs**: See which logins were successful or failed
- **Timestamp**: Track when each login occurred
- **Device Info**: See device/browser information for each attempt

## Data Storage

### Firebase Database Structure
Your data is stored in Firebase Realtime Database:

```
tiffin-62938
├── menuItems/          # All menu items
├── orders/             # All customer orders
├── customers/          # Customer information
├── admin_sessions/     # Active admin sessions
└── admin_audit/        # Login audit trail
    └── login_attempts/
```

### Session Management
- **Session Timeout**: 24 hours of inactivity
- **Secure Cookies**: Session ID stored in HTTPOnly cookies
- **Auto-Logout**: You'll be logged out after 24 hours
- **One Browser Per Session**: Each login creates a new session

## Security Features

✅ **HTTPS Only**: Secure encrypted connection (in production)
✅ **HTTPOnly Cookies**: Session tokens can't be accessed by JavaScript
✅ **Session Expiration**: Automatic logout after 24 hours
✅ **Audit Trail**: Every login attempt is logged
✅ **Role-Based Access**: Only users with correct credentials can access admin areas
✅ **Firebase Security Rules**: Data access controlled by authentication

## Firebase Configuration

Your Firebase project is pre-configured with:
- **Project ID**: tiffin-62938
- **Realtime Database**: Enabled
- **Authentication**: Via admin credentials
- **Analytics**: Enabled for tracking

### Firebase Console Access
To manage your Firebase project directly:
1. Go to https://console.firebase.google.com
2. Select "tiffin-62938" project
3. Use your Firebase account credentials

## Troubleshooting

### Forgot Your Password?
1. You can temporarily reset to default credentials by editing `.env.local`
2. Change back to your new credentials after logging in

### Can't Login?
- Check your admin key is typed correctly (case-sensitive)
- Check your password is typed correctly
- Verify your credentials haven't been changed since last login
- Clear browser cookies and try again

### Firebase Connection Issues?
- Check internet connection
- Verify Firebase is not blocked by firewall/VPN
- Check Firebase project status at console.firebase.google.com
- Check console logs for detailed error messages

### Audit Logs Not Showing?
- Refresh the page
- Check browser console for errors
- Ensure you're logged in as admin
- Wait a few seconds for logs to load

## Best Practices

1. **Change Default Credentials**: Do this immediately in production
2. **Strong Passwords**: Use at least 16 characters with mixed case and symbols
3. **Secure Storage**: Keep your credentials safe and don't share them
4. **Monitor Audit Logs**: Regularly check login attempts for suspicious activity
5. **Logout on Shared Devices**: Always logout when done, especially on shared computers
6. **Session Timeout**: Your session will auto-expire after 24 hours of inactivity

## Deploying to Vercel

### Step 1: Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add:
   - `NEXT_PUBLIC_ADMIN_KEY` (your new key)
   - `NEXT_PUBLIC_ADMIN_PASSWORD` (your new password)
   - `ADMIN_SESSION_SECRET` (keep it secure, min 32 characters)

### Step 2: Deploy
```bash
git push origin main
```

Your app will be deployed to Vercel and the admin portal will be available at:
```
https://your-deployment.vercel.app/admin/login
```

## Support

For Firebase support: https://firebase.google.com/support
For Next.js support: https://nextjs.org/docs

---

**Last Updated**: May 2026
**Version**: 1.0
**Framework**: Next.js 16 + Firebase Realtime Database
