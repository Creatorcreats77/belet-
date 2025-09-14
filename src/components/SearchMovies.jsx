import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useKeyboard } from "../components/KeyboardContext";
import { useNavigate } from "react-router-dom"; // React Router
import { useUnit } from "effector-react";
import {
  $currentSearch,
  $activeIndexSearch,
  $movieIdSearch,
  setMovieIdSearch,
} from "../model/searchMoviesStore";

const visibleSlides = 5;

const SearchMovies = ({ id, title = "Movies", movies = [], paginate}) => {
  const { navigateToMovieDetail, setNavigateToMovieDetail } = useKeyboard();

  const [currentsearch, activeIndexSearch, movieIdSearch] = useUnit([
    $currentSearch,
    $activeIndexSearch,
    $movieIdSearch,
  ]);
  const navigate = useNavigate(); // React Router

  const filteredMovies = movies.filter((movie) => movie.poster_path);

  const activeIndex = activeIndexSearch[id] ?? 0;
  const activeMovie = filteredMovies[activeIndex];

  // Navigate to movie Detail
  useEffect(() => {
    if (navigateToMovieDetail && activeMovie && id === "movies-slider") {
      navigate(`/movie/${activeMovie.id}`, {
        state: { movie: activeMovie },
      });
      setNavigateToMovieDetail(false);
    }
  }, [navigateToMovieDetail, setNavigateToMovieDetail]);

  useEffect(() => {
  if (!filteredMovies[activeIndex]) return;

  // keep effector store in sync
  if (
    movieIdSearch.index !== -1 &&
    (movieIdSearch.id !== id || movieIdSearch.index !== activeIndex)
  ) {
    setMovieIdSearch({ id, index: activeIndex });
  }

  // 👇 check if we are close to the end
  const threshold = 1; // start loading more when 3 away from last
  if (activeIndex >= filteredMovies.length - threshold) {
    // figure out next page number (assuming API returns 20 movies per page)
    const nextPage = Math.floor(filteredMovies.length / 20) + 1;
    paginate(nextPage);
  }
}, [activeIndex, filteredMovies, id, movieIdSearch, paginate]);


  if (filteredMovies.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 py-12">
        <h2 className="text-2xl font-semibold">No results found</h2>
        <p className="mt-2 text-gray-500">Try searching for a different movie.</p>
      </div>
    );
  }

let slideWidth;
if (filteredMovies.length < 2) {
  slideWidth = 1000;
} else if (filteredMovies.length < 3) {
  slideWidth = 46;
} else if (filteredMovies.length < 4) {
  slideWidth = 36;
} else {
  slideWidth = 100 / visibleSlides;
}
  return (
    <div id={id} className="relative">
      <h2 className="text-3xl font-bold mb-3 text-white mt-2 ps-24">{title}</h2>
      
      <div className="relative w-full mx-auto overflow-hidden px-12">
        <div className="relative flex items-center">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${(filteredMovies.length * 100) / visibleSlides}%`,
              transform: `translateX(-${
                (currentsearch[id] ?? 0) * (100 / visibleSlides)
              }%)`,
            }}
          >
            {filteredMovies.map((movie, index) => {
              const isActive =
                index === activeIndex &&
                id === movieIdSearch.id &&
                movieIdSearch.index !== -1;

              return (
                <div
                  key={`${movie.id}-${index}`}
                  className="py-2 flex justify-center"
                  style={{ flex: `0 0 ${slideWidth}%` }} // 👈 use dynamic width
                >
                  <div
                    className={`overflow-hidden rounded-2xl shadow-lg transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "ring-4 ring-blue-700 w-[100%]"
                        : "ring-0 w-[92%]"
                    }`}
                    onClick={() => setMovieIdSearch({ id, index })}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title || "Movie poster"}
                      className="w-full h-[464px] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default SearchMovies;