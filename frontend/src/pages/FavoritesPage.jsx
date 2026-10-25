import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  Grid,
  List,
  Sparkles,
  FolderOpen,
  ArrowRight,
  X
} from 'lucide-react';
import { promptApi } from '../api/promptApi';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PromptCard from '../components/PromptCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const FavoritesPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        isFavorite: true,
        sort: 'newest',
      };
      if (search.trim()) params.search = search.trim();

      const res = await promptApi.getPrompts(params);
      if (res.success) {
        setFavorites(res.prompts);
      }
    } catch (err) {
      toast.error('Failed to load favorite prompts');
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFavorites();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchFavorites]);

  const handleToggleFavorite = async (id, nextState) => {
    try {
      await promptApi.toggleFavorite(id);
      // Remove from favorites view if unfavorited
      if (!nextState) {
        setFavorites((prev) => prev.filter((p) => p._id !== id));
        toast.info('Removed from favorites');
      }
    } catch (err) {
      toast.error('Could not update favorite');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;
    try {
      await promptApi.deletePrompt(promptToDelete._id);
      toast.success('Prompt deleted');
      setFavorites((prev) => prev.filter((p) => p._id !== promptToDelete._id));
      setPromptToDelete(null);
    } catch (err) {
      toast.error('Failed to delete prompt');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Favorites
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Your starred instructions for quick one-tap retrieval
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Toolbar */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your favorite prompts..."
              className="w-full bg-[#0d121f] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title={search ? 'No matching favorites' : 'No favorites yet'}
              description={
                search
                  ? 'Try searching with a different keyword.'
                  : 'Click the heart icon on any prompt card in your vault to save it here for rapid access.'
              }
              actionLabel={search ? 'Clear Search' : 'Browse All Prompts'}
              onAction={search ? () => setSearch('') : () => navigate('/prompts')}
            />
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {favorites.map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  viewMode={viewMode}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={(p) => setPromptToDelete(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(promptToDelete)}
        onClose={() => setPromptToDelete(null)}
        title="Delete Prompt"
      >
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-white">
            "{promptToDelete?.title}"
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setPromptToDelete(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={handleDeleteConfirm}>
            Delete Permanently
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FavoritesPage;

