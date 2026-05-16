# Deployment Guide - Tiffin Service with Firebase

## Pre-Deployment Checklist

Before deploying to Vercel, complete this checklist:

### Security
- [ ] Change default admin credentials in `.env.local`
  - Update `NEXT_PUBLIC_ADMIN_KEY` to a strong unique key (12+ chars)
  - Update `NEXT_PUBLIC_ADMIN_PASSWORD` to a strong unique password (16+ chars with mixed case/symbols)
- [ ] Generate new `ADMIN_SESSION_SECRET` (minimum 32 characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Verify `.env.local` is in `.gitignore` (secrets not committed)
- [ ] Test admin login with new credentials locally

### Testing
- [ ] Test admin login flow: /admin/login → /admin
- [ ] Test menu items: add, edit, delete operations
- [ ] Test orders: view and update status
- [ ] Test customers & rewards display
- [ ] Test security & audit logs
- [ ] Verify logout button works
- [ ] Verify middleware redirects unauthenticated users

### Firebase Configuration
- [ ] Verify Firebase project ID is correct (tiffin-62938)
- [ ] Confirm Firebase Realtime Database is enabled
- [ ] Test data syncing to Firebase
- [ ] Verify audit logs are recording
- [ ] Check Firebase security rules (optional but recommended)

### Build & Dependencies
- [ ] Run build command: `npm run build`
- [ ] Verify no TypeScript errors
- [ ] Check for missing dependencies
- [ ] Run linter if configured: `npm run lint`

---

## Deployment Steps

### Step 1: Prepare Your Code

```bash
# Ensure all changes are committed
git status

# Create a new branch for deployment
git checkout -b production-deployment
```

### Step 2: Update Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add or update these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyALxS3QpHwyrHU_7eEQh1ab4Foeq1envGY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tiffin-62938.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tiffin-62938
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tiffin-62938.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=392628109006
NEXT_PUBLIC_FIREBASE_APP_ID=1:392628109006:web:affcea3ae0e18700c81a9f
NEXT_PUBLIC_ADMIN_KEY=YOUR_NEW_SECURE_KEY
NEXT_PUBLIC_ADMIN_PASSWORD=YOUR_NEW_SECURE_PASSWORD
ADMIN_SESSION_SECRET=your_generated_secret_min_32_chars
```

**Important**: Use your NEW credentials from `.env.local`, not the defaults!

### Step 3: Deploy to Vercel

#### Option A: Via GitHub (Recommended)
```bash
# Push code to GitHub
git push origin production-deployment

# Create a Pull Request on GitHub
# Vercel will automatically build and create preview deployment
# Review the preview, then merge to main

git checkout main
git merge production-deployment
git push origin main

# Vercel will automatically deploy to production
```

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts to set environment variables
```

### Step 4: Verify Deployment

1. **Check Deployment Status**
   - Go to Vercel dashboard
   - Confirm deployment shows "Ready"
   - Check for any errors in deployment logs

2. **Test Production Admin Portal**
   - Visit: `https://your-project.vercel.app/admin/login`
   - Login with your NEW credentials
   - Verify dashboard loads correctly
   - Test menu, orders, customers tabs
   - Check security & audit logs

3. **Verify Firebase Connection**
   - Make a test change (add menu item, create order)
   - Check Firebase console to verify data saved
   - Refresh admin page to confirm data persists

4. **Test User-Facing App**
   - Visit main page: `https://your-project.vercel.app`
   - Verify menu displays correctly
   - Test ordering functionality
   - Confirm data syncs with admin panel

---

## Post-Deployment

### Monitoring

1. **Check Logs**
   - Vercel dashboard → Deployments → View logs
   - Look for any errors or warnings

2. **Monitor Admin Access**
   - Regularly check Security & Audit tab
   - Review login history for suspicious activity

3. **Firebase Database**
   - Visit Firebase Console
   - Monitor database size and growth
   - Check for any errors

### Maintenance

- **Weekly**: Review audit logs for security
- **Monthly**: Export/backup Firebase data
- **Monthly**: Check Vercel deployment logs
- **As needed**: Update menu items, manage orders

### Scaling

If traffic grows:
- Monitor Vercel usage metrics
- Consider upgrading Vercel plan
- Monitor Firebase database limits
- Implement caching strategies if needed

---

## Troubleshooting Deployment

### Admin Login Not Working in Production
1. Verify environment variables are set correctly in Vercel dashboard
2. Check if credentials were typed correctly
3. Verify `.env.local` wasn't deployed (shouldn't be in git)
4. Clear browser cookies and try again

### Data Not Syncing to Firebase
1. Verify Firebase credentials in environment variables
2. Check Firebase project is accessible
3. Verify database rules allow writes
4. Check browser console for errors

### Build Failures
1. Check Vercel build logs
2. Verify all dependencies are installed
3. Check for TypeScript errors
4. Ensure no hardcoded localhost URLs

### Slow Performance
1. Check Firebase database size
2. Review Vercel analytics
3. Consider splitting large datasets
4. Implement pagination if needed

---

## Rollback Procedure

If something goes wrong in production:

1. **Via GitHub**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main
   # Vercel will auto-deploy previous version
   ```

2. **Via Vercel Dashboard**
   - Go to Deployments
   - Click on previous stable deployment
   - Click "Promote to Production"

3. **Manual Fix**
   - Fix the issue locally
   - Commit and push
   - Vercel will redeploy automatically

---

## Environment Variables Summary

| Variable | Value | Sensitive |
|----------|-------|-----------|
| NEXT_PUBLIC_FIREBASE_API_KEY | Your Firebase key | Yes |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | tiffin-62938 | No |
| NEXT_PUBLIC_ADMIN_KEY | Your new admin key | Yes |
| NEXT_PUBLIC_ADMIN_PASSWORD | Your new password | Yes |
| ADMIN_SESSION_SECRET | 32+ char random | Yes |

**Note**: Only variables starting with `NEXT_PUBLIC_` are exposed to browser. Others are server-only.

---

## Security Best Practices for Production

1. **Change Default Credentials**: Done before deployment
2. **Use Strong Passwords**: Min 16 chars with mixed case and symbols
3. **Monitor Admin Access**: Weekly review of audit logs
4. **Keep Dependencies Updated**: Run `npm update` periodically
5. **Regular Backups**: Export Firebase data monthly
6. **Domain Security**: Use custom domain with HTTPS (automatic with Vercel)
7. **Rate Limiting**: Consider adding if needed
8. **Logging**: Review Vercel and Firebase logs regularly

---

## Performance Optimization

### For Vercel
- Use Edge Functions for fast authentication checks
- Enable caching for static assets
- Monitor function execution time

### For Firebase
- Use indexed queries
- Implement pagination for large datasets
- Archive old data (orders >6 months)

### For the App
- Lazy load dashboard tabs
- Batch API calls
- Implement search/filtering efficiently

---

## Support

For deployment help:
- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Deployment Checklist**: Use the checklist at the top before deploying
**Last Updated**: May 2026
**Version**: 1.0
