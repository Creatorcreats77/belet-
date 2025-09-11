import { createStore, createEvent } from "effector";

export const setCurrentIndex = createEvent();     
export const setActiveCurrentIndex = createEvent(); 


export const $currentIndex = createStore(0).on(setCurrentIndex, (_, value) => value);
export const $activeCurrentIndex = createStore(0).on(setActiveCurrentIndex, (_, value) => value);


$currentIndex.watch((CurrentIndex) => console.log("Current window start:", CurrentIndex));
$activeCurrentIndex.watch((ActiveCurrentIndex) => console.log("Active slide:", ActiveCurrentIndex));