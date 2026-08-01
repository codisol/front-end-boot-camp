'use client';

import React, { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import Modal from '@/components/Modal';
import { Movie, Collection } from '@/lib/seedData';
import {
  getMovies,
  getCollections,
  createCollection,
  addMoviesToCollection,
} from '@/lib/store';
import { useAuth } from '@/context/AuthContext';

const ITEMS_PER_PAGE = 10;

export default function MovieListPage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk add selection state
  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Form inside Bulk Add Modal
  const [targetCollectionId, setTargetCollectionId] = useState<string>('new');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  useEffect(() => {
    const loadedMovies = getMovies();
    setMovies(loadedMovies);

    if (user) {
      const userCols = getCollections(user.id);
      setCollections(userCols);
    }
  }, [user]);

  // Refresh data function
  const refreshData = () => {
    setMovies(getMovies());
    if (user) {
      setCollections(getCollections(user.id));
    }
  };

  // Pagination math
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE) || 1;
  const currentMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectMovie = (id: string) => {
    setSelectedMovieIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllOnPage = () => {
    const pageMovieIds = currentMovies.map((m) => m.id);
    const allSelected = pageMovieIds.every((id) => selectedMovieIds.includes(id));

    if (allSelected) {
      setSelectedMovieIds((prev) => prev.filter((id) => !pageMovieIds.includes(id)));
    } else {
      setSelectedMovieIds((prev) => Array.from(new Set([...prev, ...pageMovieIds])));
    }
  };

  const handleOpenBulkModal = () => {
    setModalError('');
    setModalSuccess('');
    setNewCollectionName('');
    if (collections.length > 0) {
      setTargetCollectionId(collections[0].id);
    } else {
      setTargetCollectionId('new');
    }
    setIsBulkModalOpen(true);
  };

  const handleBulkAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!user) {
      setModalError('You must be logged in to manage collections.');
      return;
    }

    if (selectedMovieIds.length === 0) {
      setModalError('Please select at least one movie.');
      return;
    }

    if (targetCollectionId === 'new') {
      const res = createCollection(user.id, newCollectionName, selectedMovieIds);
      if (!res.success) {
        setModalError(res.error || 'Failed to create collection.');
        return;
      }
      setModalSuccess(`Successfully created collection "${newCollectionName}" and added ${selectedMovieIds.length} movies!`);
    } else {
      const res = addMoviesToCollection(targetCollectionId, selectedMovieIds);
      if (!res.success) {
        setModalError(res.error || 'Failed to add movies to collection.');
        return;
      }
      const targetCol = collections.find((c) => c.id === targetCollectionId);
      setModalSuccess(`Successfully added ${selectedMovieIds.length} movies to "${targetCol?.name}"!`);
    }

    refreshData();
    setTimeout(() => {
      setIsBulkModalOpen(false);
      setSelectedMovieIds([]);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            EXPLORE MOVIES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            User Movie Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Browse through our curated collection of movies. Select multiple movies to create or add to your personalized collections.
          </p>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {selectedMovieIds.length > 0 && (
            <button
              onClick={handleOpenBulkModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 animate-bounce"
            >
              📥 Bulk Add ({selectedMovieIds.length}) to Collection
            </button>
          )}

          <button
            onClick={handleSelectAllOnPage}
            className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            {currentMovies.every((m) => selectedMovieIds.includes(m.id))
              ? 'Deselect Page'
              : 'Select Page Movies'}
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {currentMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            selectable={true}
            isSelected={selectedMovieIds.includes(movie.id)}
            onToggleSelect={toggleSelectMovie}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
        <p className="text-xs text-slate-400">
          Showing <span className="font-bold text-slate-200">{currentMovies.length}</span> of{' '}
          <span className="font-bold text-slate-200">{movies.length}</span> movies (Page {currentPage} of {totalPages})
        </p>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300 border border-slate-800 transition-colors"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                currentPage === pageNum
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300 border border-slate-800 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Bulk Add to Collection Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title={`Bulk Add ${selectedMovieIds.length} Movies to Collection`}
      >
        {modalError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            ⚠️ {modalError}
          </div>
        )}

        {modalSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            ✅ {modalSuccess}
          </div>
        )}

        <form onSubmit={handleBulkAddSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Destination Collection
            </label>
            <select
              value={targetCollectionId}
              onChange={(e) => setTargetCollectionId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.movieIds?.length || 0} movies)
                </option>
              ))}
              <option value="new">➕ Create New Collection</option>
            </select>
          </div>

          {targetCollectionId === 'new' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                New Collection Name
              </label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Sci-Fi Favorites"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Must be unique & cannot contain special characters.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              Add Movies
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
