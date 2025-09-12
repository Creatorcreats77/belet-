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
  "Subtitles",
];

const filterOptions = {
Sort: [
  "Popularity",
  "Rating",
  "Release Date",
  "Revenue",
  "Title",
  "Vote Count",
  "Original Title",
  "Latest",
  "Oldest"
],
  Categories: [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western"
],

  Genres: [
  { name: "Action", id: 28 },
  { name: "Adventure", id: 12 },
  { name: "Animation", id: 16 },
  { name: "Comedy", id: 35 },
  { name: "Crime", id: 80 },
  { name: "Documentary", id: 99 },
  { name: "Drama", id: 18 },
  { name: "Family", id: 10751 },
  { name: "Fantasy", id: 14 },
  { name: "History", id: 36 },
  { name: "Horror", id: 27 },
  { name: "Music", id: 10402 },
  { name: "Mystery", id: 9648 },
  { name: "Romance", id: 10749 },
  { name: "Science Fiction", id: 878 },
  { name: "TV Movie", id: 10770 },
  { name: "Thriller", id: 53 },
  { name: "War", id: 10752 },
  { name: "Western", id: 37 },
],
  Countries: [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Spain", code: "ES" },
  { name: "Italy", code: "IT" },
  { name: "Russia", code: "RU" },
  { name: "China", code: "CN" },
  { name: "Japan", code: "JP" },
  { name: "South Korea", code: "KR" },
  { name: "India", code: "IN" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Turkey", code: "TR" },
  { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
  { name: "Finland", code: "FI" },
  { name: "Netherlands", code: "NL" },
  { name: "Poland", code: "PL" },
  { name: "Thailand", code: "TH" },
  { name: "Vietnam", code: "VN" },
  { name: "South Africa", code: "ZA" },
  { name: "Argentina", code: "AR" },
  { name: "Egypt", code: "EG" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Indonesia", code: "ID" },
  { name: "Ukraine", code: "UA" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Greece", code: "GR" },
  { name: "Portugal", code: "PT" },
  { name: "Switzerland", code: "CH" },
  { name: "Ireland", code: "IE" },
]
,
  Year: Array.from({ length: 30 }, (_, i) => 2025 - i),
  Tags: [
  "Superhero",
  "Space",
  "Romance",
  "Comedy",
  "Action",
  "Thriller",
  "Adventure",
  "Fantasy",
  "Horror",
  "Mystery",
  "Crime",
  "Drama",
  "Family",
  "Animation",
  "Musical",
  "Biography",
  "War",
  "History",
  "Sport",
  "Documentary"
],
  Subtitles: [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "Chinese", code: "zh" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Russian", code: "ru" },
  { name: "Japanese", code: "ja" },
  { name: "Korean", code: "ko" },
  { name: "Hindi", code: "hi" },
  { name: "Portuguese", code: "pt" },
  { name: "Italian", code: "it" },
  { name: "Arabic", code: "ar" },
  { name: "Turkish", code: "tr" },
  { name: "Dutch", code: "nl" },
  { name: "Swedish", code: "sv" },
  { name: "Norwegian", code: "no" },
  { name: "Danish", code: "da" },
  { name: "Polish", code: "pl" },
  { name: "Thai", code: "th" },
  { name: "Vietnamese", code: "vi" },
  { name: "Persian (Farsi)", code: "fa" },
  { name: "Ukrainian", code: "uk" },
  { name: "Hebrew", code: "he" },
  { name: "Czech", code: "cs" },
  { name: "Greek", code: "el" },
  { name: "Finnish", code: "fi" },
]

};

const API_KEY = "8ef128e645b6cc47fe1ff2b61dd975ef";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie";
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
  const [movies, setMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState(null); // current filter open
  const [filterSelection, setFilterSelection] = useState(null); // clicked item

  const prevSearchText = useRef("");

  /* -------------------- Fetch Popular Movies on Mount -------------------- */
  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${LATEST_URL}?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await response.json();
        setMovies(data.results || []);
        setLatestMovies(data.results || []);
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
        setMovies(latestMovies);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${SEARCH_URL}?api_key=${API_KEY}&query=${encodeURIComponent(
            searchText
          )}&language=en-US&page=1&include_adult=false`
        );
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchText, latestMovies]);

  /* -------------------- Fetch Movies by Filter -------------------- */
  useEffect(() => {
    if (!filterSelection) return;

    const fetchByFilter = async () => {
      try {
        setLoading(true);
        setError(null);

        let url_d = `${DISCOVER_URL}?api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
        let url_s = `${SEARCH_URL}?api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
        let url;
        const { filter, item } = filterSelection;

        if (filter === "Genres") {
          url = url_d;
          url += `&with_genres=${item.id}`;
        } else if (filter === "Year") {
          url = url_d;
          url += `&primary_release_year=${item}`;
        }else if (filter === "Categories") {
          url = url_d;
          url += `&with_genres=${item}`;
        }
         else if (filter === "Countries") {
          url = url_d;
          url += `&with_origin_country=${item.code}`;
        } else if (filter === "Subtitles") {
          url = url_d;
          url += `&with_original_language=${item.code}`;
        } else {
          url = url_s;
          url += `&query=${encodeURIComponent(item)}`; // for Sort, Tags, etc.
        }
        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        setError("Failed to fetch movies for this filter.");
      } finally {
        setLoading(false);
        setActiveFilter(null); // close sidebar after fetch
      }
    };

    fetchByFilter();
  }, [filterSelection]);

  /* -------------------- Filter Only Movies With Poster -------------------- */
  const filteredMovies = movies.filter((movie) => movie.poster_path);

  /* -------------------- Update Movies Length Store -------------------- */
  useEffect(() => {
    if (filteredMovies.length > 0) {
      if (searchText !== prevSearchText.current) {
        resetSearchMovies();
        prevSearchText.current = searchText;
      }
      setMoviesLength({ id: "movies-slider", length: filteredMovies.length });
    }
  }, [filteredMovies, searchText]);

  /* -------------------- Render -------------------- */
  return (
    <div className="relative w-full h-screen bg-black">
      <div className="absolute text-white w-full h-screen p-6 flex flex-col gap-4 overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center px-24">
          <div className="pe-8">
            <Mic size={48} className="text-white" />
          </div>
          <div className="bg-black p-4 text-4xl tracking-wide border-b w-full">
            {searchText || "Gozleg"}
          </div>
        </div>

        {/* Keyboard */}
        <div className="sm:px-12 px-12 lg:px-98">
          <KeyboardInput2 onInputChange={(text) => setSearchText(text)} />
        </div>

        {/* Filters */}
        <div className="flex gap-3 justify-center mt-4 w-full">
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`rounded-lg py-2 text-2xl hover:bg-gray-600 w-full transition-colors duration-300 ${
                searchCategoryId === index ? "bg-gray-700" : "bg-gray-800"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Movie Results */}
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

      {/* Left Sidebar */}
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

      {/* Right Filter Sidebar */}
      {activeFilter && (
        <div className="absolute right-0 top-0 h-screen w-[24%] bg-gray-700 text-white p-4 overflow-y-auto z-50">
          <h3 className="text-4xl font-bold mb-2 p-4">{activeFilter}</h3>
          <div className="flex flex-col gap-2">
            {filterOptions[activeFilter]?.map((item, index) => (
              <button
                key={item.id ?? item.name ?? index} // ✅ use id, name, or fallback index
                className="py-6 px-4 rounded-lg text-gray-200 text-left text-3xl"
                onClick={() => {
                  setFilterSelection({ filter: activeFilter, item });
                  setActiveFilter(null);
                }}
              >
                {item.name ?? item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
