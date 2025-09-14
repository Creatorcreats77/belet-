import React, { useEffect, useRef, useState } from "react";
import { useKeyboard } from "./KeyboardContext";

const englishLayout = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "."],
  ["⇧", "z", "x", "c", "v", "b", "n", "m", ",", "⌫"],
  ["&123", "EN", "Space", "Enter"],
];

const russianLayout = [
  ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з"],
  ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "."],
  ["⇧", "я", "ч", "с", "м", "и", "т", "ь", ",", "⌫"],
  ["&123", "RU", "Space", "Enter"],
];

const numbersLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
  ["⇧", ".", ",", "?", "!", "'", "⌫"],
  ["ABC", "Space", "Enter"],
];

export default function KeyboardInput({ onInputChange }) {
  const {
    focusedRegion,
    setFocusedRegion,
    isOpen,
    setIsOpen,
    setSearchCategoryId,
  } = useKeyboard();

  const [layout, setLayout] = useState(englishLayout);
  const [isShift, setIsShift] = useState(false);
  const flatKeys = layout.flat();

  const [value, setValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);

  const keyRefs = useRef([]);
  const inputRef = useRef(null);

  const [pendingAction, setPendingAction] = useState(null); 

  const [hasInteracted, setHasInteracted] = useState(false); 


  keyRefs.current = flatKeys.map(
    (_, i) => keyRefs.current[i] ?? React.createRef()
  );

  /* ----------------- Helpers to locate index ----------------- */
  function locate(index) {
    let count = 0;
    for (let r = 0; r < layout.length; r++) {
      const rowLen = layout[r].length;
      if (index < count + rowLen) {
        return { row: r, col: index - count };
      }
      count += rowLen;
    }
    return {
      row: layout.length,
      col: layout[layout.length - 1].length - 1,
    };
  }

  function toIndex(row, col) {
    let idx = 0;
    for (let r = 0; r < row; r++) idx += layout[r].length;
    return idx + col;
  }

  /* ----------------- Move focus logic ----------------- */
  function moveFocus(direction) {
    const { row, col } = locate(focusedIndex);
    let newRow = row;
    let newCol = col;

    if (direction === "left") {
      if (col === 0) {
        setPendingAction({ type: "GO_SIDEBAR" });
      } else if (col > 0) {
        newCol = col - 1;
      }
    }

    if (direction === "right") {
      if (col < layout[row].length - 1) newCol = col + 1;
    }

    if (direction === "up" && row > 0) {
      newRow = row - 1;
      newCol = Math.min(col, layout[newRow].length - 1);
    }

    if (direction === "down") {
      if (newRow === 3) {
        setPendingAction({ type: "GO_SEARCH_CATEGORY" });
        newRow = row + 1;
      } else if (newRow < 3) {
        newRow = row + 1;
        newCol = Math.min(col, layout[newRow].length - 1);
      }
    }

    const newIndex = toIndex(newRow, newCol);
    setFocusedIndex(newIndex);

    const ref = keyRefs.current[newIndex];
    if (ref && ref.current) ref.current.focus();
  }

  /* ----------------- Handle pending actions safely ----------------- */
  useEffect(() => {
    if (!pendingAction) return;

    if (pendingAction.type === "GO_SIDEBAR") {
      setFocusedRegion("sidebar");
      setIsOpen((prev) => !prev);
      console.log("Switched to sidebar");
    }

    if (pendingAction.type === "GO_SEARCH_CATEGORY") {
      setSearchCategoryId(0);
      setFocusedRegion("searchCategory");
      console.log("Moved to search category");
    }

    setPendingAction(null); // clear after handling
  }, [pendingAction, setFocusedRegion, setIsOpen, setSearchCategoryId]);

  /* ----------------- Key handling ----------------- */
  function handleEnterAction() {
    alert(`Submitted text: ${value}`);
    setValue("");
  }

  function pressKey(key) {
    if (key === "⌫") {
      setValue((v) => {
        const newValue = v.slice(0, -1);
        if (onInputChange) onInputChange(newValue);
        return newValue;
      });
      return;
    }

    if (key === "Space") {
      setValue((v) => {
        const newValue = v + " ";
        if (onInputChange) onInputChange(newValue);
        return newValue;
      });
      return;
    }

    if (key === "Enter") {
      handleEnterAction();
      return;
    }

    if (key === "⇧") {
      setIsShift((prev) => !prev);
      return;
    }

    if (key === "EN" || key === "RU") {
      setLayout((prev) =>
        prev === russianLayout ? englishLayout : russianLayout
      );
      return;
    }

    if (key === "&123") {
      setLayout(numbersLayout);
      return;
    }

    if (key === "ABC") {
      setLayout(englishLayout);
      return;
    }

    const charToAdd = isShift ? key.toUpperCase() : key;
    setValue((v) => {
      const newValue = v + charToAdd;
      if (onInputChange) onInputChange(newValue);
      return newValue;
    });
  }

  /* ----------------- Keyboard Navigation ----------------- */
const TvKeyCode = {
  LEFT: [37],
  UP: [38],
  RIGHT: [39],
  DOWN: [40],
  ENTER: [13, 23, 415],
  BACK: [8, 27, 0, 461, 10009, 412],
};

useEffect(() => {
  function handler(e) {
    const keyCode = e.keyCode || e.which;

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    // ---- LEFT ----
    if (e.key === "ArrowLeft" || TvKeyCode.LEFT.includes(keyCode)) {
      e.preventDefault();
      moveFocus("left");
      return;
    }

    // ---- RIGHT ----
    if (e.key === "ArrowRight" || TvKeyCode.RIGHT.includes(keyCode)) {
      e.preventDefault();
      moveFocus("right");
      return;
    }

    // ---- UP ----
    if (e.key === "ArrowUp" || TvKeyCode.UP.includes(keyCode)) {
      e.preventDefault();
      moveFocus("up");
      return;
    }

    // ---- DOWN ----
    if (e.key === "ArrowDown" || TvKeyCode.DOWN.includes(keyCode)) {
      e.preventDefault();
      moveFocus("down");
      return;
    }

    // ---- ENTER ----
    if (e.key === "Enter" || TvKeyCode.ENTER.includes(keyCode)) {
      e.preventDefault();
      pressKey(flatKeys[focusedIndex]);
      return;
    }

    // ---- SPACE ----
    if (e.key === " " || keyCode === 32) {
      e.preventDefault();
      pressKey("Space");
      return;
    }

    // ---- BACK ----
    if (TvKeyCode.BACK.includes(keyCode)) {
      e.preventDefault();
      console.log("Back button pressed");
      // Here you can trigger navigation back or close keyboard
    }
  }

  if (focusedRegion === "search" && !isOpen) {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }
}, [focusedRegion, isOpen, focusedIndex, layout, isShift, hasInteracted]);



  /* ----------------- Auto focus current key ----------------- */
  useEffect(() => {
    const ref = keyRefs.current[focusedIndex];
    if (ref && ref.current) ref.current.focus();
  }, [focusedIndex]);

  /* ----------------- Render key button ----------------- */
function KeyButton({ keyLabel, index }) {
  const displayLabel =
    keyLabel === "Space"
      ? "___"
      : isShift && /^[a-zа-яё]$/i.test(keyLabel)
      ? keyLabel.toUpperCase()
      : keyLabel;

  return (
    <button
      ref={keyRefs.current[index]}
      tabIndex={-1}
      onClick={() => {
        setFocusedIndex(index);
        setHasInteracted(true); 
        pressKey(keyLabel);
      }}
      onFocus={() => setFocusedIndex(index)}
      className={
        "rounded-lg p-3 w-[84%] text-center select-none focus:outline-none transition-shadow " +
        (keyLabel === "Space" ? "w-[6000px] " : "") +
        (keyLabel === "Enter" ? "w-[1800px] " : "") +
        (hasInteracted && index === focusedIndex 
          ? "ring-4 bg-gray-600 ring-offset-1 ring-blue-600 shadow-lg"
          : "bg-gray-700 hover:shadow")
      }
      aria-label={`Key ${keyLabel}`}
    >
      {displayLabel}
    </button>
  );
}


  /* ----------------- Render ----------------- */
  return (
    <div className="w-[84%] mx-auto text-2xl">
      <div className="mb-4"></div>
      <div className="space-y-3 p-4 rounded-lg">
        {layout.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2 justify-center">
            {row.map((k, cIdx) => {
              const idx = toIndex(rIdx, cIdx);
              return <KeyButton key={idx} keyLabel={k} index={idx} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
