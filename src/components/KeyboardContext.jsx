// src/context/KeyboardContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Form, useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { $movieOpen, setmovieOpen } from "../model/movie";
import { $movieId, upMovie, downMovie, setmovieId } from "../model/movie";
import {
  $current,
  $activeIndex,
  setCurrent,
  setActiveIndex,
  nextSlide,
  prevSlide,
} from "../model/sliderStore";
import {
  nextSlideSearch,
  prevSlideSearch,
  setMovieIdSearch,
} from "../model/searchMoviesStore";

import {
  moveFilterUp,
  moveFilterDown,
  setFilterItems,
  selectFilterItem,
  setActiveFilter,
  $filterSidebar,
  resetFilter,
  setFilterSelection,
} from "../model/filterSidebarStore";
import { resetSearchMovies } from "../model/searchMoviesStore";
import { $categories } from "../model/categories";
import { filterOptions, filters } from "../model/filterOptions";
import { setCurrentIndex } from "../model/movieContainer";

// TV remote / keyboard key codes
const TvKeyCode = {
  LEFT: [37],
  UP: [38],
  RIGHT: [39],
  DOWN: [40],
  ENTER: [13, 23, 415],
  BACK: [8, 27, 0, 461, 10009, 412],
};

const KeyboardContext = createContext(null);

