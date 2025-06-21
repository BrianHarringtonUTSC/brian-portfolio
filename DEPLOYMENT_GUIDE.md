# 🚀 Deployment Guide - PRG Admin System

## 📋 Pre-deployment Checklist

### ✅ Security Verification

- [ ] Remove demo credentials from production build
- [ ] Verify all environment variables are set
- [ ] Confirm NextAuth secret is properly configured
- [ ] Check MongoDB connection string is secure
- [ ] Validate all API endpoints require authentication

### ✅ Performance Optimization

- [ ] Enable MongoDB connection pooling
- [ ] Configure proper caching headers
- [ ] Set up CDN for static assets
- [ ] Monitor memory usage for token cache

### ✅ Environment Configuration

#### Required Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# NextAuth.js (Required)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-32-char-secret-here

# Legacy API Keys (Optional - for backward compatibility)
ADMIN_API_KEY=your-secure-api-key
NEXT_PUBLIC_ADMIN_API_KEY=your-secure-api-key
```

#### Generate Secure Secrets

```bash
# NextAuth secret
openssl rand -hex 32

# API keys
openssl rand -base64 32
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │    │   NextAuth.js    │    │    MongoDB      │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Admin Login │ │───▶│ │ Credentials  │ │    │ │ Sessions    │ │
│ └─────────────┘ │    │ │ Provider     │ │    │ │ Collection  │ │
│                 │    │ └──────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ PRG Manager │ │───▶│ │ JWT Strategy │ │───▶│ │ PRG         │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ │ Sessions    │ │
└─────────────────┘    └──────────────────┘    │ └─────────────┘ │
                                               └─────────────────┘
```

## 🔒 Security Features Implemented

### Authentication

- ✅ **bcrypt password hashing** (12 rounds)
- ✅ **JWT session management** with expiration
- ✅ **Role-based access control** (admin role required)
- ✅ **Session invalidation** on logout
- ✅ **Constant-time comparison** for API keys
- ✅ **Login attempt tracking** (rate limiting)

### Authorization

- ✅ **Server-side session validation**
- ✅ **API endpoint protection**
- ✅ **Client-side route protection**
- ✅ **Token caching** for performance

### Logging & Monitoring

- ✅ **Authentication events logging**
- ✅ **Failed login attempt tracking**
- ✅ **Session lifecycle events**

## 📊 Performance Optimizations

### Caching Strategy

```typescript
// Token validation cache (5-minute TTL)
const tokenCache = new Map<string, { valid: boolean; expires: number }>();
```

### Database Optimizations

- MongoDB lean queries for better performance
- Connection pooling via MongoDB adapter
- Proper indexing on frequently queried fields

### React Optimizations

- useCallback for event handlers
- Proper dependency arrays in useEffect
- Memoized components where appropriate

## 🚀 Deployment Platforms

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Environment variables in Vercel dashboard:

- Add all required env vars
- Mark sensitive ones as "encrypted"

### AWS/Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Production Recommendations

### Database

- Use MongoDB Atlas for managed hosting
- Enable authentication and network access restrictions
- Set up automated backups
- Monitor connection pool usage

### Security

- Use HTTPS only in production
- Implement rate limiting at infrastructure level
- Set up proper CORS policies
- Use secure headers (helmet.js)

### Monitoring

- Set up error tracking (Sentry)
- Monitor authentication events
- Track API performance
- Set up health checks

## 🐛 Troubleshooting

### Common Issues

#### "Invalid API key" errors

```bash
# Check environment variables
echo $NEXTAUTH_SECRET
echo $MONGODB_URI

# Verify in application
console.log(process.env.NEXTAUTH_SECRET)
```

#### Session not persisting

- Check NEXTAUTH_URL matches deployment URL
- Verify cookie settings in NextAuth config
- Check browser developer tools for session cookies

#### Database connection issues

- Verify MongoDB URI format
- Check network access permissions
- Test connection from deployment environment

### Debug Mode

```typescript
// Enable debug logging in development
export default NextAuth({
  debug: process.env.NODE_ENV === "development",
  // ... other config
});
```

## 📈 Scaling Considerations

### Horizontal Scaling

- NextAuth.js sessions are stateless (JWT)
- MongoDB handles connection pooling
- Consider Redis for token cache in multi-instance setups

### Performance Monitoring

```typescript
// Add performance monitoring
console.time("auth-validation");
const isValid = await validateSession(request);
console.timeEnd("auth-validation");
```

### Load Testing

```bash
# Use k6 or similar tools
k6 run --vus 100 --duration 30s load-test.js
```

## 🔄 Maintenance

### Regular Tasks

- [ ] Rotate NextAuth secret quarterly
- [ ] Update dependencies monthly
- [ ] Review authentication logs weekly
- [ ] Monitor performance metrics daily

### Health Checks

```typescript
// Add health check endpoint
export async function GET() {
  try {
    await dbConnect();
    return Response.json({ status: "healthy" });
  } catch (error) {
    return Response.json({ status: "unhealthy" }, { status: 500 });
  }
}
```
