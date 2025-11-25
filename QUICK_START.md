# Zyndrx Platform - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

### 3. Login
Use these demo credentials:
- **Email**: demo@zyndrx.com (or any email)
- **Password**: any password
- **Role**: Select your preferred role from the dropdown

## 📋 Available Roles

Choose from these roles to see different dashboard views:

1. **Product Manager / PM** - Project oversight and PRD management
2. **Developer** - Task tracking and code activity
3. **QA Engineer** - Testing and bug tracking
4. **DevOps Engineer** - Deployment and infrastructure monitoring
5. **Admin** - Full system access

## 🗺️ Navigation Guide

### Main Pages

| Page | Description | Key Features |
|------|-------------|--------------|
| **Dashboard** | Role-specific overview | Stats, recent activity, quick actions |
| **PRD Designer** | Product requirements | Create/edit PRDs, version control, approval |
| **Task Tracker** | Task management | Kanban board, list view, drag-and-drop |
| **Documents** | File repository | Upload, organize, search documents |
| **CI/CD** | Pipeline monitoring | Builds, deployments, commits |
| **Analytics** | Reports & metrics | KPIs, team performance, velocity charts |
| **Notifications** | Activity feed | Task updates, mentions, alerts |
| **Settings** | User preferences | Profile, notifications, security |

## 🎨 UI Components Overview

### Kanban Board (Task Tracker)
- **Drag & Drop**: Move tasks between columns
- **Views**: Switch between Board and List views
- **Filters**: Search and filter by priority
- **Status Columns**: To Do → In Progress → In Review → Completed

### PRD Designer
- **Sidebar**: Browse all PRDs
- **Editor**: Create and edit sections
- **Actions**: Save, approve, delete
- **Status**: Draft, In Review, Approved

### Dashboard Cards
- **Stats**: Key metrics at a glance
- **Projects**: Progress tracking with percentages
- **Tasks**: Recent and assigned tasks
- **Quick Actions**: One-click navigation

## 🎯 Common Workflows

### Create a New Task
1. Go to **Task Tracker**
2. Click **"New Task"** button
3. Fill in task details:
   - Title and description
   - Status, priority, assignee
   - Due date and tags
4. Click **"Create Task"**

### Upload a Document
1. Go to **Documents**
2. Click **"Upload Document"**
3. Enter document details:
   - Name and type
   - Tags for organization
4. Click **"Upload"**

### Create a PRD
1. Go to **PRD Designer**
2. Click **"New PRD"**
3. Enter PRD title and version
4. Edit sections with content
5. Save and request approval

### View CI/CD Status
1. Go to **CI/CD**
2. Switch between tabs:
   - **Pipelines**: Build status
   - **Deployments**: Environment status
   - **Commits**: Code changes
3. Click "Run" to trigger builds

### Check Analytics
1. Go to **Analytics**
2. Select time range (Day/Week/Month)
3. View:
   - KPI cards
   - Project progress
   - Sprint velocity
   - Team performance
4. Export reports

## 💡 Tips & Tricks

### Keyboard Navigation
- Use sidebar navigation for quick page switching
- Click user avatar for quick settings access
- Notification bell shows unread count

### Task Management
- Drag tasks between columns on Kanban board
- Click task cards to view details
- Use priority filters to focus on urgent items

### Document Organization
- Use consistent tagging for easy retrieval
- Switch between Grid and List views based on preference
- Search bar filters in real-time

### Notifications
- Click to mark as read
- Filter by status (All/Unread/Read)
- Delete unwanted notifications

## 🔧 Customization

### Profile Settings
1. Click user avatar → Settings
2. Update profile information
3. Change avatar image
4. Set timezone and language

### Notification Preferences
1. Go to Settings → Notifications
2. Toggle channels (Email, Push)
3. Choose notification types
4. Enable/disable weekly reports

### Appearance
1. Go to Settings → Preferences
2. Choose theme (Light/Dark/Auto)
3. Enable compact mode
4. Configure sidebar behavior

## 📱 Mobile Usage

The platform is fully responsive:
- **Navigation**: Hamburger menu on mobile
- **Tables**: Scrollable on smaller screens
- **Modals**: Full-screen on mobile devices
- **Forms**: Stacked layout for easy input

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port Already in Use
```bash
# Start on different port
PORT=3001 npm start
```

### Login Issues
- Any email and password combination works in demo mode
- Session persists in localStorage
- Clear browser cache if having issues

## 🎓 Next Steps

### For Development
1. Review the code structure in `src/`
2. Understand Context API usage in `context/`
3. Explore page components in `pages/`
4. Check reusable components in `components/`

### For Backend Integration
1. Review `PROJECT_SUMMARY.md` for integration points
2. Replace mock data with API calls
3. Implement authentication endpoints
4. Add file upload functionality
5. Connect to your database

### For Deployment
```bash
# Create production build
npm run build

# Deploy the 'build' folder to your hosting service
```

## 📚 Additional Resources

- **Main README**: See `README.md` for full documentation
- **Project Summary**: See `PROJECT_SUMMARY.md` for technical details
- **Package Info**: See `package.json` for dependencies

## 🆘 Need Help?

The application is designed to be intuitive, but here are quick tips:

- **Stuck?** Check the Dashboard for quick actions
- **Lost?** Use the sidebar to navigate
- **Confused?** Hover over icons for tooltips
- **Need Data?** Demo data is pre-loaded for testing

---

**Enjoy using Zyndrx Platform! 🎉**
