# Database Setup Guide

## Prerequisites

1. PostgreSQL database installed and running
2. Database connection URL

## Setup Steps

### 1. Configure Environment Variables

Update `.env.local` with your actual database connection string and authentication credentials:

```env
# Database connection (update with your actual PostgreSQL connection)
DATABASE_URL="postgresql://username:password@localhost:5432/moviefunfacts"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth (get these from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Run Database Migrations

Once your database is set up and environment variables are configured, run:

```bash
npm run db:migrate
```

This will:

- Create the database tables
- Generate the Prisma client
- Set up the schema

### 3. Generate Prisma Client

If you need to regenerate the client:

```bash
npm run db:generate
```

### 4. Start the Development Server

```bash
npm run dev
```

## Database Schema

The application uses the following tables:

- `User` - Stores user information including favorite movie
- `Account` - OAuth account connections
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

## Testing the Setup

1. Start the development server
2. Navigate to http://localhost:3000
3. Sign in with Google
4. You should be prompted to enter your favorite movie
5. The favorite movie will be stored in the database

## Troubleshooting

- Ensure PostgreSQL is running
- Verify the DATABASE_URL is correct
- Check that all environment variables are set
- Run `npx prisma studio` to view the database content
