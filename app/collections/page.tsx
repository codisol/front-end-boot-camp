'use client';

import React, { useState, useEffect } from 'react';
import CollectionCard from '@/components/CollectionCard';
import Modal from '@/components/Modal';
import { Collection, Movie } from '@/lib/seedData';
import {
  getCollections,
  getMovies,
  createCollection,
  updateCollectionName,
  deleteCollection,
} from '@/lib/store';
import { useAuth } from '@/context/AuthContext';

export default function CollectionListPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  // Add Collection Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [addError, setAddError] = useState('');

  // Edit Collection Modal
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editCollectionName, setEditCollectionName] = useState('');
  const [editError, setEditError] = useState('');

  // Delete Confirmation Modal
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = () => {
    setMovies(getMovies());
    if (user) {
      setCollections(getCollections(user.id));
    } else {
      // Default guest preview collections
      setCollections(getCollections('user-account-1'));
    }
  };

  // Add Collection Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const activeUserId = user ? user.id : 'user-account-1';
    const res = createCollection(activeUserId, newCollectionName);

    if (!res.success) {
      setAddError(res.error || 'Failed to create collection.');
      return;
    }

    refreshData();
    setIsAddModalOpen(false);
    setNewCollectionName('');
  };

  // Edit Collection Handler
  const handleOpenEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setEditCollectionName(collection.name);
    setEditError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (!editingCollection) return;

    const res = updateCollectionName(editingCollection.id, editCollectionName);

    if (!res.success) {
      setEditError(res.error || 'Failed to update collection name.');
      return;
    }

    refreshData();
    setEditingCollection(null);
  };

  // Remove Collection Handler
  const handleConfirmRemove = () => {
    if (!deletingCollection) return;
    deleteCollection(deletingCollection.id);
    refreshData();
    setDeletingCollection(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner & Add Button */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PERSONAL LIBRARY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Movie Collections
          </h1>
          <p className="text-sm text-slate-400">
            Organize your favorite movies into custom collections. All collections persist automatically.
          </p>
        </div>

        {/* Add Collection Button on top of page */}
        <button
          onClick={() => {
            setAddError('');
            setNewCollectionName('');
            setIsAddModalOpen(true);
          }}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          ➕ Add a Collection
        </button>
      </div>

      {/* Collections List Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              movies={movies}
              onEdit={handleOpenEdit}
              onRemove={(c) => setDeletingCollection(c)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <div className="text-4xl">📂</div>
          <h3 className="text-xl font-bold text-slate-200">No Collections Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You have not created any movie collections yet. Click &quot;Add a Collection&quot; above to create your first collection!
          </p>
        </div>
      )}

      {/* Add Collection Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add a Collection"
      >
        {addError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            ⚠️ {addError}
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Collection Name
            </label>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="e.g. Action Blockbusters"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Must be unique & cannot contain special characters.
            </p>
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
              Create Collection
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Collection Modal */}
      <Modal
        isOpen={!!editingCollection}
        onClose={() => setEditingCollection(null)}
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
              Collection Name
            </label>
            <input
              type="text"
              value={editCollectionName}
              onChange={(e) => setEditCollectionName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Must be unique & cannot contain special characters.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingCollection(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Remove Collection Confirmation Modal */}
      <Modal
        isOpen={!!deletingCollection}
        onClose={() => setDeletingCollection(null)}
        title="Confirm Delete Collection"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to remove collection{' '}
            <strong className="text-amber-400">&quot;{deletingCollection?.name}&quot;</strong>?
            This action will delete the collection. The movies inside will remain intact.
          </p>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              onClick={() => setDeletingCollection(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRemove}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
            >
              Remove Collection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
