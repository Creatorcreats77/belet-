import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { ChevronLeft } from "lucide-react"; // if you use lucide icons
import SideBar from "./SideBar"; // your component
import { useKeyboard } from "./KeyboardContext"; // wherever you defined it
import Loading from "./Loading";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Play,
  Users,
  Clapperboard,
  Info,
} from "lucide-react";
import {} from "lucide-react";

export default function MoviePage() {
  const {
    isOpen,
    setIsOpen,
    sidebarIndex,
    setMenuLength,
    horizontalIndexForMoviePage,
    verticalIndexMoviePage,
  } = useKeyboard(); // if your provider exposes a handler
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [selected, setSelected] = useState(false);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Movie passed via navigate state
  const movie = location.state?.movie;
  if (!movie) {
    return <p className="text-white p-4">Movie not found!</p>;
  }

  const imdbRating = movie.vote_average?.toFixed(1) || "N/A";
  const ageRating = movie.adult ? "18+" : "PG-13";
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const genres = movie.genre_ids?.join(" • ") || "Drama"; // you can map IDs to names if you have genres list
  const duration = "1h 32m";

  return (
    <>
      <img
        src={`https://image.tmdb.org/t/p/original${
          movie.backdrop_path || movie.poster_path
        }`}
        alt={movie.title}
        className="hidden"
        onLoad={() => setIsImageLoaded(true)}
      />
      {!isImageLoaded ? (
        <div className="relative w-full h-screen bg-black text-white">
          <Loading />
        </div>
      ) : (
        <div className="relative w-full h-screen bg-black text-white overflow-hidden">
          <div className="absolute w-full h-full">
            <div
              className="absolute w-full h-full inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w780${
                  movie.backdrop_path || movie.poster_path
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
            <div className="absolute h-full w-full">
              {!isOpen ? null : (
                <SideBar
                  isOpen={isOpen}
                  onToggle={(newState) => setIsOpen(newState)}
                  focusedIndex={sidebarIndex}
                  onInfo={(length) => setMenuLength(length)}
                  onSelect={(item) => console.log("Selected:", item)}
                />
              )}
            </div>
            {!isOpen ? (
              <div className="absolute flex items-center h-full px-10">
                <div className="w-[46%] space-y-6">
                  {/* Title */}
                  <h1 className="text-[84px] leading-none mb-4 font-bold tracking-wide">
                    {movie.title}
                  </h1>

                  {/* IMDb and Age */}
                  <div className="flex items-center space-x-4 text-gray-300">
                    <span className="font-semibold text-2xl">
                      IMDb <span className="text-white ">{imdbRating}</span>
                    </span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-xl">
                      {ageRating}
                    </span>
                  </div>

                  {/* Genre, Year, Duration */}
                  <p className="text-gray-400 text-2xl">
                    {" "}
                    {year} • {duration}
                  </p>

                  {/* Description */}
                  <p className="text-gray-200 leading-relaxed text-3xl">
                    {movie?.overview.length > 100
                      ? movie.overview.slice(0, 100) + "..."
                      : movie?.overview}
                  </p>

                  {/* Icons Row */}
                  <div className="flex items-center space-x-24 py-6">
                    <button className="w-18 h-18 flex items-center justify-center rounded-full ">
                      <ThumbsUp
                        className={`w-18 h-18 ${
                          0 === horizontalIndexForMoviePage &&
                          1 === verticalIndexMoviePage
                            ? "text-gray-500 text-2xl"
                            : "text-white"
                        }`}
                      />{" "}
                    </button>

                    <button className="w-18 h-18 flex items-center justify-center rounded-full">
                      <ThumbsDown
                        className={`w-18 h-18 ${
                          0 === horizontalIndexForMoviePage &&
                          2 === verticalIndexMoviePage
                            ? "text-gray-500 text-2xl"
                            : "text-white"
                        }`}
                      />{" "}
                    </button>

                    <button className="w-18 h-18 flex items-center justify-center rounded-full ">
                      <Bookmark
                        className={`w-18 h-18 ${
                          0 === horizontalIndexForMoviePage &&
                          3 === verticalIndexMoviePage
                            ? "text-gray-500 text-2xl"
                            : "text-white"
                        }`}
                      />{" "}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Baslat (Start) */}
                    <button
                      className={`w-full flex items-center gap-3 py-4 px-4 rounded-xl text-2xl font-semibold transition-colors duration-300 text-start ${
                        horizontalIndexForMoviePage === 1
                          ? "bg-white text-black ring-2 ring-white"
                          : "bg-white/20 text-white hover:bg-white/40"
                      }`}
                    >
                      <Play className="w-7 h-7" />
                      Baslat
                    </button>

                    {/* Aktorlar (Actors) */}
                    <button
                      className={`w-full flex items-center gap-3 py-4 px-4 rounded-xl text-2xl font-semibold transition-colors duration-300 text-start ${
                        horizontalIndexForMoviePage === 2
                          ? "bg-white text-black ring-2 ring-white"
                          : "bg-white/20 text-white hover:bg-white/40"
                      }`}
                    >
                      <Users className="w-7 h-7" />
                      Aktorlar
                    </button>

                    {/* Menzesler (Similar) */}
                    <button
                      className={`w-full flex items-center gap-3 py-4 px-4 rounded-xl text-2xl font-semibold transition-colors duration-300 text-start ${
                        horizontalIndexForMoviePage === 3
                          ? "bg-white text-black ring-2 ring-white"
                          : "bg-white/20 text-white hover:bg-white/40"
                      }`}
                    >
                      <Clapperboard className="w-7 h-7" />
                      Menzesler
                    </button>

                    {/* Doly Maglumat (Full Info) */}
                    <button
                      className={`w-full flex items-center gap-3 py-4 px-4 rounded-xl text-2xl font-semibold transition-colors duration-300 text-start ${
                        horizontalIndexForMoviePage === 4
                          ? "bg-white text-black ring-2 ring-white"
                          : "bg-white/20 text-white hover:bg-white/40"
                      }`}
                    >
                      <Info className="w-7 h-7" />
                      Doly Maglumat
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}
