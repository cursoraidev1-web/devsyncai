# 🔐 DevSync AI - User Credentials & Access Levels

## 🎭 All User Accounts

### 1️⃣ **Admin Account** 
**Full System Access - Requires MFA**

```
Email:    admin@devsync.ai
Password: admin123
MFA Code: 123456
Role:     Administrator
Access:   Full system access (all pages)
```

**Permissions:**
- ✅ All pages accessible
- ✅ User management
- ✅ System configuration
- ✅ Security settings
- ✅ Team management
- ✅ Analytics and reporting

---

### 2️⃣ **Product Owner Account**
**Product & Strategy Focus - Requires MFA**

```
Email:    po@devsync.ai
Password: po123
MFA Code: 123456
Role:     Product Owner
Access:   Product, Analytics, Team
```

**Permissions:**
- ✅ Dashboard (with PRD compliance)
- ✅ PRD Designer (full access)
- ✅ Documentation
- ✅ Analytics (full reports)
- ✅ Team management
- ✅ Notifications
- ✅ Settings
- ⚠️ Limited: Dev Insights (read-only)
- ⚠️ Limited: CI/CD (monitoring only)

**Primary Pages:**
- PRD Designer
- Dashboard (Product Owner view)
- Analytics
- Team

---

### 3️⃣ **Product Manager Account**
**Product Planning & Coordination**

```
Email:    pm@devsync.ai
Password: pm123
Role:     Product Manager
Access:   Strategy & Planning
```

**Permissions:**
- ✅ Dashboard
- ✅ PRD Designer
- ✅ Documentation
- ✅ Analytics
- ✅ Team (view only)
- ✅ Notifications
- ✅ Settings
- ⚠️ Limited: Dev tools (read-only)

**Primary Pages:**
- PRD Designer
- Analytics
- Documentation
- Dashboard

---

### 4️⃣ **Frontend Developer Account**
**Frontend Development Focus**

```
Email:    frontend@devsync.ai
Password: dev123
Role:     Developer
Access:   Development tools
```

**Permissions:**
- ✅ Dashboard
- ✅ Development Insights (full access)
- ✅ CI/CD Pipeline (full access)
- ✅ Documentation
- ✅ PRD Designer (read-only)
- ✅ Security (view vulnerabilities)
- ✅ Integrations (GitHub, etc.)
- ✅ Notifications
- ✅ Settings

**Primary Pages:**
- Development Insights
- CI/CD Pipeline
- Documentation

---

### 5️⃣ **Backend Developer Account**
**Backend Development Focus**

```
Email:    backend@devsync.ai
Password: dev123
Role:     Developer
Access:   Development tools
```

**Permissions:**
- ✅ Dashboard
- ✅ Development Insights (full access)
- ✅ CI/CD Pipeline (full access)
- ✅ Documentation
- ✅ PRD Designer (read-only)
- ✅ Security (view & fix)
- ✅ Integrations (full access)
- ✅ Notifications
- ✅ Settings

**Primary Pages:**
- Development Insights
- CI/CD Pipeline
- Security

---

### 6️⃣ **QA Engineer Account**
**Quality Assurance & Testing**

```
Email:    qa@devsync.ai
Password: qa123
Role:     QA Engineer
Access:   Testing & Quality
```

**Permissions:**
- ✅ Dashboard
- ✅ CI/CD Pipeline (test results)
- ✅ Development Insights (bugs)
- ✅ PRD Designer (requirements)
- ✅ Security (vulnerability testing)
- ✅ Documentation
- ✅ Notifications
- ✅ Settings
- ⚠️ Limited: Analytics (QA metrics only)

**Primary Pages:**
- CI/CD Pipeline
- Development Insights
- Security
- PRD Designer

---

### 7️⃣ **Designer Account**
**UX/UI Design Focus**

```
Email:    designer@devsync.ai
Password: design123
Role:     Designer
Access:   Design & Documentation
```

**Permissions:**
- ✅ Dashboard
- ✅ PRD Designer (design specs)
- ✅ Documentation (design assets)
- ✅ Integrations (Figma)
- ✅ Notifications
- ✅ Settings
- ⚠️ Limited: Dev tools (read-only)

**Primary Pages:**
- PRD Designer
- Documentation
- Integrations (Figma)

---

### 8️⃣ **DevOps Engineer Account**
**Infrastructure & Deployment**

```
Email:    devops@devsync.ai
Password: devops123
Role:     DevOps Engineer
Access:   Infrastructure & CI/CD
```

**Permissions:**
- ✅ Dashboard
- ✅ CI/CD Pipeline (full control)
- ✅ Development Insights
- ✅ Security (infrastructure)
- ✅ Integrations (AWS, etc.)
- ✅ Analytics (performance)
- ✅ Documentation
- ✅ Notifications
- ✅ Settings

