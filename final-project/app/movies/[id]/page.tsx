'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { Movie, Collection } from '@/lib/seedData';
import {
  getMovieById,
  getCollections,
  getCollectionsForMovie,
  createCollection,
  addMoviesToCollection,
} from '@/lib/store';
import { useAuth } from '@/context/AuthContext';

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [containingCollections, setContainingCollections] = useState<Collection[]>([]);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetCollectionId, setTargetCollectionId] = useState<string>('new');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  useEffect(() => {
    const foundMovie = getMovieById(id);
    if (foundMovie) {
      setMovie(foundMovie);
    }
  }, [id]);

  useEffect(() => {
    if (user && movie) {
      const allCols = getCollections(user.id);
      setUserCollections(allCols);
      const containingCols = getCollectionsForMovie(user.id, movie.id);
      setContainingCollections(containingCols);
    }
  }, [user, movie]);

  const refreshCollections = () => {
    if (user && movie) {
      const allCols = getCollections(user.id);
      setUserCollections(allCols);
      const containingCols = getCollectionsForMovie(user.id, movie.id);
      setContainingCollections(containingCols);
    }
  };

  const handleOpenAddModal = () => {
    setModalError('');
    setModalSuccess('');
    setNewCollectionName('');
    if (userCollections.length > 0) {
      setTargetCollectionId(userCollections[0].id);
    } else {
      setTargetCollectionId('new');
    }
    setIsAddModalOpen(true);
  };

  const handleAddToCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!user) {
      setModalError('You must be logged in to manage collections.');
      return;
    }

    if (!movie) return;

    if (targetCollectionId === 'new') {
      const res = createCollection(user.id, newCollectionName, [movie.id]);
      if (!res.success) {
        setModalError(res.error || 'Failed to create collection.');
        return;
      }
      setModalSuccess(`Added "${movie.title}" to new collection "${newCollectionName}"!`);
    } else {
      const res = addMoviesToCollection(targetCollectionId, [movie.id]);
      if (!res.success) {
        setModalError(res.error || 'Failed to add movie to collection.');
        return;
      }
      const targetCol = userCollections.find((c) => c.id === targetCollectionId);
      setModalSuccess(`Added "${movie.title}" to "${targetCol?.name}"!`);
    }

    refreshCollections();
    setTimeout(() => {
      setIsAddModalOpen(false);
    }, 1200);
  };

  if (!movie) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-300">Movie Not Found</h2>
        <Link href="/movies" className="mt-4 inline-block text-amber-400 font-semibold hover:underline">
          ← Return to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        href="/movies"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
      >
        <span>←</span> <span>Back to Dashboard</span>
      </Link>

      {/* Main Detail Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        {/* Cover Poster */}
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <Image
            src={movie.banner}
            alt={movie.title}
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>

        {/* Content Info */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ★ {movie.rating.toFixed(1)} / 10
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                {movie.releaseYear}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                {movie.duration}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-100">{movie.title}</h1>

            <p className="text-sm text-slate-400 leading-relaxed">{movie.description}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block uppercase font-extrabold text-[10px] tracking-wider">
                  Director
                </span>
                <span className="text-slate-200 font-semibold">{movie.director}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-extrabold text-[10px] tracking-wider">
                  Genres
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {movie.genres?.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add to Collection Button */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-4">
            <button
              onClick={handleOpenAddModal}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              ➕ Add to Collection
            </button>
          </div>
        </div>
      </div>

      {/* Collection Info Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>📁</span> Collection Status
        </h3>

        {containingCollections.length > 0 ? (
          <div>
            <p className="text-xs text-slate-400 mb-3">
              This movie is currently saved in the following collections:
            </p>
            <div className="flex flex-wrap gap-3">
              {containingCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-2 group"
                >
                  <span>📂 {col.name}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            This movie has not been added to any of your collections yet. Click &quot;Add to Collection&quot; above to organize it!
          </p>
        )}
      </div>

      {/* Add to Collection Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add "${movie.title}" to Collection`}
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

        <form onSubmit={handleAddToCollectionSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Collection
            </label>
            <select
              value={targetCollectionId}
              onChange={(e) => setTargetCollectionId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              {userCollections.map((col) => (
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
                placeholder="e.g. Must Watch Classics"
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
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              Add to Collection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
