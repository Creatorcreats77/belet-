export const movieData = [
  Array.from({ length: 20 }, (_, i) => ({
    id: `row1-${i}`,
    title: `Movie ${i + 1}`,
    poster: `https://picsum.photos/200/300?random=${i + 1}`,
  })),
  Array.from({ length: 15 }, (_, i) => ({
    id: `row2-${i}`,
    title: `Movie ${i + 1}`,
    poster: `https://picsum.photos/200/300?random=${i + 21}`,
  })),
  Array.from({ length: 10 }, (_, i) => ({
    id: `row3-${i}`,
    title: `Movie ${i + 1}`,
    poster: `https://picsum.photos/200/300?random=${i + 36}`,
  })),
  Array.from({ length: 5 }, (_, i) => ({
    id: `row4-${i}`,
    title: `Movie ${i + 1}`,
    poster: `https://picsum.photos/200/300?random=${i + 46}`,
  })),
  Array.from({ length: 30 }, (_, i) => ({
    id: `row5-${i}`,
    title: `Movie ${i + 1}`,
    poster: `https://picsum.photos/200/300?random=${i + 51}`,
  })),
];