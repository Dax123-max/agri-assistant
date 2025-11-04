# 🚀 Deployment Guide - Tiffin Service Bot

This guide covers multiple deployment options for your Next.js tiffin service application.

---

## 📋 Table of Contents

1. [Vercel (Recommended - Easiest)](#1-vercel-deployment-recommended)
2. [Netlify](#2-netlify-deployment)
3. [Railway](#3-railway-deployment)
4. [DigitalOcean App Platform](#4-digitalocean-app-platform)
5. [AWS (EC2)](#5-aws-ec2-deployment)
6. [Docker Deployment](#6-docker-deployment)
7. [VPS/Self-Hosted](#7-vpsself-hosted-deployment)

---

## 1. Vercel Deployment (Recommended)

**Best for**: Next.js apps (built by Vercel team), zero configuration, free tier available

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project
cd tiffin-service-bot

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Option B: Deploy via GitHub

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/tiffin-service-bot.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Configuration** (auto-detected):
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Important Notes for Vercel:

⚠️ **File Storage Issue**: Your app uses `data/orders.json` for storage. This won't persist on Vercel (serverless).

**Solutions**:
- Use Vercel KV (Redis)
- Use Vercel Postgres
- Use external database (MongoDB, Supabase, etc.)

---

## 2. Netlify Deployment

**Best for**: Static sites, JAMstack, free tier available

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init

# Deploy
netlify deploy --prod
```

### Via GitHub

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (optional)

### netlify.toml Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 3. Railway Deployment

**Best for**: Full-stack apps, databases included, simple deployment

### Steps:

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

### Via GitHub:

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects Next.js
6. Click "Deploy"

### Environment Variables:

Railway automatically sets `PORT` variable. Your app will run on the assigned port.

---

## 4. DigitalOcean App Platform

**Best for**: Scalable apps, managed infrastructure

### Steps:

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect GitHub repository
4. Configure:
   - **Type**: Web Service
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **HTTP Port**: 3000
5. Choose plan (Basic $5/month or higher)
6. Click "Launch App"

### app.yaml Configuration (optional):

```yaml
name: tiffin-service-bot
services:
- name: web
  github:
    repo: YOUR_USERNAME/tiffin-service-bot
    branch: main
  build_command: npm run build
  run_command: npm start
  http_port: 3000
  instance_count: 1
  instance_size_slug: basic-xxs
```

---

## 5. AWS EC2 Deployment

**Best for**: Full control, scalable, production-grade

### Steps:

1. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t2.micro (free tier) or larger
   - Configure security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect via SSH**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**:
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone and Setup**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tiffin-service-bot.git
   cd tiffin-service-bot
   npm install
   npm run build
   ```

6. **Run with PM2**:
   ```bash
   pm2 start npm --name "tiffin-bot" -- start
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx (optional)**:
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/tiffin-bot
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/tiffin-bot /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 6. Docker Deployment

**Best for**: Containerized deployments, consistent environments

### Create Dockerfile:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Update next.config.ts:

```typescript
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

### Build and Run:

```bash
# Build image
docker build -t tiffin-service-bot .

# Run container
docker run -p 3000:3000 tiffin-service-bot
```

### Docker Compose (optional):

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

---

## 7. VPS/Self-Hosted Deployment

**Best for**: Any VPS provider (Linode, Vultr, Hetzner, etc.)

### Steps (similar to EC2):

1. **Get a VPS** from any provider
2. **SSH into server**
3. **Install Node.js and PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

4. **Clone and setup**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tiffin-service-bot.git
   cd tiffin-service-bot
   npm install
   npm run build
   ```

5. **Run with PM2**:
   ```bash
   pm2 start npm --name "tiffin-bot" -- start
   pm2 save
   pm2 startup
   ```

6. **Setup domain and SSL** (optional):
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `npm run build` works locally without errors
- [ ] All environment variables are configured
- [ ] Database/storage solution is set up (if needed)
- [ ] `.gitignore` includes `node_modules`, `.next`, `.env`
- [ ] `package.json` has correct scripts
- [ ] Test the production build locally: `npm run build && npm start`

---

## 🗄️ Database Migration (Important!)

Your app currently uses `data/orders.json` which won't work on serverless platforms.

### Recommended Solutions:

1. **Vercel KV (Redis)** - Best for Vercel
2. **MongoDB Atlas** - Free tier, easy setup
3. **Supabase** - PostgreSQL, free tier
4. **PlanetScale** - MySQL, free tier

### Quick MongoDB Atlas Setup:

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Install mongoose: `npm install mongoose`
5. Update API routes to use MongoDB instead of JSON file

---

## 🌐 Custom Domain Setup

### For Vercel:
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as shown

### For Other Platforms:
1. Point your domain's A record to server IP
2. Or use CNAME to point to platform's URL
3. Setup SSL certificate (Let's Encrypt)

---

## 📊 Monitoring & Logs

### Vercel:
- Built-in analytics and logs in dashboard

### PM2:
```bash
pm2 logs tiffin-bot
pm2 monit
```

### Docker:
```bash
docker logs -f container-name
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Vercel | Yes (Hobby) | $20/month (Pro) |
| Netlify | Yes | $19/month (Pro) |
| Railway | $5 credit/month | Pay as you go |
| DigitalOcean | No | $5/month+ |
| AWS EC2 | 12 months free | $5-10/month+ |
| VPS | No | $5-20/month |

---

## 🎯 Recommended Deployment Path

**For Beginners**: Vercel (easiest, zero config)
**For Learning**: Railway or DigitalOcean
**For Production**: AWS EC2 or VPS with proper setup
**For Scalability**: Vercel or AWS with load balancing

---

## 🆘 Troubleshooting

### Build Fails:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Issues:
- Ensure your app uses `process.env.PORT || 3000`
- Check if port is already in use

### File Storage Issues:
- Migrate to database for serverless platforms
- Use persistent volumes for Docker/VPS

### Environment Variables:
- Set in platform dashboard
- Never commit `.env` to git

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)

---

**Need help?** Check the platform-specific documentation or reach out to their support teams.

**Happy Deploying! 🚀**
