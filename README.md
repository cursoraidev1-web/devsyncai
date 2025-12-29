# 🚀 ZynDrx Platform - Frontend

**Project Management & Development Coordination Platform**

A comprehensive React-based frontend application for managing projects, tasks, documents, and team collaboration across multiple roles (PM, Developer, QA, DevOps).

---

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Supabase Setup](#supabase-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Development Guide](#development-guide)

---

## ✨ Features

### Core Features
- ✅ **Authentication System** - Login, Registration, 2FA, Password Reset
- ✅ **Role-Based Dashboards** - Custom views for PM, Developer, QA, DevOps
- ✅ **Project Management** - Create, view, and manage projects
- ✅ **Task Tracker** - Kanban board with drag-and-drop functionality
- ✅ **PRD Designer** - Collaborative workspace for product requirements
- ✅ **Document Store** - File upload/download with Supabase integration
- ✅ **Team Management** - Invite members, manage teams
- ✅ **Handoff System** - Workflow transitions between team members
- ✅ **CI/CD Integration** - Track pipelines, deployments, and commits
- ✅ **Analytics** - Project metrics and team performance
- ✅ **Notifications** - Real-time alerts and updates
- ✅ **Integrations** - GitHub, Slack, Jira, Figma support
- ✅ **Activity Feed** - Track all project activities

### Technical Features
- ⚛️ React 18.2 (No TypeScript)
- 🎨 Modern UI with Lucide React icons
- 🔐 JWT-based authentication
- 📱 Responsive design
- 🔄 Context API for state management
- 🌐 React Router v6 for navigation
- 📦 File uploads via Supabase Storage
- 🔔 Toast notifications
- 🎯 Role-based access control

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** (v7 or higher) or **yarn**
- **Git**
- **Supabase Account** (for file storage)
- **Backend API** (your ZynDrx backend server)

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd zyndrx2
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- React Router
- Lucide React (icons)
- React Toastify
- Supabase JS (for file uploads)
- Other utilities

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration (see [Environment Variables](#environment-variables) section).

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API Configuration
REACT_APP_API_URL=https://your-backend-url.com/api/v1

# Supabase Configuration (for file uploads)
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth (optional)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# GitHub OAuth (optional)
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
```

**Note:** The `REACT_APP_` prefix is required for Create React App to expose these variables to your application.

---

## 🔐 Supabase Setup

Supabase is used for file storage (document uploads, attachments, etc.). Follow these steps to set up Supabase:

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Your project name (e.g., "zyndrx-storage")
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"

### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → This is your `REACT_APP_SUPABASE_URL`
   - **anon/public key** → This is your `REACT_APP_SUPABASE_ANON_KEY`

### Step 3: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Create a bucket with the following settings:
   - **Name**: `documents` (or any name you prefer)
   - **Public bucket**: ✅ Check this if you want public access to files
   - **File size limit**: Set according to your needs (e.g., 50MB)
   - **Allowed MIME types**: Leave empty for all types, or specify (e.g., `application/pdf,image/*,text/*`)

4. Click **Create bucket**

### Step 4: Configure Bucket Policies

For the bucket to work properly, you need to set up storage policies:

1. Go to **Storage** → Your bucket → **Policies**
2. Click **New Policy**
3. Create policies for your use case:

#### Policy 1: Allow Authenticated Users to Upload

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');
```

#### Policy 2: Allow Authenticated Users to Read

```sql
-- Allow authenticated users to read files
CREATE POLICY "Users can read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents');
```

#### Policy 3: Allow Users to Delete Their Own Files (Optional)

```sql
-- Allow users to delete files they uploaded
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
```

#### Policy 4: Allow Public Read Access (if bucket is public)

```sql
-- Allow public read access
CREATE POLICY "Public can read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');
```

**Note:** If you're using RLS (Row Level Security), you may need to adjust these policies based on your specific requirements.

### Step 5: Update Environment Variables

Add your Supabase credentials to your `.env` file:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 6: Install Supabase Client (if not already installed)

The Supabase client is already included in `package.json`, but if you need to reinstall:

```bash
npm install @supabase/supabase-js
```

### Step 7: Verify Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to the Document Store page
3. Try uploading a file
4. Check your Supabase Storage dashboard to verify the file was uploaded

### Troubleshooting Supabase Issues

**Problem: "Supabase not configured" error**
- Solution: Verify your `.env` file has the correct `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

**Problem: "Permission denied" when uploading**
- Solution: Check your bucket policies. Ensure authenticated users can INSERT files

**Problem: Files not appearing in bucket**
- Solution: 
  - Check browser console for errors
  - Verify the bucket name matches what's used in code
  - Check network tab to see if the request is being made

**Problem: "CORS error"**
- Solution: Supabase handles CORS automatically, but if you see issues, check your Supabase project settings

---

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

This will:
- Start the development server
- Open [http://localhost:3000](http://localhost:3000) in your browser
- Enable hot module replacement (HMR)
- Show linting errors in the console

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Serve Production Build Locally

```bash
# Install serve globally (one-time)
npm install -g serve

# Serve the build
serve -s build
```

### Running Tests

```bash
npm test
```

---

## 📁 Project Structure

```
zyndrx2/
├── public/                 # Static files
│   ├── index.html
│   └── banner-bg.jpg
├── src/
│   ├── api/               # API client functions
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── projects.js    # Project endpoints
│   │   ├── tasks.js       # Task endpoints
│   │   ├── documents.js   # Document endpoints
│   │   ├── prds.js        # PRD endpoints
│   │   ├── teams.js       # Team endpoints
│   │   ├── handoffs.js    # Handoff endpoints
│   │   ├── integrations.js # Integration endpoints
│   │   ├── cicd.js        # CI/CD endpoints
│   │   ├── analytics.js   # Analytics endpoints
│   │   ├── activity.js    # Activity feed endpoints
│   │   ├── feedback.js    # Feedback endpoints
│   │   ├── notifications.js # Notification endpoints
│   │   ├── subscription.js # Subscription endpoints
│   │   └── client.js      # Base API client
│   ├── components/        # Reusable components
│   │   ├── ui/            # UI components (Button, Card, Modal, etc.)
│   │   ├── layout/        # Layout components
│   │   ├── Header.js      # App header
│   │   ├── Sidebar.js     # Navigation sidebar
│   │   └── Layout.js      # Main layout wrapper
│   ├── context/           # React Context providers
│   │   ├── AuthContext.js # Authentication state
│   │   ├── AppContext.js  # Application state
│   │   ├── CompanyContext.js # Company/workspace state
│   │   └── PlanContext.js # Subscription/plan state
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboards/    # Role-based dashboards
│   │   └── *.js           # Feature pages
│   ├── utils/             # Utility functions
│   │   ├── supabase.js    # Supabase file upload utilities
│   │   └── oauth.js       # OAuth helpers
│   ├── styles/            # Global styles
│   ├── design-system/     # Design system tokens
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Example environment file
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

---

## 🔌 API Integration

### Backend API Requirements

The frontend expects a REST API with the following base URL structure:
- Base URL: Configured via `REACT_APP_API_URL`
- Expected format: `{REACT_APP_API_URL}/api/v1`

### API Response Format

All API endpoints should return responses in this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

For errors:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Optional detailed message"
}
```

### Authentication

The API uses JWT token-based authentication:
- Token is stored in `localStorage` as `zyndrx_token`
- Token is sent in the `Authorization` header: `Bearer {token}`
- On 401 responses, the user is automatically logged out and redirected to login

### Available API Modules

All API functions are located in `src/api/`:

- **Authentication**: Login, register, logout, 2FA, password reset
- **Projects**: CRUD operations, members, invitations
- **Tasks**: CRUD operations, status updates
- **Documents**: CRUD, file upload/download
- **PRDs**: CRUD, versions, sections, assignees
- **Teams**: CRUD, members, invitations
- **Handoffs**: CRUD, approve/reject, comments
- **Integrations**: Connect/disconnect, OAuth callbacks
- **CI/CD**: Pipelines, deployments, commits, metrics
- **Analytics**: Project metrics, KPIs, reports
- **Activity**: Activity feed
- **Feedback**: Submit and manage feedback
- **Notifications**: List, mark read
- **Subscription**: Plans, limits, upgrades

See `BACKEND_REQUIREMENTS.md` for detailed endpoint documentation.

---

## 🔧 Development Guide

### Adding a New API Endpoint

1. Create or update the appropriate file in `src/api/`
2. Use the base `api` client from `client.js`
3. Handle response structure: `response?.data || response`
4. Export the function

Example:

```javascript
// src/api/example.js
import { api } from './client';

export const fetchExamples = () => {
  return api.get('/examples').then(response => {
    const examplesData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(examplesData) ? examplesData : [];
  });
};
```

### Adding a New Page

1. Create a new file in `src/pages/`
2. Import necessary components and hooks
3. Add the route in `src/App.js`
4. Optionally add to navigation in `src/components/Sidebar.js`

### Using Supabase for File Uploads

```javascript
import { uploadFile } from '../utils/supabase';

const handleFileUpload = async (file) => {
  try {
    const bucketName = 'documents';
    const filePath = `project-${projectId}/${Date.now()}-${file.name}`;
    
    const { url, path } = await uploadFile(file, bucketName, filePath);
    
    // Use the URL or path as needed
    console.log('File uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### State Management

The app uses React Context API for state management:

- **AuthContext**: User authentication state
- **AppContext**: Projects, tasks, documents, notifications
- **CompanyContext**: Current company/workspace
- **PlanContext**: Subscription and plan limits

Access contexts using hooks:

```javascript
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const MyComponent = () => {
  const { user, token } = useAuth();
  const { projects, tasks, loadProjects } = useApp();
  // ...
};
```

---

## 🐛 Troubleshooting

### Common Issues

**Problem: "Network error" when making API calls**
- Solution: Check that `REACT_APP_API_URL` is correctly set in `.env`
- Verify the backend server is running and accessible
- Check CORS settings on the backend

**Problem: "Supabase not configured" error**
- Solution: Ensure `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set in `.env`
- Restart the development server after changing `.env` file

**Problem: Files not uploading to Supabase**
- Solution: 
  - Verify bucket name matches in code
  - Check bucket policies allow INSERT operations
  - Check browser console for specific error messages

**Problem: Authentication token expired**
- Solution: The app should handle this automatically. If not, clear `localStorage` and log in again

**Problem: Build fails with "Module not found"**
- Solution: Run `npm install` to ensure all dependencies are installed
- Check that all imports are correct

**Problem: Page not found after navigation**
- Solution: Check that the route is added in `src/App.js`
- Verify the path matches exactly (case-sensitive)

### Getting Help

1. Check the browser console for error messages
2. Check the network tab to see API request/response details
3. Verify environment variables are set correctly
4. Ensure backend API is running and accessible
5. Check `BACKEND_REQUIREMENTS.md` for API endpoint details

---

## 📚 Additional Documentation

- [BACKEND_REQUIREMENTS.md](./BACKEND_REQUIREMENTS.md) - Complete backend API requirements
- [API_REQUIREMENTS.md](./API_REQUIREMENTS.md) - API specification document
- [DESIGN_SYSTEM_README.md](./DESIGN_SYSTEM_README.md) - Design system documentation
- [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) - Feature implementation checklist

---

## 🎯 Next Steps

After setting up the frontend:

1. **Configure Backend**: Ensure your backend API is running and matches the expected endpoints
2. **Set Environment Variables**: Complete your `.env` file with all required values
3. **Set Up Supabase**: Create bucket and configure policies as described above
4. **Test Integration**: Verify API calls work and files can be uploaded
5. **Customize**: Adjust branding, colors, and features as needed

---

## 📝 License

[Your License Here]

---

## 👥 Contributing

[Contributing Guidelines]

---

## 📧 Support

For issues and questions:
- Check the troubleshooting section above
- Review the documentation files
- Contact the development team

---

**Built with ❤️ for the ZynDrx Platform**
