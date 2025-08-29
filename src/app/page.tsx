'use client';

import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Welcome to MovieFunFacts</h1>
      <button
        onClick={() => signIn('google')}
        className="px-4 py-2 mx-auto bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Login with Google
      </button>
    </>
  );
}
