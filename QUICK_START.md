# 🚀 DevSync AI - Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the App
```bash
npm run dev
```

### Step 3: Login
Visit `http://localhost:5173` and use any account:

**Quick Login Options:**

| Role | Email | Password | MFA? |
|------|-------|----------|------|
| **Admin** | admin@devsync.ai | admin123 | Yes (123456) |
| **Product Owner** | po@devsync.ai | po123 | Yes (123456) |
| **Product Manager** | pm@devsync.ai | pm123 | No |
| **Developer** | frontend@devsync.ai | dev123 | No |
| **QA Engineer** | qa@devsync.ai | qa123 | No |
| **Designer** | designer@devsync.ai | design123 | No |
| **DevOps** | devops@devsync.ai | devops123 | No |
| **Security** | security@devsync.ai | security123 | Yes (123456) |

**💡 Tip**: Use the quick login buttons on the login page!

---

## 🔐 Authentication Features

### ✅ What's Protected:
- **Cannot access any page without logging in**
- All routes automatically redirect to `/login`
- Session persists across page reloads
- Logout available (click user profile in header)

### ✅ MFA Enabled for:
- Admin
- Product Owner  
- Security Engineer

**MFA Code**: `123456`

### ✅ Can Create New Accounts:
Go to `/signup` and create your own account!

---

## 📱 Pages Available

Once logged in, you can access:

1. **Dashboard** (`/`) - Main overview
2. **PRD Designer** (`/prd-designer`) - Product requirements
3. **Documentation** (`/documentation`) - Doc library
4. **CI/CD Pipeline** (`/cicd-pipeline`) - Build monitoring
5. **Development Insights** (`/development-insights`) - Commit analysis
6. **Notifications** (`/notifications`) - Role-based alerts
7. **Analytics** (`/analytics`) - Metrics & predictions
8. **Security** (`/security`) - Vulnerability scanning
9. **Integrations** (`/integrations`) - External tools
10. **Settings** (`/settings`) - User preferences
11. **Team** (`/team`) - Member management

---

## 🎯 What to Try

### For Product Owners:
```bash
Login: po@devsync.ai / po123 (MFA: 123456)
Visit: Dashboard, PRD Designer, Analytics
```

### For Developers:
```bash
Login: frontend@devsync.ai / dev123
Visit: Development Insights, CI/CD Pipeline
```

### For QA Engineers:
```bash
Login: qa@devsync.ai / qa123
Visit: CI/CD Pipeline, Security, Dev Insights
```

### For Security Engineers:
```bash
Login: security@devsync.ai / security123 (MFA: 123456)
Visit: Security Dashboard, CI/CD, Analytics
```

---

## 📚 Documentation

- **README.md** - Complete project overview
- **USER_CREDENTIALS.md** - All user accounts and access levels
- **AUTHENTICATION_GUIDE.md** - How authentication works
- **PROJECT_STRUCTURE.md** - Detailed architecture
- **FEATURES_AND_NAVIGATION.md** - Page relationships

---

## 🔧 Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

---

## ❓ Common Questions

**Q: Can I access pages without logging in?**  
A: No! All pages are protected. You must login first.

**Q: What's the MFA code?**  
A: `123456` (for Admin, Product Owner, Security)

**Q: Can I create a new account?**  
A: Yes! Click "Sign up for free" on the login page.

**Q: How do I logout?**  
A: Click your user profile (avatar) in the top-right corner.

**Q: What if I forget my password?**  
A: Use the credentials from USER_CREDENTIALS.md (demo mode)

**Q: Are the pages mobile responsive?**  
A: Yes! Works on mobile, tablet, and desktop.

---

## 🎉 You're Ready!

The app is **fully functional** with:
- ✅ Complete authentication
- ✅ 9 user accounts with different roles
- ✅ MFA for sensitive roles
- ✅ Protected routes (must login)
- ✅ 12 feature-rich pages
- ✅ Mobile responsive
- ✅ Custom CSS design system

**Start exploring!** 🚀
