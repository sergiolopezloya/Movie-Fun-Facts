'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [favoriteMovie, setFavoriteMovie] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [movieSaved, setMovieSaved] = useState(false);

  useEffect(() => {
    // Check if user has already set a favorite movie
    if (session?.user?.id) {
      checkFavoriteMovie();
    }
  }, [session]);

  const checkFavoriteMovie = async () => {
    try {
      const response = await fetch('/api/user/favorite-movie', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.favoriteMovie) {
          setMovieSaved(true);
        } else {
          setShowMovieForm(true);
        }
      }
    } catch (error) {
      console.error('Error checking favorite movie:', error);
      setShowMovieForm(true);
    }
  };

  const handleSaveFavoriteMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!favoriteMovie.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/favorite-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favoriteMovie: favoriteMovie.trim() }),
      });

      if (response.ok) {
        setMovieSaved(true);
        setShowMovieForm(false);
      } else {
        console.error('Failed to save favorite movie');
      }
    } catch (error) {
      console.error('Error saving favorite movie:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to MovieFunFacts</h1>

      {session ? (
        <div className="space-y-4">
          <p className="text-lg">Welcome back, {session.user?.name}!</p>

          {showMovieForm && !movieSaved && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Tell us your favorite movie!
              </h2>
              <form onSubmit={handleSaveFavoriteMovie} className="space-y-4">
                <input
                  type="text"
                  value={favoriteMovie}
                  onChange={(e) => setFavoriteMovie(e.target.value)}
                  placeholder="Enter your favorite movie..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !favoriteMovie.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Favorite Movie'}
                </button>
              </form>
            </div>
          )}

          {movieSaved && (
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-green-800">
                Thanks for sharing your favorite movie!
              </p>
            </div>
          )}

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
