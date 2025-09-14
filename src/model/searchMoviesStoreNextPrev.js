import { createStore, createEvent, sample } from "effector";

export const nextSlideSearch = createEvent();
export const prevSlideSearch = createEvent();
export const setMovieIdSearch = createEvent();
export const setMoviesLength = createEvent();
export const resetSearchMovies = createEvent();

export const $activeIndexSearch = createStore({});
export const $currentSearch = createStore({});
export const $movieIdSearch = createStore({ id: null, index: -1 });
export const $moviesLength = createStore({});

export const setActiveIndexSearch = createEvent();

$activeIndexSearch.on(setActiveIndexSearch, (state, { id, index }) => ({
  ...state,
  [id]: index,
}));

const visibleSlides = 5;

/* ---------------- Store movie length by carousel id ---------------- */
sample({
  clock: setMoviesLength,
  source: $moviesLength,
  fn: (state, { id, length }) => ({ ...state, [id]: length }),
  target: $moviesLength,
});

/* ---------------- Move active index forward ---------------- */
sample({
  clock: nextSlideSearch,
  source: { activeIndex: $activeIndexSearch, moviesLength: $moviesLength },
  fn: ({ activeIndex, moviesLength }, id) => {
    const currentIndex = activeIndex[id] ?? 0;
    const totalMovies = moviesLength[id] ?? 0;

    if (totalMovies <= 0) return activeIndex; // Prevent invalid navigation

    return {
      ...activeIndex,
      [id]: Math.min(currentIndex + 1, totalMovies - 1),
    };
  },
  target: $activeIndexSearch,
});

/* ---------------- Move active index backward ---------------- */
sample({
  clock: prevSlideSearch,
  source: $activeIndexSearch,
  fn: (activeIndex, id) => ({
    ...activeIndex,
    [id]: Math.max((activeIndex[id] ?? 0) - 1, 0),
  }),
  target: $activeIndexSearch,
});

/* ---------------- Update current scroll window ---------------- */
sample({
  clock: $activeIndexSearch,
  source: $currentSearch,
  fn: (current, activeIndex) => {
    const newCurrent = { ...current };

    for (const id in activeIndex) {
      const active = activeIndex[id];
      const curr = current[id] ?? 0;

      if (active > curr + visibleSlides - 1) {
        newCurrent[id] = active - visibleSlides + 1;
      } else if (active < curr) {
        newCurrent[id] = active;
      }
    }

    return newCurrent;
  },
  target: $currentSearch,
});

/* ---------------- Set active movie ---------------- */
sample({
  clock: setMovieIdSearch,
  fn: ({ id, index }) => ({ id, index }),
  target: $movieIdSearch,
});

/* ---------------- Reset EVERYTHING on new search ---------------- */
sample({
  clock: resetSearchMovies,
  fn: () => ({}),
  target: [$activeIndexSearch, $currentSearch, $moviesLength],
});

sample({
  clock: resetSearchMovies,
  fn: () => ({ id: null, index: -1 }),
  target: $movieIdSearch,
});
