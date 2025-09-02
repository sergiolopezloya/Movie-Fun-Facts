'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useReducer, useEffect } from 'react';

type State = {
  favoriteMovie: string;
  isSubmitting: boolean;
  isLoading: boolean;
  showMovieForm: boolean;
  movieSaved: boolean;
};

type Action =
  | { type: 'setFavoriteMovie'; payload: string }
  | { type: 'setIsSubmitting'; payload: boolean }
  | { type: 'setIsLoading'; payload: boolean }
  | { type: 'setShowMovieForm'; payload: boolean }
  | { type: 'setMovieSaved'; payload: boolean };

const initialState: State = {
  favoriteMovie: '',
  isSubmitting: false,
  isLoading: false,
  showMovieForm: false,
  movieSaved: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setFavoriteMovie':
      return { ...state, favoriteMovie: action.payload };
    case 'setIsSubmitting':
      return { ...state, isSubmitting: action.payload };
    case 'setIsLoading':
      return { ...state, isLoading: action.payload };
    case 'setShowMovieForm':
      return { ...state, showMovieForm: action.payload };
    case 'setMovieSaved':
      return { ...state, movieSaved: action.payload };
    default:
      return state;
  }
}

export default function Home() {
  const { data: session } = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (session?.user?.email) {
      checkFavoriteMovie();
    }
  }, [session]);

  const checkFavoriteMovie = async () => {
    dispatch({ type: 'setIsLoading', payload: true });
    try {
      const response = await fetch('/api/user/favorite-movie', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.favoriteMovie) {
          dispatch({ type: 'setMovieSaved', payload: true });
        } else {
          dispatch({ type: 'setShowMovieForm', payload: true });
        }
      }
    } catch (error) {
      console.error('Error checking favorite movie:', error);
      dispatch({ type: 'setShowMovieForm', payload: true });
    } finally {
      dispatch({ type: 'setIsLoading', payload: false });
    }
  };

  const handleSaveFavoriteMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.favoriteMovie.trim()) return;

    dispatch({ type: 'setIsSubmitting', payload: true });
    try {
      const response = await fetch('/api/user/favorite-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favoriteMovie: state.favoriteMovie.trim() }),
      });

      if (response.ok) {
        dispatch({ type: 'setMovieSaved', payload: true });
        dispatch({ type: 'setShowMovieForm', payload: false });
      } else {
        console.error('Failed to save favorite movie');
      }
    } catch (error) {
      console.error('Error saving favorite movie:', error);
    } finally {
      dispatch({ type: 'setIsSubmitting', payload: false });
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to MovieFunFacts</h1>

      {session ? (
        <div className="space-y-4">
          <p className="text-lg">Welcome back, {session.user?.name}!</p>

          {state.showMovieForm && !state.movieSaved && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {state.isLoading ? (
                <p className="text-gray-600">Checking your favorite movie...</p>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Tell us your favorite movie!
                  </h2>
                  <form
                    onSubmit={handleSaveFavoriteMovie}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      value={state.favoriteMovie}
                      onChange={(e) =>
                        dispatch({
                          type: 'setFavoriteMovie',
                          payload: e.target.value,
                        })
                      }
                      placeholder="Enter your favorite movie..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={
                        state.isSubmitting || !state.favoriteMovie.trim()
                      }
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {state.isSubmitting ? 'Saving...' : 'Save Favorite Movie'}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {state.movieSaved && (
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
