import { createStore, createEvent, sample } from "effector";

// ===== Events =====
export const setmovieOpen = createEvent();
export const setmovieId = createEvent();
export const setSelectedMovieContainer = createEvent();
export const upMovie = createEvent();   // Move to previous movie (up visually)
export const downMovie = createEvent(); // Move to next movie
export const setTotalMovies = createEvent();

// ===== Total movies =====
export const $totalMovies = createStore(2).on(setTotalMovies, (_, value) => value);

// ===== Stores =====
export const $movieOpen = createStore(false).on(setmovieOpen, (_, value) => value);
export const $movieId = createStore(0).on(setmovieId, (_, value) => value);
export const $selectedMovieContainer = createStore(0).on(
  setSelectedMovieContainer,
  (_, value) => value
);

// --------------------
// Update $movieId
sample({
  clock: downMovie,
  source: { id: $movieId, total: $totalMovies },
  fn: ({ id, total }) => Math.min(id + 1, total - 1),
  target: setmovieId,
});

sample({
  clock: upMovie,
  source: { id: $movieId, total: $totalMovies },
  fn: ({ id }) => Math.max(id - 1, -1),
  target: setmovieId,
});

// Update $selectedMovieContainer
sample({
  clock: downMovie,
  source: { id: $selectedMovieContainer, total: $totalMovies },
  fn: ({ id, total }) => Math.min(id + 1, total - 1),
  target: setSelectedMovieContainer,
});

sample({
  clock: upMovie,
  source: { id: $selectedMovieContainer, total: $totalMovies },
  fn: ({ id }) => Math.max(id - 1, -1),
  target: setSelectedMovieContainer,
});

// --------------------
// Debugging logs
// $movieId.watch((value) => {
//   console.log("Updated movieId:", value);
// });

// $selectedMovieContainer.watch((value) => {
//   console.log("Updated selectedMovieContainer:", value);
// });
