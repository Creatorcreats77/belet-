import React, { useState, useEffect, useRef } from "react";
import { useKeyboard } from "../components/KeyboardContext";
import SearchMovies from "./SearchMovies";
import { Mic, ChevronLeft } from "lucide-react";
import KeyboardInput from "./KeyboardInput";
import SideBar from "./SideBar";
import { setMoviesLength, resetSearchMovies } from "../model/searchMoviesStoreNextPrev";
import { useUnit } from "effector-react";
import {
  $filterSidebar,
  $activeFilter,
  setActiveFilter,
  setFilterItems,
  resetFilter,
  setFilterSelection,
} from "../model/filterSidebarStore";

import {
  $latestMovies,
  setLatestMovies,
  addLatestMovies,
} from "../model/latestMoviesStore";

import { filterOptions, filters } from "../model/data/filterCategories";

const API_KEY = "8ef128e645b6cc47fe1ff2b61dd975ef";
const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie";
const LATEST_URL = "https://api.themoviedb.org/3/movie/now_playing";

export default function Search() {
  const { isOpen, setIsOpen, sidebarIndex, setMenuLength, searchCategoryId } =
    useKeyboard();

  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const latestMovies = useUnit($latestMovies);
  const filterSidebar = useUnit($filterSidebar);
  const activeFilter = useUnit($activeFilter);

  const prevSearchText = useRef("");

  const getPaginate = (paginate) => {
    setPageNumber(paginate + 1);
  };

  /* -------------------- Fetch Latest Movies -------------------- */
  const fetchLatestMovies = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${LATEST_URL}?api_key=${API_KEY}&language=en-US&page=${pageNum}`
      );
      const data = await response.json();

      if (pageNum === 1) {
        setLatestMovies(data.results); // Replace movies
      } else {
        addLatestMovies(data.results); // Append movies
      }

      setHasMore(data.page < data.total_pages);
    } catch (err) {
      setError("Failed to fetch latest movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Fetch Search Movies -------------------- */
  const fetchMovies = async (pageNum = 1) => {
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
        )}&language=en-US&page=${pageNum}&include_adult=false`
      );
      const data = await response.json();

      setMovies((prevMovies) =>
        pageNum === 1 ? data.results : [...prevMovies, ...data.results]
      );

      setHasMore(data.page < data.total_pages);
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!filterSidebar.selected) return;

    const fetchByFilter = async () => {
      try {
        setLoading(true);
        setError(null);

        let url_d = `${DISCOVER_URL}?api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
        let url_s = `${SEARCH_URL}?api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
        let url;
        const { filter, item } = filterSidebar.selected;

        if (filter === "Genres") {
          url = `${url_d}&with_genres=${item.id}`;
        } else if (filter === "Year") {
          url = `${url_d}&primary_release_year=${item}`;
        } else if (filter === "Categories") {
          url = `${url_d}&query=${item}`;
        } else if (filter === "Countries") {
          url = `${url_d}&with_origin_country=${item.code}`;
        } else if (filter === "Subtitles") {
          url = `${url_d}&with_original_language=${item.code}`;
        } else {
          url = `${url_s}&query=${encodeURIComponent(item)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        setError("Failed to fetch movies for this filter.");
      } finally {
        setLoading(false);
        resetFilter();
        setActiveFilter(null);
      }
    };

    fetchByFilter();
  }, [filterSidebar.selected]);

  /* -------------------- Initialize Latest Movies -------------------- */
  useEffect(() => {
    // Fetch only when no data available
    if (latestMovies.length === 0) {
      fetchLatestMovies(1);
    }
  }, []);

  /* -------------------- Sync Movies with Latest Movies -------------------- */
  useEffect(() => {
    if (!searchText) {
      setMovies(latestMovies);
    }
  }, [latestMovies, searchText]);

  /* -------------------- Load More Movies -------------------- */
  useEffect(() => {
    if (!searchText) {
      const expectedMovies = pageNumber * 20;

      if (latestMovies.length < expectedMovies) {
        fetchLatestMovies(pageNumber);
      }
    } else {
      fetchMovies(pageNumber);
    }
  }, [pageNumber, searchText]);

  /* -------------------- Reset Pagination on Search Change -------------------- */
  useEffect(() => {
    setPageNumber(1);
  }, [searchText]);

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
          <KeyboardInput onInputChange={(text) => setSearchText(text)} />
        </div>

        {/* Filters */}
        <div className="flex gap-3 justify-center mt-4 w-full">
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`rounded-lg py-2 text-2xl hover:bg-gray-600 w-full transition-colors duration-300 ${
                searchCategoryId === index ? "bg-gray-700" : "bg-gray-800"
              }`}
              onClick={() => {
                setActiveFilter(filter);
                setFilterItems(filterOptions[filter]);
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Movie Results */}
        <div className="flex-1 overflow-y-auto mt-4">
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && filteredMovies.length === 0 && (
            <p className="text-center text-gray-400">No results found.</p>
          )}
          {filteredMovies.length > 0 && (
            <SearchMovies
              id="movies-slider"
              title=""
              movies={filteredMovies}
              paginate={getPaginate}
            />
          )}
        </div>
      </div>

      {/* Right Filter Sidebar */}
      {activeFilter && (
        <div className="absolute right-0 top-0 h-screen w-[24%] bg-gray-700 text-white p-4 overflow-hidden z-50">
          <h3 className="text-4xl font-bold mb-4 p-4">{activeFilter}</h3>
          <div className="flex flex-col gap-2">
            {filterOptions[activeFilter]
              ?.slice(
                filterSidebar.scrollOffset,
                filterSidebar.scrollOffset + filterSidebar.visibleCount
              )
              .map((item, index) => {
                const globalIndex = filterSidebar.scrollOffset + index;
                const isActive = globalIndex === filterSidebar.activeIndex;

                return (
                  <button
                    key={item.id ?? item.name ?? index}
                    className={`py-6 px-4 rounded-lg text-3xl text-left transition-colors duration-200 ${
                      isActive ? "bg-gray-200 text-black" : "text-gray-200"
                    }`}
                    onClick={() => {
                      setFilterSelection({ filter: activeFilter, item });
                    }}
                  >
                    {item.name ?? item}
                  </button>
                );
              })}
          </div>
        </div>
      )}

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
    </div>
  );
}
