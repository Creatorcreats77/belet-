import React, { useState, useEffect, useRef } from "react";
import { useKeyboard } from "../components/KeyboardContext";
import SearchMovies from "./SearchMovies";
import { Mic, ChevronLeft } from "lucide-react";
import KeyboardInput2 from "./KeyboardInput2";
import SideBar from "./SideBar";
import { setMoviesLength, resetSearchMovies } from "../model/searchMoviesStore";

const filters = [
  "Sort",
  "Categories",
  "Genres",
  "Countries",
  "Year",
  "Tags",
  "Audio Tracks",
  "Subtitles",
];

const API_KEY = "8ef128e645b6cc47fe1ff2b61dd975ef";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const LATEST_URL = "https://api.themoviedb.org/3/movie/popular";

export default function Search() {
  const {
    focusedRegion,
    isOpen,
    setIsOpen,
    sidebarIndex,
    setMenuLength,
    searchCategoryId,
  } = useKeyboard();

  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);        // All fetched movies
  const [latestMovies, setLatestMovies] = useState([]); // Cached popular movies
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevSearchText = useRef("");

  /* -------------------- Fetch Popular Movies on Mount -------------------- */
  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${LATEST_URL}?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();

        if (data.results) {
          setMovies(data.results);
          setLatestMovies(data.results); // Save for fallback
          
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error("Error fetching latest movies:", err);
        setError("Failed to fetch latest movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMovies();
  }, []);

  /* -------------------- Fetch Movies When Search Text Changes -------------------- */
  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchText.trim()) {
        // If search bar is empty, revert to latest popular movies
        setMovies(latestMovies);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${SEARCH_URL}?api_key=${API_KEY}&query=${encodeURIComponent(searchText)}&language=en-US&page=1&include_adult=false`
        );
        const data = await response.json();

        if (data.results) {
          setMovies(data.results);
          console.log("Search results:", data.results);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchText, latestMovies]);

  /* -------------------- Filter Only Movies With Poster -------------------- */
  const filteredMovies = movies.filter((movie) => movie.poster_path);

  /* -------------------- Update Movies Length Store -------------------- */
useEffect(() => {
  if (filteredMovies.length > 0) {
    // ✅ Only reset if the search text actually changed
    if (searchText !== prevSearchText.current) {
      resetSearchMovies();           // reset carousel indexes & active movie
      prevSearchText.current = searchText;
    }

    // Always update movie length for navigation bounds
    setMoviesLength({ id: "movies-slider", length: filteredMovies.length });
  }
}, [filteredMovies, searchText]);



  /* -------------------- Render -------------------- */
  return (
    <div className="relative w-full h-screen bg-black">
      <div className="absolute text-white w-full h-screen p-6 flex flex-col gap-4 overflow-hidden">
        
        {/* -------------------- Search Bar -------------------- */}
        <div className="flex items-center px-24">
          <div className="pe-8">
            <Mic size={48} className="text-white" />
          </div>
          <div className="bg-black p-4 text-4xl tracking-wide border-b w-full">
            {searchText || "Gozleg"}
          </div>
        </div>

        {/* -------------------- On-Screen Keyboard -------------------- */}
        <div className="sm:px-12 px-12 lg:px-98">
          <KeyboardInput2 onInputChange={(text) => setSearchText(text)} />
        </div>

        {/* -------------------- Filters Section -------------------- */}
        <div className="flex gap-3 justify-center mt-4 w-full">
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`rounded-lg py-2 text-2xl hover:bg-gray-600 w-full transition-colors duration-300 
                ${
                  searchCategoryId === index
                    ? "bg-gray-700"
                    : "bg-gray-800"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* -------------------- Movie Results Section -------------------- */}
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-center text-gray-400">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          
          {!loading && filteredMovies.length === 0 && (
            <p className="text-center text-gray-400">No results found.</p>
          )}

          {!loading && filteredMovies.length > 0 && (
            <SearchMovies
              id="movies-slider"
              title="Movies"
              movies={filteredMovies}
            />
          )}
        </div>
      </div>

      {/* -------------------- Sidebar -------------------- */}
      <div className="absolute h-screen text-white">
        {!isOpen ? (
          <div className="h-screen w-full">
            <div className="w-32 h-full bg-gradient-to-r from-black/80 to-black/0 text-amber-50 absolute">
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
