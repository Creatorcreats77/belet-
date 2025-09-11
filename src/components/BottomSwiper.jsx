import { useRef, useEffect } from "react";
import { useUnit } from "effector-react";
import Movies from "./Movies";
import { $selectedMovieContainer} from "../model/movie";

const BottomSwiper = ({ categories = [], isOpen = true, scrollIndex }) => {
  const containerRef = useRef(null);
  const selected = useUnit($selectedMovieContainer);



  // Scroll selected movie into view with bottom peek only
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const selectedEl = container.children[selected];
    if (!selectedEl) return;

    const containerHeight = container.clientHeight;
    const elTop = selectedEl.offsetTop;
    const elHeight = selectedEl.offsetHeight;

    const peekBottom = 16; // px to show next movie at bottom

    // Scroll so the selected movie is visible with a peek of next movie
    let scrollPos = elTop - containerHeight / 2 + elHeight / 2 - peekBottom;

    // Clamp scroll to container bounds
    scrollPos = Math.max(scrollPos, 0);
    scrollPos = Math.min(scrollPos, container.scrollHeight - containerHeight);

    container.scrollTo({ top: scrollPos, behavior: "smooth" });
  }, [selected]);



  return (
    <div
      ref={containerRef}
      className={`absolute w-full h-screen overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? "top-0 bg-black" : "top-[80%]"
      }`}
      style={{ paddingBottom: "40px" }} // only bottom padding for peek
    >
      {categories.map((category) => (
        <div
          key={category.id}
          className={`p-2 transition-all`}
          style={{ marginBottom: "16px" }}
        >
          <Movies
            // key={category.id}
            id={category.id}
            title={category.title}
            movies={category.movies}
            scrollIndex={scrollIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default BottomSwiper;
