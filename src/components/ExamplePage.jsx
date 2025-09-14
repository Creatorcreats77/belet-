import React, { useEffect, useState, useCallback } from "react";

const API_KEY = "8ef128e645b6cc47fe1ff2b61dd975ef";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

export default function ExamplePage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("Avengers"); // default search
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${SEARCH_URL}?api_key=${API_KEY}&query=${query}&page=${page}`
      );
      const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [page, query, hasMore, loading]);

  // Initial fetch
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    fetchMovies();
  }, [page, fetchMovies]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
          document.documentElement.offsetHeight &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Movie Search</h1>

      {/* Search Box */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 w-80 rounded-lg text-black"
        />
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 p-2 rounded-lg shadow hover:scale-105 transition-transform"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              loading="lazy" // Lazy loading image
              className="rounded-lg w-full"
            />
            <h2 className="mt-2 text-center text-sm font-semibold">
              {movie.title}
            </h2>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center mt-4 text-lg text-gray-400">
          Loading more movies...
        </div>
      )}

      {/* End Message */}
      {!hasMore && !loading && (
        <div className="text-center mt-4 text-gray-500">
          🎬 No more movies found!
        </div>
      )}
    </div>
  );
}
