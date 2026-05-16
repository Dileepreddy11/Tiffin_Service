# Quick Start Guide - Secure Admin Dashboard

## 🚀 Get Started in 3 Steps

### Step 1: Start the Dev Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Step 2: Go to Admin Login
Navigate to: `http://localhost:3000/admin/login`

### Step 3: Login with These Credentials
- **Admin Key**: `TIFFIN_ADM_7K9xQ2mL`
- **Password**: `SecurePass@2024!Tiffin`

That's it! You're now in the secure admin dashboard.

---

## 📊 Admin Dashboard Features

Once logged in, you can access:

| Tab | What You Can Do |
|-----|-----------------|
| **Menu Items** | Add, edit, delete menu items with prices |
| **Orders** | View customer orders and track status |
| **Customers & Rewards** | Monitor customer loyalty and rewards |
| **Security & Audit** | View login history and security logs |

---

## ⚙️ Changing Your Admin Credentials

**IMPORTANT**: Change these default credentials before deploying!

1. Edit `.env.local`:
```env
NEXT_PUBLIC_ADMIN_KEY=YOUR_NEW_KEY
NEXT_PUBLIC_ADMIN_PASSWORD=YOUR_NEW_PASSWORD
```

2. Restart the dev server:
```bash
npm run dev
```

3. Login with your new credentials

---

## 🔐 Security Features

✅ **Only You Can Access**: Protected with key + password
✅ **Session Expiration**: Auto-logout after 24 hours
✅ **Audit Trail**: All login attempts are logged
✅ **Secure Cookies**: Session data is encrypted
✅ **Firebase Backup**: All data synced to Firebase

---

## 📱 Dashboard Overview

### Stats Cards
- **Total Orders**: Number of all orders
- **Delivered**: Completed orders
- **Total Revenue**: Sum of all order amounts
- **Total Customers**: Registered customers

### Security & Audit Tab
View all login attempts:
- ✓ Success/failed logins
- Timestamp of each attempt
- Device information
- Admin key used (masked for security)

---

## 🌐 Deploying to Vercel

1. **Update Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_ADMIN_KEY` (your new key)
   - Add `NEXT_PUBLIC_ADMIN_PASSWORD` (your new password)

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Access Your Admin Dashboard**
   ```
   https://your-project.vercel.app/admin/login
   ```

---

## 📧 Data Storage

Your data is stored in Firebase:
- **Menu Items**: Persistent database
- **Orders**: Real-time updates
- **Customers**: Loyalty tracking
- **Login Audit**: Security monitoring

All data syncs across devices automatically!

---

## ❓ Troubleshooting

### I forgot my password
Edit `.env.local` and restart dev server with correct credentials.

### Admin page shows error
- Clear browser cookies
- Restart dev server (`npm run dev`)
- Check `.env.local` has credentials set

### Audit logs not loading
- Check internet connection
- Verify Firebase database is accessible
- Refresh the page

---

## 📖 Full Documentation

For complete setup and API details, see:
- `ADMIN_SETUP.md` - Full admin setup guide
- `FIREBASE_INTEGRATION_SUMMARY.md` - Technical details

---

**Ready to manage your tiffin business?** 🍲
