import React, { useState, useEffect } from "react";

const TvKeyCode = {
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
  KEY_ENTER: 13,
  KEY_BACK: 0,
};

const sidebarItems = ["Home", "Search", "Settings", "About"];
const gridItems = Array.from({ length: 12 }, (_, i) => `Card ${i + 1}`);
const NUM_COLUMNS = 3;

export default function Remote() {
  const [focusedRegion, setFocusedRegion] = useState("sidebar");
  const [sidebarIndex, setSidebarIndex] = useState(0);
  const [gridIndex, setGridIndex] = useState(0);

  const handleKeyDown = (e) => {
    switch (focusedRegion) {
      case "sidebar":
        if (e.keyCode === TvKeyCode.KEY_DOWN) {
          if (sidebarIndex < sidebarItems.length - 1) setSidebarIndex(sidebarIndex + 1);
        } else if (e.keyCode === TvKeyCode.KEY_UP) {
          if (sidebarIndex > 0) setSidebarIndex(sidebarIndex - 1);
        } else if (e.keyCode === TvKeyCode.KEY_RIGHT) {
          // move focus to main grid
          setFocusedRegion("mainGrid");
        } else if (e.keyCode === TvKeyCode.KEY_ENTER) {
          alert(`Sidebar selected: ${sidebarItems[sidebarIndex]}`);
        }
        break;

      case "mainGrid":
        let newIndex = gridIndex;
        if (e.keyCode === TvKeyCode.KEY_LEFT) {
          if (gridIndex % NUM_COLUMNS === 0) {
            // switch to sidebar if at left edge
            setFocusedRegion("sidebar");
          } else {
            newIndex = gridIndex - 1;
          }
        } else if (e.keyCode === TvKeyCode.KEY_RIGHT) {
          if ((gridIndex + 1) % NUM_COLUMNS !== 0 && gridIndex < gridItems.length - 1)
            newIndex = gridIndex + 1;
        } else if (e.keyCode === TvKeyCode.KEY_UP) {
          if (gridIndex - NUM_COLUMNS >= 0) newIndex = gridIndex - NUM_COLUMNS;
        } else if (e.keyCode === TvKeyCode.KEY_DOWN) {
          if (gridIndex + NUM_COLUMNS < gridItems.length) newIndex = gridIndex + NUM_COLUMNS;
        } else if (e.keyCode === TvKeyCode.KEY_ENTER) {
          alert(`Grid selected: ${gridItems[gridIndex]}`);
        }
        setGridIndex(newIndex);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedRegion, sidebarIndex, gridIndex]);

  return (
    <div className="flex h-screen bg-gray-900 text-white p-4">
      {/* Sidebar */}
      <div className="flex flex-col gap-4 w-48">
        {sidebarItems.map((item, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg text-lg transition-colors ${
              focusedRegion === "sidebar" && sidebarIndex === i
                ? "bg-cyan-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 ml-8 flex-1">
        {gridItems.map((item, i) => (
          <div
            key={i}
            className={`w-48 h-32 flex items-center justify-center rounded-lg text-xl transition-transform duration-200
            ${
              focusedRegion === "mainGrid" && gridIndex === i
                ? "scale-110 shadow-2xl bg-cyan-500 text-white"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
