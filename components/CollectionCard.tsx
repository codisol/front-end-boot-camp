'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection, Movie, DEFAULT_COLLECTION_COVER } from '@/lib/seedData';

interface CollectionCardProps {
  collection: Collection;
  movies: Movie[];
  onEdit: (collection: Collection) => void;
  onRemove: (collection: Collection) => void;
}

export default function CollectionCard({
  collection,
  movies,
  onEdit,
  onRemove,
}: CollectionCardProps) {
  // Find cover image from firstly added movie, or fallback to default
  const firstMovieId = collection.movieIds?.[0];
  const firstMovie = movies.find((m) => m.id === firstMovieId);
  const coverUrl = firstMovie?.banner || DEFAULT_COLLECTION_COVER;
  const itemCount = collection.movieIds?.length || 0;

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden glass-panel border border-slate-800 hover:border-amber-500/40 transition-all duration-300">
      {/* Cover Image & Count */}
      <Link href={`/collections/${collection.id}`} className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <Image
          src={coverUrl}
          alt={collection.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Count badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-slate-800 flex items-center gap-1">
          🎬 {itemCount} {itemCount === 1 ? 'Movie' : 'Movies'}
        </div>
      </Link>

      {/* Collection Title & Actions */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-slate-950/60">
        <Link href={`/collections/${collection.id}`}>
          <h3 className="font-bold text-lg text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
            {collection.name}
          </h3>
        </Link>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(collection)}
            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center justify-center gap-1"
          >
            ✏️ Edit
          </button>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(collection)}
            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center justify-center gap-1"
          >
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  );
}
