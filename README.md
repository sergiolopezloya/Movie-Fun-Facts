# MovieFunFacts

A Next.js application that allows users to store their favorite movies and get fun facts about them. Features Google authentication, PostgreSQL database integration, and OpenAI-powered fun fact generation.

## Features

- 🔐 Google OAuth authentication with NextAuth.js
- 🎬 Store and manage favorite movies
- 🤖 AI-powered fun fact generation using OpenAI
- 💾 PostgreSQL database with Prisma ORM
- ⚡ Built with Next.js 15 and TypeScript
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI API for fun fact generation
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 24.4.1 as per .nvmrc)
- PostgreSQL database
- Google OAuth credentials
- OpenAI API key

### Environment Setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/moviefunfacts"

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
npx prisma migrate dev
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign In**: Click "Login with Google" to authenticate
2. **Set Favorite Movie**: On first login, you'll be prompted to enter your favorite movie
3. **View Profile**: Visit the User page to see your information and favorite movie
4. **Get Fun Facts**: Click "Get New Fun Fact" to generate interesting facts about your favorite movie

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── user/
│   │   └── page.tsx    # User profile page
│   └── providers.tsx   # NextAuth provider
├── pages/
│   └── api/            # API routes
│       ├── auth/       # Authentication endpoints
│       ├── user/       # User data endpoints
│       └── movie-fun-fact.ts # Fun fact generation
lib/
├── prisma.ts           # Prisma client
prisma/
├── schema.prisma       # Database schema
types/
├── next-auth.d.ts      # TypeScript definitions
```

## API Endpoints

- `GET /api/user/favorite-movie` - Get user's favorite movie
- `POST /api/user/favorite-movie` - Update user's favorite movie
- `GET /api/movie-fun-fact` - Generate fun fact about favorite movie
- `GET/POST /api/auth/[...nextauth]` - Authentication routes

## License

MIT License - see LICENSE file for details.

## Author

Sergio Lopez

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support or questions, please open an issue in the GitHub repository.
