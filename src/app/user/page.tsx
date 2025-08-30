'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface FunFactResponse {
  movie: string;
  funFact: string;
}

const UserPage = () => {
  const { data: session, status } = useSession();
  const [funFact, setFunFact] = useState<string>('');
  const [favoriteMovie, setFavoriteMovie] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (session?.user?.id) {
      fetchFunFact();
    }
  }, [session]);

  const fetchFunFact = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/movie-fun-fact');
      if (response.ok) {
        const data: FunFactResponse = await response.json();
        setFunFact(data.funFact);
        setFavoriteMovie(data.movie);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch fun fact');
      }
    } catch (error) {
      console.error('Error fetching fun fact:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchFunFact();
  };

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
    <div className="text-center max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Information</h1>

      {session.user?.image && (
        <Image
          src={session.user.image}
          alt="User profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full mx-auto mb-6"
        />
      )}

      <div className="space-y-3 mb-8">
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
      </div>

      {favoriteMovie && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Favorite Movie</h2>
          <p className="text-lg text-blue-600 font-medium">{favoriteMovie}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Fun Fact</h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 mb-4">
            <p>{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : funFact ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-gray-800 italic">&ldquo;{funFact}&rdquo;</p>
          </div>
        ) : (
          <p className="text-gray-500">No fun fact available</p>
        )}

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Get New Fun Fact'}
        </button>
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
