import React, { useEffect, useRef } from 'react';
import MovieCard from './MovieCard';

const CARD_WIDTH = 160;
const HORIZONTAL_MARGIN = 24;
const CARD_TOTAL = CARD_WIDTH + HORIZONTAL_MARGIN;
const VISIBLE_COUNT = 5;
// Increase visible area slightly to show partial cards on left/right
const VISIBLE_WIDTH = CARD_TOTAL * VISIBLE_COUNT + CARD_TOTAL * 0.5;

export default function Row({
  movies,
  rowIndex,
  activeRow,
  activeIndex,
  lastInteraction,
  registerRowRef,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (registerRowRef) registerRowRef(rowIndex, containerRef.current);
  }, [registerRowRef, rowIndex]);

  // Only scroll when the active card moves beyond the current visible range
  useEffect(() => {
    if (rowIndex !== activeRow) return;
    if (lastInteraction !== 'horizontal') return;
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cardLeft = activeIndex * CARD_TOTAL;
    const cardRight = cardLeft + CARD_TOTAL;
    const visibleStart = container.scrollLeft;
    const visibleEnd = container.scrollLeft + VISIBLE_WIDTH;

    if (cardRight > visibleEnd) {
      // Scroll right just enough to bring the card into view
      container.scrollTo({ left: cardRight - VISIBLE_WIDTH, behavior: 'smooth' });
    } else if (cardLeft < visibleStart) {
      // Scroll left just enough to bring the card into view
      container.scrollTo({ left: cardLeft, behavior: 'smooth' });
    }
  }, [activeIndex, activeRow, lastInteraction, rowIndex]);

  return (
    <div className="mb-8">
      <h2 className="text-white text-lg mb-2">Row {rowIndex + 1}</h2>
      <div
        ref={containerRef}
        className="overflow-hidden no-scrollbar"
        style={{ width: `${VISIBLE_WIDTH}px` }}
      >
        <div className="flex items-start transition-transform duration-300 ease-in-out">
          {movies.map((movie, idx) => (
            <div
              key={movie.id}
              data-index={idx}
              className="flex-shrink-0 mx-2"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <MovieCard movie={movie} isActive={rowIndex === activeRow && idx === activeIndex} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
