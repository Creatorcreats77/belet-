// store/moviesStore.js
import { createStore, createEvent, sample } from "effector";

export const setCategories = createEvent(); // To set all categories at once

export const $categories = createStore([]) // Array of {id, title, movies}
  .on(setCategories, (_, payload) => payload);


//   $categories.watch((value) => {
//   console.log("Categories updated:", value);
// });