import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useUnit } from "effector-react";
import { useNavigate } from "react-router-dom"; // React Router
import { useKeyboard } from "../components/KeyboardContext";
import {
  $current,
  $activeIndex,
  nextSlide,
  prevSlide,
} from "../model/sliderStore";
import { $movieOpen, $movieId } from "../model/movie";
import { setActiveCurrentIndex } from "../model/movieContainer";

const visibleSlides = 5;

const Movies = ({ id, title = "Movies", movies = [] }) => {
    const {
  navigateToMovieDetail,
  setNavigateToMovieDetail
    } = useKeyboard();
  const navigate = useNavigate(); // React Router

  const [current, activeIndex, movieOpen, movieId] = useUnit([
    $current,
    $activeIndex,
    $movieOpen,
    $movieId,
  ]);


  const [setActiveCurrent] = useUnit([setActiveCurrentIndex]);

  const filteredMovies = movies.filter((movie) => movie.poster_path);

  const currentForThisCarousel = current[id] ?? 0;
  const activeIndexForThisCarousel = activeIndex[id] || 0;

  const activeMovie = filteredMovies[activeIndexForThisCarousel];

  useEffect(() => {
    setActiveCurrent(activeIndexForThisCarousel);
  }, [movieId]);


  useEffect(() => {
    const activeMovie = filteredMovies[activeIndexForThisCarousel];

    if (navigateToMovieDetail && activeMovie && id === movieId) {
      navigate(`/movie/${activeMovie.id}`, {
        state: { movie: activeMovie },
      });
      setNavigateToMovieDetail(false);
    }
  }, [navigateToMovieDetail, setNavigateToMovieDetail]);

  const handleNext = () => nextSlide(id);
  const handlePrev = () => prevSlide(id);

  return (
    <div id={id}>
      <h2 className="text-3xl font-bold mb-3 text-white mt-2 ps-24">{title}</h2>

      <div className="relative w-full mx-auto overflow-hidden px-12">
        <div className="relative flex items-center">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${(filteredMovies.length * 100) / visibleSlides}%`,
              transform: `translateX(-${
                currentForThisCarousel * (100 / visibleSlides)
              }%)`,
            }}
          >
            {filteredMovies.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                className="py-2 flex justify-center"
                style={{ flex: `0 0 ${100 / visibleSlides}%` }}
              >
                <div
                  className={`overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ${
                    index === activeIndexForThisCarousel &&
                    movieOpen &&
                    id === movieId
                      ? "ring-4 ring-blue-700 w-[100%]"
                      : "ring-0 w-[92%]"
                  }`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || "Movie poster"}
                    className="w-full h-[464px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
