# Supabase Storage Setup Guide

This guide provides detailed instructions for setting up Supabase Storage for file uploads in the ZynDrx platform.

## Table of Contents

- [Why Supabase?](#why-supabase)
- [Step-by-Step Setup](#step-by-step-setup)
- [Bucket Configuration](#bucket-configuration)
- [Storage Policies](#storage-policies)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Why Supabase?

Supabase Storage provides:
- ✅ Easy file upload/download
- ✅ Built-in CDN for fast file delivery
- ✅ Secure access control via policies
- ✅ Generous free tier (1GB storage, 2GB bandwidth)
- ✅ Simple integration with React applications

---

## Step-by-Step Setup

### Step 1: Create Supabase Account and Project

1. **Sign Up**: Go to [https://supabase.com](https://supabase.com) and create an account
2. **Create Project**: Click "New Project"
3. **Fill Details**:
   - **Name**: `zyndrx-storage` (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Select the region closest to your users
   - **Pricing Plan**: Start with Free tier
4. **Wait**: Project creation takes 1-2 minutes

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy the following values:
   - **Project URL** → Use as `REACT_APP_SUPABASE_URL`
   - **anon public** key → Use as `REACT_APP_SUPABASE_ANON_KEY`

   Example:
   ```
   REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Create Storage Bucket

1. In the Supabase dashboard, click **Storage** in the sidebar
2. Click **New bucket** button
3. Fill in the form:
   - **Name**: `documents` (or `zyndrx-files`)
   - **Public bucket**: ✅ **Check this** if you want files to be publicly accessible
     - ⚠️ **Note**: If unchecked, you'll need to generate signed URLs for access
   - **File size limit**: Set based on your needs
     - Default: `50MB` (good for most documents)
     - You can set higher (e.g., `100MB`) or lower as needed
   - **Allowed MIME types**: 
     - Leave **empty** to allow all file types, OR
     - Specify types: `application/pdf,image/*,text/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`
4. Click **Create bucket**

### Step 4: Configure Storage Policies

Storage policies control who can read, write, and delete files. You need to set these up in the Supabase SQL Editor.

1. In the Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **New query**
3. Paste and run the following policies (adjust as needed):

#### Option A: Authenticated Users Only (Recommended)

```sql
-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Policy 2: Allow authenticated users to read files
CREATE POLICY "Authenticated users can read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Policy 3: Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
```

#### Option B: Public Read, Authenticated Write

If your bucket is public and you want anyone to read but only authenticated users to write:

```sql
-- Policy 1: Allow public to read files
CREATE POLICY "Public can read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Policy 2: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Policy 3: Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
```

#### Option C: User-Specific Folders

If you want users to only access their own files:

```sql
-- Policy 1: Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can read their own files
CREATE POLICY "Users can read own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Note**: If you use Option C, you'll need to structure file paths as `{userId}/{filename}` in your upload code.

### Step 5: Install Supabase Client Library

The Supabase client is already in `package.json`, but if you need to install it manually:

```bash
npm install @supabase/supabase-js
```

### Step 6: Configure Environment Variables

1. In your project root, open or create `.env` file
2. Add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Important**: Restart your development server after changing `.env` file:
   ```bash
   # Stop the server (Ctrl+C)
   npm start
   ```

### Step 7: Verify Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Log in to your application
3. Navigate to the **Document Store** page
4. Try uploading a test file
5. Check your Supabase dashboard:
   - Go to **Storage** → Your bucket
   - You should see the uploaded file

---

## Bucket Configuration

### Recommended Settings

- **Bucket Name**: `documents` or `zyndrx-files`
- **Public**: ✅ Yes (for easier access) or ❌ No (more secure, requires signed URLs)
- **File Size Limit**: `50MB` (adjust based on your needs)
- **Allowed MIME Types**: Leave empty (allows all types)

### Multiple Buckets

You can create multiple buckets for different purposes:

- `documents` - For project documents
- `attachments` - For task/handoff attachments
- `images` - For images only
- `templates` - For document templates

Each bucket needs its own policies.

---

## Storage Policies Explained

### Policy Structure

```sql
CREATE POLICY "policy_name"
ON storage.objects
FOR operation
TO role
USING/WITH CHECK (condition);
```

- **policy_name**: A descriptive name for the policy
- **operation**: `INSERT`, `SELECT`, `UPDATE`, or `DELETE`
- **role**: `authenticated`, `public`, or specific user
- **condition**: SQL condition that must be met

### Common Patterns

**Allow all authenticated users:**
```sql
TO authenticated
USING (bucket_id = 'documents')
```

**Allow public access:**
```sql
TO public
USING (bucket_id = 'documents')
```

**Restrict to user's own files:**
```sql
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
```

**Restrict by file extension:**
```sql
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.extension(name)) = 'pdf'
)
```

---

## Testing

### Test File Upload

1. **Via Application UI**:
   - Go to Document Store page
   - Click "Upload Document"
   - Select a file
   - Submit

2. **Via Browser Console** (for debugging):
   ```javascript
   import { uploadFile } from './src/utils/supabase';
   
   const file = new File(['test'], 'test.txt', { type: 'text/plain' });
   uploadFile(file, 'documents', 'test/test.txt')
     .then(result => console.log('Uploaded:', result))
     .catch(error => console.error('Error:', error));
   ```

### Test File Download

Files uploaded to public buckets can be accessed directly via URL:
```
https://{project-id}.supabase.co/storage/v1/object/public/{bucket-name}/{file-path}
```

### Check Upload Status

1. Go to Supabase dashboard
2. Navigate to **Storage** → Your bucket
3. You should see uploaded files
4. Click on a file to see details (size, uploaded date, etc.)

---

## Troubleshooting

### Issue: "Supabase not configured" Error

**Symptoms**: Console shows warning about Supabase credentials

**Solutions**:
1. Check `.env` file has both variables:
   ```
   REACT_APP_SUPABASE_URL=...
   REACT_APP_SUPABASE_ANON_KEY=...
   ```
2. Ensure variables start with `REACT_APP_`
3. Restart development server after changing `.env`
4. Clear browser cache and reload

### Issue: "Permission denied" when uploading

**Symptoms**: Upload fails with permission/403 error

**Solutions**:
1. Check bucket policies are set correctly
2. Verify you're using the correct bucket name in code
3. Ensure user is authenticated (logged in)
4. Check if bucket is public or private matches your policy

### Issue: Files not appearing in bucket

**Symptoms**: Upload seems successful but files don't show in dashboard

**Solutions**:
1. Refresh the Supabase dashboard
2. Check browser console for actual errors
3. Verify bucket name matches exactly (case-sensitive)
4. Check network tab to see if request actually succeeded

### Issue: CORS Errors

**Symptoms**: Browser console shows CORS-related errors

**Solutions**:
- Supabase handles CORS automatically, but if you see issues:
  1. Check your Supabase project settings
  2. Verify the URL is correct (no trailing slash)
  3. Ensure you're using the `anon` key, not the `service_role` key

### Issue: "Module not found: @supabase/supabase-js"

**Symptoms**: Build/start fails with module error

**Solutions**:
```bash
npm install @supabase/supabase-js
```

### Issue: Large file uploads failing

**Symptoms**: Small files work but large files fail

**Solutions**:
1. Check bucket file size limit in Supabase dashboard
2. Increase the limit if needed
3. Consider implementing chunked uploads for very large files (>100MB)

### Issue: Files uploaded but not accessible

**Symptoms**: Files exist in bucket but URLs return 404 or access denied

**Solutions**:
1. Check if bucket is marked as "Public"
2. If private, you need to generate signed URLs
3. Verify storage policies allow SELECT operations
4. Check file path is correct

---

## Best Practices

1. **Bucket Naming**: Use descriptive, lowercase names with hyphens
2. **File Organization**: Organize files in folders (e.g., `project-123/document.pdf`)
3. **File Naming**: Include timestamps or UUIDs to avoid conflicts
4. **Size Limits**: Set reasonable limits based on your use case
5. **Security**: Use authenticated policies unless files need to be public
6. **Monitoring**: Regularly check storage usage in Supabase dashboard
7. **Cleanup**: Implement file deletion when records are deleted

---

## Advanced Configuration

### Using Signed URLs for Private Files

If your bucket is private, you'll need to generate signed URLs:

```javascript
import { supabase } from './utils/supabase';

const getSignedUrl = async (bucketName, filePath, expiresIn = 3600) => {
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);
  
  if (error) throw error;
  return data.signedUrl;
};
```

### Setting Up RLS (Row Level Security)

For more advanced security, you can enable RLS on the storage.objects table:

1. Go to Supabase dashboard → Storage → Policies
2. Enable RLS if not already enabled
3. Create specific policies based on your needs

### Custom File Paths

Structure your file paths for better organization:

```javascript
// Example: project-{id}/documents/{timestamp}-{filename}
const filePath = `project-${projectId}/documents/${Date.now()}-${file.name}`;

// Example: user-{id}/uploads/{year}/{month}/{filename}
const date = new Date();
const filePath = `user-${userId}/uploads/${date.getFullYear()}/${date.getMonth() + 1}/${file.name}`;
```

---

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

For ZynDrx-specific issues:
- Check the main README.md
- Review BACKEND_REQUIREMENTS.md
- Contact the development team

---

**Last Updated**: Based on Supabase Storage v2.38.4


