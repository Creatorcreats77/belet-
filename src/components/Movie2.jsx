import React, { useEffect, useState } from "react";

const API_KEY = '8ef128e645b6cc47fe1ff2b61dd975ef';



const Movie2 = () => {
    const [movies, setMovies] = useState([]);


    useEffect(() => {
    async function fetchLatestMovie() {
      try {
        const res = await fetch(
        //   `https://api.themoviedb.org/3/movie/latest?api_key=${API_KEY}&language=en-US`. 
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&page=1`
        );
        const data = await res.json();
        setMovies(data.results);
      } catch (err) {
        console.error("Error fetching latest movie:", err);
      }
    }



async function fetch100MoviesParallel() {
  const promises = [];
  for (let page = 1; page <= 10; page++) {
    promises.push(
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&page=${page}`
      ).then((res) => res.json())
    );
  }

  const results = await Promise.all(promises);
  const movies = results.flatMap((r) => r.results); // merge all 5 pages
  return movies;
}

    // fetchLatestMovie();

    fetch100MoviesParallel().then((movies) => {
  setMovies(movies);
});
  }, []);

   if (!movies) return <p className="text-black">Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4 p-6 text-black">
      {movies.map((movie) => (
        movie.poster_path ?
        <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg"
            //   loading="lazy"
            />
          )}
          <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
          <p className="text-sm text-gray-400">{movie.release_date}</p>
        </div>
        : null
      ))}
    </div>
  );
}

export default Movie2




