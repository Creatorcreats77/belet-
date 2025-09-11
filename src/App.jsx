import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { $categories, setCategories } from "./model/categories";
import { setTotalMovies } from "./model/movie";
import { setTotalSlides } from "./model/sliderStore";

// Components
import OnBoardingPage from "./components/OnBoardingPage";
import Loading from "./components/Loading";
import HomePage from "./components/HomePage";
import MoviePage from "./components/MoviePage";

// Global Keyboard Context
import { KeyboardProvider } from "./components/KeyboardContext";
import Search from "./components/Search";
import QRWithLogo from "./components/QRWithLogo";

const API_KEY = "8ef128e645b6cc47fe1ff2b61dd975ef";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [mainMovie, setMainMovie] = useState(null);
  const categories = useUnit($categories);

  /** Fetch multiple pages from TMDB */
  async function fetchMultiplePages(url, totalPages = 2) {
    const promises = [];
    for (let page = 1; page <= totalPages; page++) {
      promises.push(fetch(`${url}&page=${page}`).then((res) => res.json()));
    }
    const results = await Promise.all(promises);
    return results.flatMap((r) => r.results);
  }

  /** Fetch all categories */
  async function fetchAllCategories() {
    setShowLoading(true);
    try {
      const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;

      const urls = {
        best: `${BASE_URL}&sort_by=vote_average.desc&vote_count.gte=1000`,
        history: `${BASE_URL}&with_genres=36`,
        turkish: `${BASE_URL}&with_original_language=tr`,
        kids: `${BASE_URL}&with_genres=16,10751`,
        anime: `${BASE_URL}&with_genres=16&with_original_language=ja`,
        american: `${BASE_URL}&with_original_language=en`,
        new: `${BASE_URL}&sort_by=release_date.desc`,
      };

      const [
        bestRes,
        historyRes,
        turkishRes,
        kidsRes,
        animeRes,
        americanRes,
        newRes,
      ] = await Promise.all([
        fetchMultiplePages(urls.best),
        fetchMultiplePages(urls.history),
        fetchMultiplePages(urls.turkish),
        fetchMultiplePages(urls.kids),
        fetchMultiplePages(urls.anime),
        fetchMultiplePages(urls.american),
        fetchMultiplePages(urls.new),
      ]);

      const categoriesArray = [
        { id: 0, title: "Best Movies", movies: bestRes },
        { id: 1, title: "History Movies", movies: historyRes },
        { id: 2, title: "Turkish Movies", movies: turkishRes },
        { id: 3, title: "Kids Movies", movies: kidsRes },
        { id: 4, title: "Anime", movies: animeRes },
        { id: 5, title: "American Movies", movies: americanRes },
        { id: 6, title: "New Movies", movies: newRes },
      ];

      // Save categories to Effector store
      setCategories(categoriesArray);

      // Calculate total slides per category
      categoriesArray.forEach((category) => {
        const validMovies = category.movies.filter(
          (movie) => movie.poster_path && movie.poster_path.trim() !== ""
        );
        setTotalSlides({
          id: category.id,
          value: validMovies.length,
        });
      });

      // Total number of categories
      setTotalMovies(categoriesArray.length);

      // Set a random main movie from History category
      const historyCategory = categoriesArray.find((cat) => cat.id === 1);
      if (historyCategory?.movies?.length > 0) {
        const maxIndex = Math.min(19, historyCategory.movies.length - 1);
        const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
        setMainMovie(historyCategory.movies[randomIndex]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setShowLoading(false);
    }
  }

  /** Fetch categories on mount */
  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (

<KeyboardProvider>
        <Routes>
          <Route
            path="/"
            element={
              showOnboarding ? (
                <OnBoardingPage onFinish={() => setShowOnboarding(false)} />
              ) : showLoading ? (
                <Loading />
              ) : (
                mainMovie && <HomePage mainMovie={mainMovie} />
              )
            }
          />
          <Route
            path="/onboarding"
            element={<OnBoardingPage onFinish={() => setShowOnboarding(false)} />}
          />
          <Route
            path="home/"
            element={mainMovie && <HomePage mainMovie={mainMovie} />}
          />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/search" element={<Search />} />
                    {/* <Route path="/search" element={<QRWithLogo />} /> */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </KeyboardProvider>
  );
}

export default App;