**Primary Pages:**
- CI/CD Pipeline
- Security
- Integrations
- Analytics

---

### 9️⃣ **Security Engineer Account**
**Security & Compliance - Requires MFA**

```
Email:    security@devsync.ai
Password: security123
MFA Code: 123456
Role:     Security Engineer
Access:   Security & Compliance
```

**Permissions:**
- ✅ Dashboard
- ✅ Security (full access)
- ✅ CI/CD Pipeline (security scans)
- ✅ Development Insights (security issues)
- ✅ Integrations (security tools)
- ✅ Analytics (security metrics)
- ✅ Team (security roles)
- ✅ Documentation
- ✅ Notifications
- ✅ Settings

**Primary Pages:**
- Security Dashboard
- CI/CD Pipeline
- Development Insights
- Analytics

---

## 🔒 MFA (Multi-Factor Authentication)

### Accounts with MFA Enabled:
1. **Admin** - MFA Required
2. **Product Owner** - MFA Required
3. **Security Engineer** - MFA Required

### MFA Code for Demo:
```
Code: 123456
```

When logging in with these accounts, you'll be redirected to the MFA verification page after entering correct credentials.

---

## 🚀 Quick Login Guide

### On Login Page:
1. Use the quick login buttons at the bottom
2. Or manually enter email and password
3. If MFA is required, enter code `123456`
4. You'll be redirected to the dashboard

### To Test Different Roles:
1. Logout (click on user profile in top-right)
2. Login with different credentials
3. Explore role-specific access and features

---

## 📊 Access Matrix

| Feature | Admin | PO | PM | Dev | QA | Designer | DevOps | Security |
|---------|-------|----|----|-----|----|---------|---------|---------  |
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PRD Designer | ✅ | ✅ | ✅ | 👁️ | ✅ | ✅ | 👁️ | 👁️ |
| Documentation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dev Insights | ✅ | 👁️ | 👁️ | ✅ | ✅ | 👁️ | ✅ | ✅ |
| CI/CD Pipeline | ✅ | 👁️ | 👁️ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Security | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Analytics | ✅ | ✅ | ✅ | 👁️ | 👁️ | ❌ | ✅ | ✅ |
| Integrations | ✅ | 👁️ | 👁️ | ✅ | 👁️ | ✅ | ✅ | ✅ |
| Team | ✅ | ✅ | 👁️ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Settings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Full Access
- 👁️ Read-Only Access
- ❌ No Access

---

## 🔐 Security Features Implemented

### ✅ Authentication
- Email/password login
- Session management (localStorage)
- Protected routes (cannot access pages without login)
- Automatic redirect to login page

### ✅ Multi-Factor Authentication (MFA)
- 6-digit verification code
- Required for Admin, Product Owner, Security roles
- Separate verification page
- Session persists after MFA

### ✅ Authorization
- Role-based access control
- Protected routes check authentication
- Access denied page for unauthorized access
- User role displayed in header

### ✅ Session Management
- Persistent sessions (stored in localStorage)
- Logout functionality (clears session)
- Automatic session restoration on page reload

### ✅ Signup
- New account creation
- Email uniqueness validation
- Password confirmation
- Role and department selection

---

## 🧪 Testing Authentication

### Test Login Flow:
```bash
1. Try accessing http://localhost:5173/ directly
   → Should redirect to /login

2. Login with: po@devsync.ai / po123
   → Should show MFA page
   → Enter: 123456
   → Should redirect to dashboard

3. Try accessing protected pages
   → Should work (authenticated)

4. Logout (click user profile)
   → Should redirect to login
   → Cannot access pages without login
```

### Test Signup Flow:
```bash
1. Go to /signup
2. Fill in form:
   - Name: Test User
   - Email: test@company.com
   - Password: test123
   - Confirm: test123
   - Role: Developer
   - Department: Engineering
3. Submit
4. Redirects to login with success message
5. Login with new credentials
```

---

## 📝 Notes

1. **Demo Mode**: All accounts are pre-configured in the AuthContext
2. **Passwords**: Stored in plain text for demo (use hashing in production)
3. **MFA**: Uses static code `123456` for demo (use TOTP in production)
4. **Sessions**: Stored in localStorage (use httpOnly cookies in production)
5. **API**: Replace with real backend API calls in production

---

## 🚀 Ready for Production?

### To Make Production-Ready:
1. ✅ Connect to real authentication API
2. ✅ Implement proper password hashing (bcrypt)
3. ✅ Use JWT tokens with httpOnly cookies
4. ✅ Implement real TOTP-based MFA (Google Authenticator)
5. ✅ Add password reset functionality
6. ✅ Add email verification
7. ✅ Implement rate limiting
8. ✅ Add session timeout
9. ✅ Use secure token storage
10. ✅ Add audit logging

---

**All authentication and authorization features are now fully functional!** 🎉
