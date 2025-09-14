


// File: src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import Row from './components/Row';
import { movieData } from './data';

export default function App2() {
  const [activeRow, setActiveRow] = useState(0);
  const [activeIndices, setActiveIndices] = useState(() => movieData.map(() => 0));
  const [lastInteraction, setLastInteraction] = useState('horizontal');

  // refs so we can query DOM positions across rows
  const rowRefs = useRef([]);

  const registerRowRef = (index, node) => {
    rowRefs.current[index] = node;
  };

  const getCardCenterX = (rowIndex, index) => {
    const rowNode = rowRefs.current[rowIndex];
    if (!rowNode) return null;
    const card = rowNode.querySelector(`[data-index='${index}']`);
    if (!card) return null;
    const rect = card.getBoundingClientRect();
    return rect.left + rect.width / 2; // viewport X
  };

  const findClosestIndexByX = (rowIndex, targetX) => {
    const rowNode = rowRefs.current[rowIndex];
    if (!rowNode) return 0;
    const children = Array.from(rowNode.querySelectorAll('[data-index]'));
    if (children.length === 0) return 0;
    let bestIdx = 0;
    let bestDist = Infinity;
    children.forEach((child) => {
      const r = child.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - targetX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = parseInt(child.getAttribute('data-index'), 10);
      }
    });
    return bestIdx;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();

      setActiveIndices((prev) => {
        const newIndices = [...prev];
        const currentIndex = prev[activeRow];
        const currentRowLength = movieData[activeRow].length;

        if (e.key === 'ArrowRight') {
          setLastInteraction('horizontal');
          newIndices[activeRow] = Math.min(currentIndex + 1, currentRowLength - 1);
        } else if (e.key === 'ArrowLeft') {
          setLastInteraction('horizontal');
          newIndices[activeRow] = Math.max(currentIndex - 1, 0);
        } else if (e.key === 'ArrowDown') {
          setLastInteraction('vertical');
          if (activeRow < movieData.length - 1) {
            const nextRow = activeRow + 1;
            const centerX = getCardCenterX(activeRow, currentIndex);
            let targetIndex;
            if (centerX === null) {
              // fallback to clamped index
              targetIndex = Math.min(currentIndex, movieData[nextRow].length - 1);
            } else {
              targetIndex = findClosestIndexByX(nextRow, centerX);
            }
            newIndices[nextRow] = targetIndex;
            setActiveRow(nextRow);
          }
        } else if (e.key === 'ArrowUp') {
          setLastInteraction('vertical');
          if (activeRow > 0) {
            const prevRow = activeRow - 1;
            const centerX = getCardCenterX(activeRow, currentIndex);
            let targetIndex;
            if (centerX === null) {
              targetIndex = Math.min(currentIndex, movieData[prevRow].length - 1);
            } else {
              targetIndex = findClosestIndexByX(prevRow, centerX);
            }
            newIndices[prevRow] = targetIndex;
            setActiveRow(prevRow);
          }
        }

        return newIndices;
      });
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeRow]);

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <h1 className="text-3xl mb-6">Movie Navigation (position-aware vertical moves)</h1>
      {movieData.map((movies, idx) => (
        <Row
          key={idx}
          movies={movies}
          rowIndex={idx}
          activeRow={activeRow}
          activeIndex={activeIndices[idx]}
          lastInteraction={lastInteraction}
          registerRowRef={registerRowRef}
        />
      ))}

      <div className="mt-8 text-sm text-gray-300 max-w-prose">
        <p>
          Notes: vertical moves (up/down) will now select the card in the next row that is visually
          under the current card (based on screen X position). The next-row container will <strong>not</strong>
          auto-scroll when you move vertically — auto-scrolling only happens for left/right navigation.
        </p>
      </div>
    </div>
  );
}

