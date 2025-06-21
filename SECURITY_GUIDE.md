# Security Guide for Admin Panel

This guide covers multiple security approaches for protecting the PRG Sessions admin panel, from simple to enterprise-grade solutions.

## Current Implementation: Simple API Key Authentication

### How It Works

1. **Server-side Validation**: All write operations (POST, PUT, DELETE) check for a valid API key in the `x-api-key` header
2. **Client-side Login**: Admin interface requires API key entry before accessing admin functions
3. **Session Management**: Authentication state is maintained client-side during the session

### Setup

Add these environment variables to your `.env.local`:

```bash
ADMIN_API_KEY=your-secure-api-key-here-32-chars-min
NEXT_PUBLIC_ADMIN_API_KEY=your-secure-api-key-here-32-chars-min
```

**Important**: Use a strong, randomly generated key (32+ characters). Both environment variables should have the same value.

### Security Features

- **API Protection**: All write operations require valid API key
- **Server-side Validation**: Keys are validated on the server
- **Public Read Access**: GET operations remain public for the reading group page
- **Session Logout**: Clear authentication state with logout button

### Limitations

- **Single Key**: Only one API key for all admins
- **Client-side Storage**: API key visible in browser during session
- **No User Management**: Can't track who made changes
- **No Role-based Access**: All authenticated users have full admin access

## Advanced Implementation: NextAuth.js (Recommended for Production)

### Features

- **Multiple Providers**: Google, GitHub, and API key authentication
- **User Management**: Track individual admin users
- **Role-based Access**: Fine-grained permission control
- **Session Security**: JWT tokens with secure session management
- **Database Integration**: User sessions stored in MongoDB
- **OAuth Security**: Industry-standard OAuth 2.0 flow

### Setup

1. **Install Dependencies**:

```bash
pnpm add next-auth @auth/mongodb-adapter
```

2. **Environment Variables**:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/brian-portfolio

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Admin Configuration
ADMIN_API_KEY=your-secure-api-key-here
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

3. **OAuth Provider Setup**:

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Implementation Files

The advanced implementation includes:

- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `app/admin/login/page.tsx` - Multi-provider login page
- `components/SessionProvider.tsx` - Session context provider

### Usage

1. **Admin Access**: Visit `/admin/prg-sessions`
2. **Authentication Options**:
   - Google OAuth (if configured)
   - GitHub OAuth (if configured)
   - API Key (fallback method)
3. **Authorization**: Only users with emails in `ADMIN_EMAILS` can access admin functions

## Security Best Practices

### Environment Variables

```bash
# Generate secure keys
openssl rand -base64 32  # For API keys
openssl rand -hex 32     # For NextAuth secret
```

### Production Deployment

1. **HTTPS Only**: Always use HTTPS in production
2. **Environment Security**: Use secure environment variable management
3. **Key Rotation**: Regularly rotate API keys and secrets
4. **Access Logging**: Monitor admin access and changes
5. **Database Security**: Secure MongoDB with authentication and network restrictions

### Network Security

```bash
# MongoDB security
mongod --auth --bind_ip 127.0.0.1
```

### Additional Security Measures

1. **Rate Limiting**: Implement rate limiting on admin endpoints
2. **IP Whitelisting**: Restrict admin access to specific IP addresses
3. **Audit Logging**: Log all admin actions with timestamps and user info
4. **Two-Factor Authentication**: Add 2FA for additional security
5. **Session Timeout**: Implement automatic session expiration

## Monitoring and Alerting

### Recommended Monitoring

1. **Failed Login Attempts**: Alert on multiple failed authentications
2. **Admin Actions**: Log all CRUD operations with user attribution
3. **Unusual Access Patterns**: Monitor for suspicious admin activity
4. **Database Changes**: Track all modifications to PRG sessions

### Example Audit Log

```typescript
interface AuditLog {
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  resource: "PRG_SESSION";
  resourceId: string;
  changes: object;
  ipAddress: string;
  userAgent: string;
}
```

## Migration Between Security Levels

### From Simple to Advanced

1. Install NextAuth dependencies
2. Add OAuth provider configurations
3. Update admin page to use NextAuth
4. Migrate existing API key users to OAuth
5. Test all authentication flows

### Rollback Plan

Keep the simple API key implementation as a fallback:

- Maintain `ADMIN_API_KEY` environment variable
- Keep credentials provider in NextAuth config
- Document rollback procedures

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**: Ensure callback URLs match exactly
2. **Environment Variables**: Check all required variables are set
3. **Database Connection**: Verify MongoDB connection for session storage
4. **CORS Issues**: Configure proper CORS for OAuth providers

### Debug Mode

Enable NextAuth debug mode in development:

```bash
NEXTAUTH_DEBUG=true
```

## Security Checklist

- [ ] Strong API keys (32+ characters)
- [ ] Secure environment variable storage
- [ ] HTTPS in production
- [ ] OAuth providers configured correctly
- [ ] Admin email list maintained
- [ ] Database authentication enabled
- [ ] Network access restricted
- [ ] Audit logging implemented
- [ ] Session timeout configured
- [ ] Regular security reviews scheduled

## Support and Updates

- Monitor NextAuth.js releases for security updates
- Keep dependencies updated
- Review and update admin email lists regularly
- Conduct periodic security audits
- Document all security procedures for team members
