'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import Modal from '@/components/Modal';
import { Collection, Movie } from '@/lib/seedData';
import {
  getCollectionById,
  getMovies,
  updateCollectionName,
  removeMovieFromCollection,
} from '@/lib/store';

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [addedMovies, setAddedMovies] = useState<Movie[]>([]);

  // Edit Collection Name Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');
  const [editError, setEditError] = useState('');

  // Remove Movie Confirmation Modal
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    refreshData();
  }, [id]);

  const refreshData = () => {
    const col = getCollectionById(id);
    if (col) {
      setCollection(col);
      const allMovies = getMovies();
      const moviesInCol = allMovies.filter((m) => col.movieIds.includes(m.id));
      setAddedMovies(moviesInCol);
    }
  };

  // Edit Name submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (!collection) return;

    const res = updateCollectionName(collection.id, editNameInput);

    if (!res.success) {
      setEditError(res.error || 'Failed to update collection name.');
      return;
    }

    refreshData();
    setIsEditModalOpen(false);
  };

  // Remove Movie submit
  const handleConfirmRemoveMovie = () => {
    if (!collection || !deletingMovie) return;

    removeMovieFromCollection(collection.id, deletingMovie.id);
    refreshData();
    setDeletingMovie(null);
  };

  if (!collection) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-300">Collection Not Found</h2>
        <Link href="/collections" className="mt-4 inline-block text-amber-400 font-semibold hover:underline">
          ← Return to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        href="/collections"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
      >
        <span>←</span> <span>Back to All Collections</span>
      </Link>

      {/* Header Banner & Edit Button */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            COLLECTION DETAILS
          </span>
          {/* Display collection name at the top */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight flex items-center gap-3">
            <span>📁 {collection.name}</span>
          </h1>
          <p className="text-sm text-slate-400">
            Contains <span className="font-bold text-slate-200">{addedMovies.length}</span> {addedMovies.length === 1 ? 'movie' : 'movies'}. Click any movie card to view details or remove it from this collection.
          </p>
        </div>

        {/* Edit button at the top of Collection Detail page */}
        <button
          onClick={() => {
            setEditError('');
            setEditNameInput(collection.name);
            setIsEditModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-2"
        >
          ✏️ Edit Collection Name
        </button>
      </div>

      {/* Added Movies Grid */}
      {addedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {addedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRemove={(m) => setDeletingMovie(m)}
              removeButtonLabel="Remove from Collection"
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <div className="text-4xl">🎬</div>
          <h3 className="text-xl font-bold text-slate-200">This Collection is Empty</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You have not added any movies to this collection yet. Head over to the Movies dashboard to add movies!
          </p>
          <Link
            href="/movies"
            className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
          >
            Browse Movies
          </Link>
        </div>
      )}

      {/* Edit Collection Name Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Collection Name"
      >
        {editError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            ⚠️ {editError}
          </div>
        )}

        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              New Collection Name
            </label>
            <input
              type="text"
              value={editNameInput}
              onChange={(e) => setEditNameInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Must be unique & cannot contain special characters.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              Update Name
            </button>
          </div>
        </form>
      </Modal>

      {/* Remove Movie Confirmation Modal */}
      <Modal
        isOpen={!!deletingMovie}
        onClose={() => setDeletingMovie(null)}
        title="Remove Movie from Collection"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to remove <strong className="text-amber-400">&quot;{deletingMovie?.title}&quot;</strong> from collection <strong className="text-amber-400">&quot;{collection.name}&quot;</strong>?
          </p>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              onClick={() => setDeletingMovie(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRemoveMovie}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
            >
              Remove Movie
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
