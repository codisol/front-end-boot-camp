'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/seedData';

interface MovieCardProps {
  movie: Movie;
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onRemove?: (movie: Movie) => void;
  removeButtonLabel?: string;
}

export default function MovieCard({
  movie,
  selectable = false,
  isSelected = false,
  onToggleSelect,
  onRemove,
  removeButtonLabel = 'Remove',
}: MovieCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    if (selectable && onToggleSelect) {
      e.preventDefault();
      onToggleSelect(movie.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`movie-card group relative flex flex-col rounded-2xl overflow-hidden glass-panel border transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-amber-400 border-amber-400/50 bg-amber-500/10'
          : 'border-slate-800/80 hover:border-slate-700'
      } ${selectable ? 'cursor-pointer select-none' : ''}`}
    >
      {/* Checkbox badge for bulk selection */}
      {selectable && (
        <div className="absolute top-3 left-3 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect && onToggleSelect(movie.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 accent-amber-500 rounded border-slate-700 cursor-pointer shadow-md"
          />
        </div>
      )}

      {/* Rating badge */}
      <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1 border border-slate-800">
        ★ {movie.rating.toFixed(1)}
      </div>

      {/* Poster Image Container */}
      <Link href={`/movies/${movie.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <Image
          src={movie.banner}
          alt={movie.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
      </Link>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-slate-950/40">
        <div>
          <Link href={`/movies/${movie.id}`}>
            <h4 className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
              {movie.title}
            </h4>
          </Link>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span>{movie.duration}</span>
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Remove Button for Collection Detail or Admin */}
        {onRemove && (
          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemove(movie);
              }}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-colors flex items-center justify-center gap-1"
            >
              🗑️ {removeButtonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
