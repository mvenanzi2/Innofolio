# Deployment Guide for innofolio.app

## Overview
This guide will help you deploy Innofolio to production using your domain: **innofolio.app**

## Architecture
- **Frontend**: innofolio.app (React/Vite app)
- **Backend API**: api.innofolio.app (Express/Node.js server)
- **Database**: PostgreSQL (hosted separately)

## Prerequisites
- Domain configured: innofolio.app
- Hosting service account (Vercel, Netlify, Render, Railway, etc.)
- PostgreSQL database (can be provided by hosting service)

---

## Option 1: Deploy with Render (Recommended - All-in-One)

### Step 1: Deploy Backend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: innofolio-api
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     DATABASE_URL=<your-postgres-connection-string>
     JWT_SECRET=<generate-a-secure-random-string>
     NODE_ENV=production
     FRONTEND_URL=https://innofolio.app
     PORT=3000
     ```

5. Create a PostgreSQL database on Render:
   - Click "New +" → "PostgreSQL"
   - Copy the Internal Database URL
   - Use it as your `DATABASE_URL`

6. After deployment, note your backend URL (e.g., `https://innofolio-api.onrender.com`)

7. Set up custom domain:
   - In your web service settings, add custom domain: `api.innofolio.app`
   - Add CNAME record in your DNS:
     - Type: CNAME
     - Name: api
     - Value: <your-render-url>

### Step 2: Deploy Frontend
1. In Render, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: innofolio-frontend
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://api.innofolio.app
     ```

4. Set up custom domain:
   - Add custom domain: `innofolio.app`
   - Add DNS records:
     - Type: A
     - Name: @
     - Value: <render-ip-address>
     - Type: CNAME
     - Name: www
     - Value: innofolio.app

---

## Option 2: Deploy with Vercel (Frontend) + Railway (Backend)

### Backend on Railway
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add PostgreSQL database from Railway marketplace
5. Configure environment variables (same as above)
6. Set root directory to `server`
7. Add custom domain: `api.innofolio.app`

### Frontend on Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Environment Variables**:
     ```
     VITE_API_URL=https://api.innofolio.app
     ```
4. Add custom domain: `innofolio.app`

---

## Post-Deployment Steps

### 1. Run Database Migrations
After deploying the backend, run migrations:
```bash
# SSH into your server or use the hosting platform's console
cd server
npx prisma migrate deploy
```

### 2. Update iOS App
When ready to deploy the iOS app, update the API URL in:
`ios-app/Innofolio/Services/APIService.swift`
```swift
private let baseURL = "https://api.innofolio.app"
```

### 3. Set Up Email Service (Optional but Recommended)
For password reset emails, integrate a service like:
- **SendGrid**: Free tier available
- **AWS SES**: Pay as you go
- **Mailgun**: Free tier available

Update `server/src/utils/email.ts` with your email service credentials.

### 4. Configure CORS (if needed)
If you encounter CORS issues, add this to your server:

```typescript
// server/src/server.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## DNS Configuration Summary

### For innofolio.app:
| Type  | Name | Value                          |
|-------|------|--------------------------------|
| A     | @    | <hosting-provider-ip>          |
| CNAME | www  | innofolio.app                  |
| CNAME | api  | <backend-hosting-url>          |

---

## Environment Variables Reference

### Frontend (.env.production)
```env
VITE_API_URL=https://api.innofolio.app
```

### Backend (.env)
```env
DATABASE_URL=<your-postgres-connection-string>
JWT_SECRET=<secure-random-string>
NODE_ENV=production
FRONTEND_URL=https://innofolio.app
PORT=3000
```

---

## Testing Your Deployment

1. Visit https://innofolio.app
2. Create a test account
3. Test password reset (check server logs for reset link if email not configured)
4. Create an idea
5. Test all features

---

## Troubleshooting

### API calls failing
- Check that `VITE_API_URL` is set correctly
- Verify CORS is configured on backend
- Check browser console for errors

### Database connection issues
- Verify `DATABASE_URL` is correct
- Ensure database migrations have run
- Check database is accessible from your hosting provider

### Password reset not working
- Check server logs for the reset link
- Verify `FRONTEND_URL` environment variable is set
- Consider setting up an email service

---

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use HTTPS for all connections
- [ ] Set up proper CORS configuration
- [ ] Enable rate limiting on API endpoints
- [ ] Set up database backups
- [ ] Configure environment variables (never commit .env files)
- [ ] Review and update `.gitignore` to exclude sensitive files

---

## Need Help?

- Check hosting provider documentation
- Review application logs
- Test locally first with production environment variables
