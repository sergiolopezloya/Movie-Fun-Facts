# Environment Variables Setup Guide

This guide explains how to set up environment variables for the MovieFunFacts project.

## Required Environment Variables

The project uses the following environment variables:

### Google OAuth Variables (Required for Authentication)

- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

### NextAuth Configuration Variables

- `NEXTAUTH_SECRET`: Secret used to encrypt NextAuth.js JWT tokens
- `NEXTAUTH_URL`: The base URL of your application

## Setup Instructions

### 1. Create Your Environment File

Copy the example file and create your local environment file:

```bash
cp .env.example .env.local
```

### 2. Configure Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your `.env.local` file

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
# On Linux/macOS
openssl rand -base64 32

# On Windows (PowerShell)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Add the generated secret to your `.env.local` file as `NEXTAUTH_SECRET`.

### 4. Set the Application URL

Update `NEXTAUTH_URL` to match your application's URL:

```env
NEXTAUTH_URL=http://localhost:3000
```

### 5. Final `.env.local` File

Your `.env.local` file should look like this:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Environment File Priority

Next.js loads environment variables in the following order:

1. `.env.local` (local overrides)
2. `.env` (environment-specific)
3. `.env.example` (example template)

## Security Notes

- **Never commit** your `.env.local` file to version control
- The `.gitignore` file is configured to exclude all `.env*` files
- Keep your secrets secure and never share them publicly
- For production, set environment variables in your deployment platform (Vercel, Netlify, etc.)

## Production Deployment

When deploying to production:

1. Set the environment variables in your hosting platform's dashboard
2. Update `NEXTAUTH_URL` to your production domain
3. Update Google OAuth redirect URIs to include your production domain

## Troubleshooting

If authentication isn't working:

- Verify all environment variables are set correctly
- Check that Google OAuth redirect URIs match your application URL
- Ensure the NEXTAUTH_SECRET is properly set and consistent across environments
