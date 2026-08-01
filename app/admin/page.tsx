'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { Movie } from '@/lib/seedData';
import { getMovies, addMovie, deleteMovie } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';

const ITEMS_PER_PAGE = 10;

export default function AdminPage() {
  const { isAdmin } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Add Movie Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [genresInput, setGenresInput] = useState('');
  const [rating, setRating] = useState<number>(8.0);
  const [releaseYear, setReleaseYear] = useState<number>(2024);
  const [director, setDirector] = useState('');
  const [addError, setAddError] = useState('');

  // Delete Movie Modal
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    refreshMovies();
  }, []);

  const refreshMovies = () => {
    setMovies(getMovies());
  };

  // Pagination math
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE) || 1;
  const currentMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenAddModal = () => {
    setTitle('');
    setBanner('');
    setDescription('');
    setDuration('2h 15m');
    setGenresInput('Action, Sci-Fi');
    setRating(8.5);
    setReleaseYear(2024);
    setDirector('');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleAddMovieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!title.trim()) {
      setAddError('Movie title is required.');
      return;
    }

    if (!banner.trim()) {
      setAddError('Movie cover/banner URL is required.');
      return;
    }

    if (!description.trim()) {
      setAddError('Movie description is required.');
      return;
    }

    const genres = genresInput
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    addMovie({
      title: title.trim(),
      banner: banner.trim(),
      description: description.trim(),
      duration: duration.trim() || '2h 00m',
      genres: genres.length > 0 ? genres : ['Drama'],
      rating: Number(rating) || 8.0,
      releaseYear: Number(releaseYear) || 2024,
      director: director.trim() || 'Unknown Director',
    });

    refreshMovies();
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingMovie) return;
    // Cascade delete movie from dataset AND user collections
    deleteMovie(deletingMovie.id);
    refreshMovies();
    setDeletingMovie(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner & Add New Movie Button */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ADMIN DASHBOARD
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Movie Catalog Management
          </h1>
          <p className="text-sm text-slate-400">
            Add new movies to the catalog or delete existing movies. Deleting a movie will automatically remove it from all user collections.
          </p>
        </div>

        {/* Add new movie button */}
        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          ➕ Add New Movie
        </button>
      </div>

      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
          ℹ️ You are currently viewing the Admin Panel as a Demo Administrator.
        </div>
      )}

      {/* Admin Movies Table / Card View */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Cover</th>
                <th className="p-4">Title & Details</th>
                <th className="p-4">Year & Duration</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 w-20">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                      <Image
                        src={movie.banner}
                        alt={movie.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <h4 className="font-bold text-sm text-slate-100">{movie.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md mt-0.5">
                      {movie.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {movie.genres?.map((g) => (
                        <span key={g} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-200">{movie.releaseYear}</p>
                    <p className="text-[11px] text-slate-500">{movie.duration}</p>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                      ★ {movie.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setDeletingMovie(movie)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-200">{currentMovies.length}</span> of{' '}
            <span className="font-bold text-slate-200">{movies.length}</span> movies (Page {currentPage} of {totalPages})
          </p>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300 border border-slate-800 transition-colors"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300 border border-slate-800 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Add New Movie Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Movie"
      >
        {addError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            ⚠️ {addError}
          </div>
        )}

        <form onSubmit={handleAddMovieSubmit} className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Movie Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gladiator II"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Banner / Cover Image URL *
            </label>
            <input
              type="text"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the movie..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2h 15m"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Release Year
              </label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Rating (0 - 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Director
              </label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Director name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Genres (comma separated)
            </label>
            <input
              type="text"
              value={genresInput}
              onChange={(e) => setGenresInput(e.target.value)}
              placeholder="Action, Sci-Fi, Thriller"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              Create Movie
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Movie Confirmation Modal */}
      <Modal
        isOpen={!!deletingMovie}
        onClose={() => setDeletingMovie(null)}
        title="Confirm Delete Movie"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to delete <strong className="text-amber-400">&quot;{deletingMovie?.title}&quot;</strong>?
            This will permanently remove the movie from the catalog and automatically cascade delete it from all user collections!
          </p>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              onClick={() => setDeletingMovie(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
            >
              Delete Movie
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
