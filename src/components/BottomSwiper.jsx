// File: src/components/BottomSwiper.jsx
import { useRef, useEffect, useCallback } from "react";
import { useUnit } from "effector-react";
import Movies from "./Movies";
import { $selectedMovieContainer } from "../model/movieUpDown";
import { $activeIndex, setActiveIndex } from "../model/sliderNextPrev";

const BottomSwiper = ({ categories = [], isOpen = true, scrollIndex }) => {
  const containerRef = useRef(null);
  const selected = useUnit($selectedMovieContainer);

  const [activeIndexMap, setSliderActiveIndex] = useUnit([
    $activeIndex,
    setActiveIndex,
  ]);
  const carouselRefs = useRef({});
  const prevSelectedRef = useRef(selected); // <- keep track of previous selected row

  const registerCarouselRef = useCallback((id, node) => {
    if (node) carouselRefs.current[id] = node;
    else delete carouselRefs.current[id];
  }, []);

  const getCardCenterX = (carouselNode, index) => {
    if (!carouselNode) return null;
    const el = carouselNode.querySelector(`[data-index='${index}']`);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return rect.left + rect.width / 2;
  };

  const findClosestIndexByX = (carouselNode, targetX) => {
    if (!carouselNode) return 0;
    const children = Array.from(carouselNode.querySelectorAll("[data-index]"));
    if (!children.length) return 0;

    let bestIdx = 0;
    let bestDist = Infinity;
    children.forEach((child) => {
      const r = child.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - targetX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = parseInt(child.getAttribute("data-index"), 10);
      }
    });
    return bestIdx;
  };

  // Scroll the selected row into view with peek
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectedEl = container.children[selected];
    if (!selectedEl) return;

    const containerHeight = container.clientHeight;
    const elTop = selectedEl.offsetTop;
    const elHeight = selectedEl.offsetHeight;
    const peekBottom = 16;

    let scrollPos = elTop - containerHeight / 2 + elHeight / 2 - peekBottom;
    scrollPos = Math.max(scrollPos, 0);
    scrollPos = Math.min(scrollPos, container.scrollHeight - containerHeight);

    container.scrollTo({ top: scrollPos, behavior: "smooth" });
  }, [selected]);

  // Vertical navigation: move to the movie visually under the current active card
  useEffect(() => {
    const prev = prevSelectedRef.current;
    if (prev === selected) return;

    const prevCategory = categories[prev];
    const nextCategory = categories[selected];
    if (!prevCategory || !nextCategory) {
      prevSelectedRef.current = selected;
      return;
    }

    const prevId = prevCategory.id;
    const nextId = nextCategory.id;
    const prevActiveIndex = activeIndexMap[prevId] ?? 0;

    let targetIndex = prevActiveIndex;

    const prevCarousel = carouselRefs.current[prevId];
    const nextCarousel = carouselRefs.current[nextId];

    if (prevCarousel && nextCarousel) {
      const centerX = getCardCenterX(prevCarousel, prevActiveIndex);
      if (centerX !== null) {
        targetIndex = findClosestIndexByX(nextCarousel, centerX);
      }
    }

    // Clamp targetIndex to next row length
    targetIndex = Math.min(targetIndex, nextCategory.movies.length - 1);

    setSliderActiveIndex({ id: nextId, value: targetIndex });
    prevSelectedRef.current = selected;
  }, [selected, categories, activeIndexMap, setSliderActiveIndex]);

  return (
    <div
      ref={containerRef}
      className={`absolute w-full h-screen overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? "top-0 bg-black" : "top-[80%]"
      }`}
      style={{ paddingBottom: "40px" }}
    >
      {categories.map((category, catIndex) => (
        <div
          key={category.id}
          data-index={catIndex}
          className="p-2 transition-all"
          style={{ marginBottom: "16px" }}
        >
          <Movies
            id={category.id}
            title={category.title}
            movies={category.movies}
            scrollIndex={scrollIndex}
            registerCarouselRef={registerCarouselRef} // pass ref to Movies
          />
        </div>
      ))}
    </div>
  );
};

export default BottomSwiper;
