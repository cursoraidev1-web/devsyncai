# ZynDrx Demo Login Credentials

## Overview
This is a **mock authentication system** for demonstration purposes. Any email and password combination will work, but you need to select the appropriate **Role** from the dropdown on the login page to test different access levels.

## Access Levels

### 🔴 Admin Access Level
**Full access to all features**

**Login Details:**
- **Email:** `admin@zyndrx.com` (or any email)
- **Password:** `password` (or any password)
- **Role:** `Admin`

**Access:**
- ✅ All Main Menu items (Dashboard, My Tasks, Projects, Teams)
- ✅ All Product Tools (PRD Designer, Documentation Hub, Handoff System, CI/CD, Integrations)
- ✅ All Settings pages

---

### 🟡 Editor Access Level
**Access to main features and product tools**

**Available Roles:**
- Product Manager (`pm`)
- Product Owner (`product-owner`)
- Developer (`developer`)
- QA Engineer (`qa`)
- DevOps Engineer (`devops`)

**Login Details:**
- **Email:** `[role]@zyndrx.com` (e.g., `developer@zyndrx.com`)
- **Password:** `password` (or any password)
- **Role:** Select from dropdown:
  - `Product Manager`
  - `Product Owner`
  - `Developer`
  - `QA Engineer`
  - `DevOps Engineer`

**Access:**
- ✅ All Main Menu items (Dashboard, My Tasks, Projects, Teams)
- ✅ All Product Tools (PRD Designer, Documentation Hub, Handoff System, CI/CD, Integrations)
- ✅ All Settings pages

**Note:** Each role will see a different dashboard view:
- **Product Manager / Product Owner:** PM Dashboard
- **Developer:** Developer Dashboard
- **QA Engineer:** QA Dashboard
- **DevOps Engineer:** DevOps Dashboard

---

## Quick Demo Credentials

### Admin
```
Email: admin@zyndrx.com
Password: admin123
Role: Admin
```

### Product Manager
```
Email: pm@zyndrx.com
Password: pm123
Role: Product Manager
```

### Developer
```
Email: developer@zyndrx.com
Password: dev123
Role: Developer
```

### QA Engineer
```
Email: qa@zyndrx.com
Password: qa123
Role: QA Engineer
```

### DevOps Engineer
```
Email: devops@zyndrx.com
Password: devops123
Role: DevOps Engineer
```

---

## How to Test Different Roles

1. Go to the **Login** page (`/login`)
2. Enter any email address
3. Enter any password
4. **Select the Role** from the dropdown menu
5. Click "Sign In"

The system will automatically:
- Create a mock user with the selected role
- Store the session in localStorage
- Redirect to the appropriate dashboard based on role
- Show/hide menu items based on access level

---

## Access Level Breakdown

| Feature | Admin | Editor (PM/Dev/QA/etc) | Viewer |
|---------|-------|------------------------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| My Tasks | ✅ | ✅ | ✅ |
| Projects | ✅ | ✅ | ✅ |
| Teams | ✅ | ✅ | ✅ |
| PRD Designer | ✅ | ✅ | ❌ |
| Documentation Hub | ✅ | ✅ | ❌ |
| Handoff System | ✅ | ✅ | ❌ |
| CI/CD Auto-Agent | ✅ | ✅ | ❌ |
| Integrations | ✅ | ✅ | ❌ |
| Settings | ✅ | ✅ | ✅ |
| Support & Help | ✅ | ✅ | ✅ |
| Feedback | ✅ | ✅ | ✅ |

---

## Notes

- **All credentials are mock/demo** - no real authentication is performed
- The role selection determines what features are visible in the sidebar
- Each role gets a different dashboard view optimized for their workflow
- Session persists in browser localStorage until logout
- To test a different role, simply log out and log back in with a different role selected

---

## Testing Tips

1. **Test Admin Access:**
   - Login as Admin
   - Verify all menu items are visible
   - Check that all product tools are accessible

2. **Test Editor Access:**
   - Login as Developer, PM, QA, or DevOps
   - Verify product tools are visible
   - Check that dashboard matches the role

3. **Test Role-Specific Dashboards:**
   - Login as different roles
   - Navigate to `/dashboard`
   - Verify the dashboard content changes based on role

4. **Test Access Control:**
   - Login as different roles
   - Check sidebar menu items
   - Verify that access-restricted pages show appropriate content

