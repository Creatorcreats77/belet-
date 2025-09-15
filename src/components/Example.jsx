import React, { useEffect } from "react";
import { useUnit } from "effector-react";
import { setCounter, $counter, increament, decreament } from "../model/example";

const Example = () => {

    const [$counterr, setCounterr] = useUnit([$counter, setCounter]);

  return (
    <div>
      <button className="btn p-3 bg-amber-400 text-2xl" onClick={() => setCounterr(3)}>Set it</button>
      <hr />
      <button className="btn p-3 bg-amber-400 text-2xl" onClick={() => increament(34)}>+</button>
      <hr />
      <button className="btn p-3 bg-amber-400 text-2xl" onClick={() => decreament(5)}>-</button>

      <div>{$counterr.a}</div>
    </div>
  );
};

export default Example;
