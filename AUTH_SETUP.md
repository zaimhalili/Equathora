# 🔐 Equathora Authentication Setup Guide

## Current Setup

Your app uses **Supabase Authentication** with email verification enabled. Here's how it works:

### User Flows

#### 1. Sign Up Flow
```
User signs up → Supabase sends verification email → User enters 6-digit code → Dashboard
```

#### 2. Login Flow  
```
User logs in → (if verified) → Dashboard
```

#### 3. Password Reset Flow
```
Forgot Password → Email with magic link → Click link → Reset Password page → New password → Login
```

#### 4. Resend Verification
```
Resend page → Enter email → New verification code sent
```

---

## For Development (Local Testing)

### Option 1: View Verification Codes (Recommended)
1. Keep email verification enabled
2. Check Supabase logs for codes:
   - Go to Supabase Dashboard → Logs → Select your project
   - Filter for "email" to see verification codes
3. Users get auto-redirected to `/verify` page after signup
4. Enter the code from logs

### Option 2: Disable Email Verification (Quick Testing)
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth**
4. Toggle OFF: **"Enable email confirmations"**
5. Now signups go directly to dashboard (no verification needed)

**Note:** Remember to re-enable for production!

---

## For Production

### Required Supabase Configuration

#### 1. Email Provider Setup
- Go to **Settings** → **Auth** → **SMTP Settings**
- Configure a custom SMTP provider (SendGrid, AWS SES, etc.) or use Supabase's default
- Default works but has rate limits

#### 2. Email Templates
- Go to **Authentication** → **Email Templates**
- Customize the **"Confirm signup"** template
- Use `{{ .Token }}` for OTP code
- Use `{{ .ConfirmationURL }}` for magic link

#### 3. URL Configuration
- Go to **Authentication** → **URL Configuration**
- Set **Site URL**: `https://yourdomain.com`
- Add **Redirect URLs**:
  - `https://yourdomain.com/dashboard`
  - `https://yourdomain.com/reset-password`
  - `https://yourdomain.com/verify`

#### 4. Security Settings
- Enable email confirmations: ✅ ON
- Enable double confirmation: Optional (extra security)
- Set password requirements (min 6 characters already set)

---

## What Each Page Does

| Page | Route | Purpose |
|------|-------|---------|
| **Signup** | `/signup` | New account creation, redirects to verify if needed |
| **Login** | `/login` | Existing user authentication |
| **Verify Email** | `/verify` | Enter 6-digit verification code |
| **Resend** | `/resend` | Request new verification email |
| **Forgot Password** | `/forgotpassword` | Request password reset link |
| **Reset Password** | `/reset-password` | Set new password (via email link) |

---

## Common Issues & Solutions

### "Email not confirmed"
- **Problem:** User tries to login before verifying email
- **Solution:** Direct them to `/resend` to get a new verification code

### "Invalid or expired token"
- **Problem:** Verification code expired (24 hours) or wrong
- **Solution:** Go to `/resend` for a new code

### "Not receiving emails"
- **Dev:** Check Supabase logs for the code
- **Prod:** Check spam folder, verify SMTP settings, check rate limits

### "Reset link doesn't work"
- **Problem:** User's session expired or link already used
- **Solution:** Request new link from `/forgotpassword`

---

## Quick Actions

### Test Auth Flow Locally
```bash
# 1. Start your app
npm run dev

# 2. Sign up at http://localhost:5173/signup
# 3. Check Supabase logs for verification code
# 4. Enter code at /verify
```

### Disable Verification for Testing
```
Supabase Dashboard → Auth → Settings → Email Auth → 
Turn OFF "Enable email confirmations"
```

### Re-enable for Production
```
Same location → Turn ON "Enable email confirmations"
```

---

## Button Styles - All Matching Now ✅

All auth buttons (Login, Signup, Verify, Reset, Resend) now use:
- **Background:** `var(--dark-accent-color)` (your red)
- **Hover:** `rgb(128, 16, 35)` (darker red)
- **Transition:** `0.1s ease-out`
- **Shadow:** `0 5px 5px 0 rgba(43, 45, 66, 0.5)`

No more gradient differences!

---

## Recommendation

**For your use case:** Keep verification enabled with these tweaks:

1. ✅ **Already done:** Auto-redirect to `/verify` after signup
2. ✅ **Already done:** Pre-fill email on verify page  
3. ✅ **Already done:** Clear error messages
4. 📧 **Next step:** Set up custom email templates in Supabase
5. 🔒 **Before launch:** Configure production URLs and SMTP

This gives you security + good UX! 🚀
