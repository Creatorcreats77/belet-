import React from 'react';

export default function MovieCard({ movie, isActive }) {
  return (
    <div
      className={`w-40 h-60 rounded-lg overflow-hidden transition-transform duration-300 ease-in-out ${
        isActive ? 'scale-110 border-4 border-blue-500 z-10' : 'scale-100'
      }`}
    >
      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
    </div>
  );
}