import { useEffect } from "react";
import { useKeyboard } from "../components/KeyboardContext";
import BottomSwiper from "./BottomSwiper";
import SideBar from "./SideBar";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // React Router

export default function HomePage({ mainMovie }) {
  const {
    isOpen,
    setIsOpen,
    movieOpen,
    movieFocusedIndex,
    categories,
    sidebarIndex,
    setMenuLength,
    navigateToMovieDetailHome,
    setNavigateToMovieDetailHome,
  } = useKeyboard();

  const navigate = useNavigate(); // React Router

  useEffect(() => {
    if (navigateToMovieDetailHome) {
      navigate(`/movie/${mainMovie.id}`, {
        state: { movie: mainMovie },
      });
      setNavigateToMovieDetailHome(false);
    }
  }, [navigateToMovieDetailHome, setNavigateToMovieDetailHome]);

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background image */}
      <div className="w-full absolute">
        <div className="w-full relative">
          <div
            className="absolute h-screen inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("https://image.tmdb.org/t/p/original${
                mainMovie.backdrop_path || mainMovie.poster_path
              }")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
          </div>

          {!isOpen && (
            <div className="absolute top-32 left-24 w-[48%] text-white">
              <div className="text-[114px] leading-none mb-4">
                {mainMovie.original_title}
              </div>
              <div className="flex text-4xl mb-8">
                {mainMovie?.overview.length > 100
                  ? mainMovie.overview.slice(0, 100) + "..."
                  : mainMovie?.overview}
              </div>
              <div className="text-6xl text-gray-400 mb-8">
                {mainMovie.release_date}
              </div>
              <div>
                <button className="bg-white text-black text-4xl w-[80%] px-6 py-6 rounded-lg mr-4 hover:bg-gray-300 transition">
                  Ginisleyin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Swiper */}
      {movieFocusedIndex && (
        <BottomSwiper categories={categories} isOpen={movieOpen} />
      )}

      {/* Sidebar */}
      <div className="absolute h-full w-full">
        {!isOpen ? (
          <div className="relative h-full w-full">
            <div
              className={`w-32 h-full bg-gradient-to-r from-black/80 to-black/0 text-amber-50 absolute ${
                movieOpen ? "flex items-center" : ""
              }`}
            >
              <button onClick={() => setIsOpen(!isOpen)} className="p-4">
                <ChevronLeft className="w-12 h-12 text-gray-500" />
              </button>
            </div>
          </div>
        ) : (
          <SideBar
            isOpen={isOpen}
            onToggle={(newState) => setIsOpen(newState)}
            focusedIndex={sidebarIndex}
            onInfo={(length) => setMenuLength(length)}
            onSelect={(item) => console.log("Selected:", item)}
          />
        )}
      </div>
    </div>
  );
}
