import { createEvent } from "effector";
import { createStore } from "effector";

export const increament = createEvent();
export const decreament = createEvent();

export const setCounter = createEvent();

const store = 
{
    a: 1,
    b: 2
}

export const $counter = createStore(store)
.on(setCounter, (state, items) => ({...state, b: items+10}))
.on(increament, (state) => ({ a: state.a + 1, b: state.b + 1 }))
.on(decreament, (state) => ({ a: state.a - 1, b: state.b - 1 }));


$counter.watch( (value) => console.log(value));