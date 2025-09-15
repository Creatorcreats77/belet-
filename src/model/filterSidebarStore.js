import { createStore, createEvent } from "effector";

export const setFilterItems = createEvent();      // when opening a filter sidebar
export const moveFilterUp = createEvent();
export const moveFilterDown = createEvent();
export const resetFilter = createEvent();
export const selectFilterItem = createEvent();

export const setActiveFilter = createEvent();
export const setFilterSelection = createEvent(); // ✅ fired when user confirms a filter

const initialState = {
  items: [],          // filter options for active filter
  activeIndex: 0,     // currently highlighted item
  scrollOffset: 0,    // how much we scrolled
  visibleCount: 11,    // number of visible items without overflow
  selected: null,     // ✅ track which filter option was chosen
};

export const $activeFilter = createStore(null).on(setActiveFilter, (_, filter) => filter);

export const $filterSidebar = createStore(initialState)
  .on(setFilterItems, (state, items) => ({
    ...state,
    items,
    activeIndex: 0,
    scrollOffset: 0,
    selected: null, // reset selection when opening a new filter
  }))
  .on(moveFilterUp, (state) => {
    if (state.activeIndex > 0) {
      const newIndex = state.activeIndex - 1;
      const newOffset =
        newIndex < state.scrollOffset ? state.scrollOffset - 1 : state.scrollOffset;

      return { ...state, activeIndex: newIndex, scrollOffset: newOffset };
    }
    return state;
  })
  .on(moveFilterDown, (state) => {
    if (state.activeIndex < state.items.length - 1) {
      const newIndex = state.activeIndex + 1;
      const newOffset =
        newIndex >= state.scrollOffset + state.visibleCount
          ? state.scrollOffset + 1
          : state.scrollOffset;

      return { ...state, activeIndex: newIndex, scrollOffset: newOffset };
    }
    return state;
  })
  .on(resetFilter, () => initialState)
  .on(selectFilterItem, (state) => state) // can extend this later
  .on(setFilterSelection, (state, payload) => ({
    ...state,
    selected: payload,
  }));