export const KeyboardProvider = ({ children }) => {
  const navigate = useNavigate();

  // Effector states
  const [next, prev] = useUnit([nextSlide, prevSlide]);
  const [current, activeIndex] = useUnit([$current, $activeIndex]);
  const [setCur, setAct] = useUnit([setCurrent, setActiveIndex]);
  const [movieOpen, setMovieOpen] = useUnit([$movieOpen, setmovieOpen]);
  const [movieId, setMovieId] = useUnit([$movieId, setmovieId]);
  const [up, down] = useUnit([upMovie, downMovie]);
  const categories = useUnit($categories);

  const [horizontalIndexForMoviePage, setHorizontalIndexForMoviePage] =
    useState(1);
  const [verticalIndexMoviePage, setVerticalIndexMoviePage] = useState(1);

  const [goBack, setGoBack] = useState("");

  const activeIndexRef = useRef(activeIndex);
  const currentRef = useRef(current);
  const movieIdRef = useRef(movieId);
  const searchMoviesRef = useRef();

  const activeFilterRef = useRef(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    movieIdRef.current = movieId;
  }, [movieId]);

  // UI states
  const [focusedRegion, setFocusedRegion] = useState("home");
  const [sidebarIndex, setSidebarIndex] = useState(0);
  const [menuLength, setMenuLength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [movieFocusedIndex, setMovieFocusedIndex] = useState(true);
  const [navigateToMovieDetail, setNavigateToMovieDetail] = useState(false);
  const [navigateToMovieDetailHome, setNavigateToMovieDetailHome] =
    useState(false);

  const [moviePageSidebar, setMoviePageSidebar] = useState(false);

  const [searchPageSidebar, setSearchPageSidebar] = useState(false);
  const [searchCategoryPageSidebar, setSearchCategoryPageSidebar] =
    useState(false);

  const [searchCategoryId, setSearchCategoryId] = useState(-1);
  const searchCategoryIdRef = useRef(searchCategoryId);

  useEffect(() => {
    searchCategoryIdRef.current = searchCategoryId;
  }, [searchCategoryId]);

  let scrollIndex = 0;
  let scrollIndexUp = 0;
  let movId = 0;

  /** -------------------------
   *  GLOBAL KEYBOARD HANDLER
   * ------------------------- */
  const handleKeyDown = (e) => {
    switch (focusedRegion) {
      /** ================= HOME REGION ================= */
      case "home":
        console.log("inside home");

        if (TvKeyCode.UP.includes(e.keyCode)) {
          setMovieOpen(false);
          setFocusedRegion("home");
        } else if (TvKeyCode.DOWN.includes(e.keyCode)) {
          setFocusedRegion("movie");
          setMovieOpen(true);
          if (movieId === -1) down();
        } else if (TvKeyCode.LEFT.includes(e.keyCode)) {
          if (!movieOpen) setMovieFocusedIndex(false);
          setIsOpen(!isOpen);
          setGoBack("home");

          setFocusedRegion("sidebar");
        } else if (TvKeyCode.RIGHT.includes(e.keyCode)) {
          console.log("RIGHT key pressed in home");
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          setNavigateToMovieDetailHome(true);

          setGoBack("home");
          setFocusedRegion("moviePage");
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          console.log("BACK key pressed in home");
          setIsOpen(!isOpen);
        }
        break;

      /** ================= MOVIE REGION ================= */
      case "movie":
        console.log("inside movie");

        if (TvKeyCode.UP.includes(e.keyCode)) {
          setTimeout(() => {
            movId = movieIdRef.current;
            up();
            if (movId === 0) {
              setFocusedRegion("home");
              setMovieOpen(false);
            }
          }, 0);
        } else if (TvKeyCode.DOWN.includes(e.keyCode)) {
          scrollIndexUp = 0;
          setTimeout(() => down(), 0);
        } else if (TvKeyCode.LEFT.includes(e.keyCode)) {
          movId = movieIdRef.current;
          const checkMovieid = activeIndexRef.current?.[movId] ?? 0;
          scrollIndex -= 1;
          scrollIndexUp -= 1;
          if (checkMovieid === 0) {
            setIsOpen(!isOpen);
            setGoBack("movie");

            setFocusedRegion("sidebar");
          } else {
            setTimeout(() => prev(movId), 0);
          }
        } else if (TvKeyCode.RIGHT.includes(e.keyCode)) {
          setTimeout(() => {
            if (scrollIndex < 4) {
              scrollIndex += 1;
              scrollIndexUp += 1;
            }
            movId = movieIdRef.current;
            next(movId);
          }, 0);
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          setNavigateToMovieDetail(true);
          setFocusedRegion("moviePage");
          setGoBack("movie");
          console.log("I am inside");
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          console.log("BACK key pressed in movie");
        }
        break;

      /** ================= MOVIE PAGE REGION ================= */
      case "moviePage":
        console.log("inside moviePage movie");

        if (TvKeyCode.UP.includes(e.keyCode)) {
          setHorizontalIndexForMoviePage((prev) =>
            prev > 0 ? prev - 1 : prev
          );
        } else if (TvKeyCode.DOWN.includes(e.keyCode)) {
          setHorizontalIndexForMoviePage((prev) =>
            prev < 4 ? prev + 1 : prev
          );
        } else if (TvKeyCode.LEFT.includes(e.keyCode)) {
          setVerticalIndexMoviePage((prev) => {
            const newValue = prev > 0 ? prev - 1 : prev;

            console.log("Updated vertical Index:", newValue);

            if (newValue === 0) {
              setIsOpen(true); // don't use !isOpen if you need reliable toggling
              setMoviePageSidebar(true);
              setSearchPageSidebar(false);
              setFocusedRegion("sidebar");
            }

            return newValue;
          });
        } else if (TvKeyCode.RIGHT.includes(e.keyCode)) {
          setVerticalIndexMoviePage((prev) => (prev < 3 ? prev + 1 : prev));
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          // navigate("/homeDetail");
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          console.log(goBack);
          if (goBack === "home") {
            console.log("Go back home");
            setFocusedRegion("home");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          } else if (goBack === "movie") {
            setFocusedRegion("movie");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          } else if (goBack === "search") {
            setIsOpen(false);
            setMoviePageSidebar(false);
            setFocusedRegion("searchMovies");
            setSearchPageSidebar(true);
            setGoBack('home');
            navigate(-1);
          }
        }
        break;
      /** ================= SEARCH REGION ================= */
      case "search":
        console.log("inside Search ");

        if (TvKeyCode.UP.includes(e.keyCode)) {
        } else if (TvKeyCode.DOWN.includes(e.keyCode)) {
        } else if (TvKeyCode.LEFT.includes(e.keyCode)) {
        } else if (TvKeyCode.RIGHT.includes(e.keyCode)) {
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          // navigate("/homeDetail");
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          console.log(",,,,,,,,,", goBack)
          if (goBack === "home") {
            console.log("Go back home");
            setFocusedRegion("home");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          } else if (goBack === "movie") {
            setFocusedRegion("movie");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          }
        }
        break;

      case "searchMovies":
        console.log("inside Search Category ");
        if (TvKeyCode.UP.includes(e.keyCode)) {
          setFocusedRegion("searchCategory");
          setMovieIdSearch({ id: "movies-slider", index: -1 });
        } else if (TvKeyCode.DOWN.includes(e.keyCode)) {
        } else if (TvKeyCode.LEFT.includes(e.keyCode)) {
          prevSlideSearch("movies-slider");
          console.log("clicked right");
        } else if (TvKeyCode.RIGHT.includes(e.keyCode)) {
          nextSlideSearch("movies-slider");
          console.log("clicked left");
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          setNavigateToMovieDetail(true);
          setFocusedRegion("moviePage");
          setGoBack("search");
          // navigate("/homeDetail");
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          if (goBack === "home") {
            console.log("Go back home");
            setFocusedRegion("home");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          } else if (goBack === "movie") {
            setFocusedRegion("movie");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          }
        }
        break;

      case "filterSidebar":
        console.log("inside filter sidebar");
        if (TvKeyCode.UP.includes(e.keyCode)) moveFilterUp();
        else if (TvKeyCode.DOWN.includes(e.keyCode)) moveFilterDown();
        else if (TvKeyCode.LEFT.includes(e.keyCode)) {
          setActiveFilter(0);
          setFocusedRegion("searchCategory");
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          const { items, activeIndex } = $filterSidebar.getState();
          const item = items[activeIndex];
          resetSearchMovies();
          setFilterSelection({ filter: activeFilterRef.current, item });
          setMovieIdSearch({ id: "movies-slider", index: 0 });

          // resetFilter();
          setSearchCategoryPageSidebar(false);
          setFocusedRegion("searchMovies"); // go to movies after selection
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          setActiveFilter(0);
          setFocusedRegion("searchCategory");
        }
        break;

      case "searchCategory":
        console.log("inside Search Category ");

        if (TvKeyCode.UP.includes(e.keyCode)) {
          setFocusedRegion("search");
          setSearchCategoryPageSidebar(false);
        } else if (TvKeyCode.DOWN.includes(e.keyCode)) {
          setFocusedRegion("searchMovies");
          setMovieIdSearch({ id: "movies-slider", index: 0 });
          setSearchCategoryPageSidebar(false);
        } else if (TvKeyCode.LEFT.includes(e.keyCode)) {
          setSearchCategoryId((prev) => {
            const newId = prev > 0 ? prev - 1 : -1; // allow -1
            if (newId === -1) {
              setSearchCategoryPageSidebar(true);
              setFocusedRegion("sidebar");
              setIsOpen(!isOpen);
            }
            searchCategoryIdRef.current = newId; // update ref immediately
            console.log("LEFT → newId:", newId, "filterName:", filters[newId]);
            return newId;
          });

          console.log("LEFT currentId (ref):", searchCategoryIdRef.current);
        } else if (TvKeyCode.RIGHT.includes(e.keyCode)) {
          setSearchCategoryId((prev) => {
            const newId = prev < filters.length - 1 ? prev + 1 : prev;
            searchCategoryIdRef.current = newId; // update ref immediately
            console.log("RIGHT → newId:", newId, "filterName:", filters[newId]);
            return newId;
          });

          console.log("RIGHT currentId (ref):", searchCategoryIdRef.current);
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          const currentId = searchCategoryIdRef.current; // use ref, not state
          console.log("ENTER clicked → id:", currentId);

          const filterName = filters[currentId];
          console.log("filterName:", filterName);

          if (filterName) {
            setActiveFilter(filterName);
            activeFilterRef.current = filterName;
            setFilterItems(filterOptions[filterName]);
            setFocusedRegion("filterSidebar");
          }
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          if (goBack === "home") {
            setFocusedRegion("home");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          } else if (goBack === "movie") {
            setFocusedRegion("movie");
            setMovieFocusedIndex(true);
            setSearchPageSidebar(false);
            navigate("/");
          }
        }
        break;

      /** ================= SIDEBAR REGION ================= */
      case "sidebar":
        console.log("inside sidebar");

        let newIndex = sidebarIndex;

        if (TvKeyCode.UP.includes(e.keyCode)) {
          if (newIndex > 0) newIndex -= 1;
        } else if (TvKeyCode.DOWN.includes(e.keyCode)) {
          if (newIndex < menuLength + 3) newIndex += 1;
        } else if (TvKeyCode.LEFT.includes(e.keyCode)) {
          console.log("LEFT key pressed in sidebar");
        } else if (TvKeyCode.RIGHT.includes(e.keyCode)) {
          console.log("searchPage", searchPageSidebar);
          if (moviePageSidebar) {
            console.log("moviePageSidebar");
            setVerticalIndexMoviePage((prev) => (prev < 3 ? prev + 1 : prev));
          }
          if (searchCategoryPageSidebar) {
            setSearchCategoryId((prev) => (prev < 7 ? prev + 1 : prev));
          }
          setFocusedRegion(
            searchCategoryPageSidebar
              ? "searchCategory"
              : searchPageSidebar
              ? "search"
              : moviePageSidebar
              ? "moviePage"
              : movieOpen
              ? "movie"
              : "home"
          );
          console.log("+++++++++++++++++ focused Region", focusedRegion);
          setIsOpen(!isOpen);
          if (!movieOpen) setMovieFocusedIndex(true);
        } else if (TvKeyCode.ENTER.includes(e.keyCode)) {
          if (newIndex === 2) {
            setIsOpen(false);
            setMoviePageSidebar(false);
            setFocusedRegion("search");
            setSearchPageSidebar(true);
            navigate("/search");
          }
          if (newIndex === 3) {
            setIsOpen(false);
            setMoviePageSidebar(false);
            setSearchPageSidebar(false);
            setSearchCategoryPageSidebar(false);
            setMovieOpen(false);
            setMovieFocusedIndex(true);
            setFocusedRegion("home");

            navigate("/");
          }
        } else if (TvKeyCode.BACK.includes(e.keyCode)) {
          setIsOpen(!isOpen);
          // setFocusedRegion("home
        }

        setSidebarIndex(newIndex);
        break;

      default:
        break;
    }
  };

  /** Attach global key listener */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedRegion, sidebarIndex, movieOpen]);

  return (
    <KeyboardContext.Provider
      value={{
        focusedRegion,
        setFocusedRegion,
        sidebarIndex,
        setSidebarIndex,
        movieOpen,
        setMovieOpen,
        isOpen,
        setIsOpen,
        categories,
        movieFocusedIndex,
        setMovieFocusedIndex,
        setMenuLength,
        horizontalIndexForMoviePage, // ✅ add this
        verticalIndexMoviePage,
        navigateToMovieDetail,
        setNavigateToMovieDetail,
        searchPageSidebar,
        setSearchPageSidebar,
        searchCategoryId,
        setSearchCategoryId,
        movieId,
        navigateToMovieDetailHome,
        setNavigateToMovieDetailHome,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => useContext(KeyboardContext);
