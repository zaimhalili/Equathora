# Profile Editing Setup Guide

## Overview
This implementation adds full profile editing functionality including:
- ✅ Avatar/profile picture upload
- ✅ Bio editing (200 character limit)
- ✅ Username editing (with validation)
- ✅ Location field
- ✅ Website/portfolio link
- ✅ Real-time preview
- ✅ Save to Supabase user metadata

## Files Created/Modified

### New Files:
1. **src/components/EditProfileModal.jsx** - Modal component for editing profile
2. **backend/EquathoraBackend/setup_storage.sql** - SQL script for storage setup

### Modified Files:
1. **src/pages/Profile.jsx** - Integrated EditProfileModal

## Supabase Storage Setup

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Storage** section
3. Click **"New Bucket"**
4. Create a bucket with:
   - **Name:** `user-avatars`
   - **Public:** ✅ Enable (check this box)
5. Click **"Create Bucket"**

### Option 2: Using SQL (Alternative)
Run the SQL script in Supabase SQL Editor:
```bash
backend/EquathoraBackend/setup_storage.sql
```

## Storage Policies

The storage policies are set up to:
- Allow authenticated users to upload/update their own avatars
- Allow public read access (anyone can view avatars)
- 5MB file size limit enforced in the frontend

## Features Included

### 1. Avatar Upload
- Click on avatar to change
- Supports: JPG, PNG, GIF, WebP
- Max size: 5MB
- Shows preview before saving
- Stored in Supabase Storage

### 2. Profile Fields
- **Full Name** (required)
- **Username** (required, 3-20 chars, alphanumeric + underscores)
- **Bio** (optional, max 200 chars with counter)
- **Location** (optional, City/Country)
- **Website** (optional, must be valid URL)

### 3. Form Validation
- Required field validation
- Username pattern matching
- URL validation for website
- File size validation
- Real-time character counter for bio

### 4. User Experience
- Smooth modal animations (framer-motion)
- Loading states during save
- Error messages for failed uploads
- Preview before save
- Cancel without saving

## How to Test

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to your profile:**
   - Login to your account
   - Go to Profile page (usually `/profile/myprofile`)

3. **Click "Edit Profile" button**

4. **Test Features:**
   - Upload a new avatar
   - Edit your name/username
   - Add a bio
   - Add location
   - Add website URL
   - Click "Save Changes"

## Data Storage

Profile data is stored in Supabase Auth user metadata:
```javascript
{
  full_name: "John Doe",
  preferred_username: "johndoe",
  bio: "Math enthusiast",
  location: "New York, USA",
  website: "https://johndoe.com",
  avatar_url: "https://[project].supabase.co/storage/v1/object/public/user-avatars/avatars/[userId]_[timestamp].jpg"
}
```

## Important Notes

1. **Avatar Storage:** Avatars are stored in Supabase Storage, not in the database
2. **User Metadata:** All other profile data is stored in Auth user metadata
3. **Public Avatars:** Avatar URLs are public (anyone can view them)
4. **Automatic Refresh:** Profile updates immediately after saving
5. **Fallback Image:** If no avatar, shows default guest avatar

## Troubleshooting

### Error: "Failed to upload avatar"
- Check if storage bucket is created
- Verify bucket is set to public
- Check file size (must be under 5MB)

### Error: "Please log in to edit your profile"
- User is not authenticated
- Check Supabase session

### Avatar not showing after upload
- Check browser console for errors
- Verify storage policies are set correctly
- Check if bucket is public

## Next Steps

To mark this task as complete in ToDo.txt:
```
[✓] Fix Profile Editing
    ✓ Make "Edit Profile" button functional
    ✓ Allow avatar/profile picture changes
    ✓ Add bio/personal information editing
    ✓ Save changes to database
```

## Additional Features (Future)

Consider adding:
- [ ] Crop/resize avatar before upload
- [ ] Multiple avatar uploads (gallery)
- [ ] Social media links
- [ ] Email notification preferences
- [ ] Privacy settings (public/private profile)
- [ ] Profile visibility settings
