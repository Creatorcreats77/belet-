import { createStore, createEvent, sample } from "effector";

// ===== EVENTS =====
export const setCurrent = createEvent();       // { id, value }
export const setActiveIndex = createEvent();   // { id, value }
export const nextSlide = createEvent();        // id
export const prevSlide = createEvent();        // id
export const setTotalSlides = createEvent();   // { id, value }

// ===== CONFIGURATION =====
const visibleSlides = 5;

// ===== STORES =====
// $current: starting index of the visible window for each carousel
export const $current = createStore({})
  .on(setCurrent, (state, { id, value }) => ({
    ...state,
    [id]: value,
  }));

// $activeIndex: currently active slide for each carousel
export const $activeIndex = createStore({})
  .on(setActiveIndex, (state, { id, value }) => ({
    ...state,
    [id]: value,
  }));

// $totalSlides: total slides per carousel
export const $totalSlides = createStore({})
  .on(setTotalSlides, (state, { id, value }) => ({
    ...state,
    [id]: value,
  }));

// Previous values for tracking changes
export const $prevActiveIndex = $activeIndex.map((state, oldState) => oldState ?? {});
export const $prevCurrent = $current.map((state, oldState) => oldState ?? {});

// ===== LOGIC =====

// Move activeIndex forward
sample({
  clock: nextSlide,
  source: { activeIndex: $activeIndex, totalSlides: $totalSlides },
  fn: ({ activeIndex, totalSlides }, id) => {
    const currentIndex = activeIndex[id] ?? 0;
    const maxIndex = totalSlides[id] ?? 0;
    return { id, value: Math.min(currentIndex + 1, maxIndex - 1) };
  },
  target: setActiveIndex,
});

// Move activeIndex backward
sample({
  clock: prevSlide,
  source: $activeIndex,
  fn: (activeIndex, id) => {
    const currentIndex = activeIndex[id] ?? 0;
    return { id, value: Math.max(currentIndex - 1, 0) };
  },
  target: setActiveIndex,
});

// Adjust current window (scroll position) when activeIndex changes
sample({
  clock: setActiveIndex,
  source: { current: $current, prevCurrent: $prevCurrent, totalSlides: $totalSlides },
  fn: ({ current, prevCurrent, totalSlides }, { id, value: activeIndex }) => {
    const currentWindow = current[id] ?? 0;
    const prevWindow = prevCurrent[id] ?? 0;
    const maxIndex = totalSlides[id] ?? 0;

    let newCurrent = currentWindow;

    // Scroll forward if activeIndex exceeds visible window
    if (activeIndex > currentWindow + visibleSlides - 1) {
      newCurrent = Math.min(currentWindow + 1, maxIndex - visibleSlides);
    }
    // Scroll backward if activeIndex is before the window
    else if (activeIndex < currentWindow) {
      newCurrent = Math.max(currentWindow - 1, 0);
    }

    return { ...current, [id]: newCurrent };
  },
  target: $current,
});
