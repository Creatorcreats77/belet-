// src/model/latestMoviesStore.js
import { createEvent, createStore } from "effector";

export const setLatestMovies = createEvent();
export const addLatestMovies = createEvent();
export const resetLatestMovies = createEvent();

export const $latestMovies = createStore([])
  .on(setLatestMovies, (_, movies) => movies) // Replace movies
  .on(addLatestMovies, (state, movies) => [...state, ...movies]) // Append movies
  .reset(resetLatestMovies);
