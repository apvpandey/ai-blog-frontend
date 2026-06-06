# BlogFlow - Blog Management App

A React.js + Tailwind CSS blog management application with user and admin roles.

## Tech Stack
- React.js 18
- React Router DOM v6
- Tailwind CSS
- Context API (state management)
- LocalStorage (data persistence)

## Admin Credentials
```
Name:  Admin
Phone: 9999999999
```

## Setup Instructions

### Step 1: Install Node.js
Download and install Node.js (v16+) from https://nodejs.org

### Step 2: Install dependencies
Open terminal in the `blog-app` folder and run:
```bash
npm install
```

Then install Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
```

### Step 3: Start the app
```bash
npm start
```

The app will open at http://localhost:3000

---

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | User Login/Register | Public |
| `/admin-login` | Admin Login | Public |
| `/create-blog` | User Blog Dashboard | Logged-in users |
| `/admin-dashboard` | Admin Dashboard | Admin only |

## Features
- User registration with auto-generated 5-digit ID
- Login by name
- Create / Edit / Delete own blogs
- Admin can view all users and delete any blog
- Protected routes
- LocalStorage persistence
