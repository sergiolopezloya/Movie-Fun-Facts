'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to MovieFunFacts</h1>

      {session ? (
        <div className="space-y-4">
          <p className="text-lg">Welcome back, {session.user?.name}!</p>
          <Link
            href="/user"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            View Your Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg">
            Sign in to access your movie facts and preferences
          </p>
          <button
            onClick={() => signIn('google')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login with Google
          </button>
        </div>
      )}
    </div>
  );
}
