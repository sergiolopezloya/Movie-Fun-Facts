'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const UserPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p>Please wait while we load your information.</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
        <p>Please sign in to view your user information.</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">User Information</h1>

      {session.user?.image && (
        <Image
          src={session.user.image}
          alt="User profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}

      <div className="space-y-2">
        {session.user?.name && (
          <p className="text-lg">
            <strong>Name:</strong> {session.user.name}
          </p>
        )}

        {session.user?.email && (
          <p className="text-lg">
            <strong>Email:</strong> {session.user.email}
          </p>
        )}

        {session.user?.id && (
          <p className="text-lg">
            <strong>User ID:</strong> {session.user.id}
          </p>
        )}
      </div>

      <button
        onClick={() => signOut()}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserPage;
