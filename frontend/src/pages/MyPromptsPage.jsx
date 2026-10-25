import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  PlusCircle,
  FolderOpen,
  Heart,
  SlidersHorizontal,
  X,
  Trash2,
  Database
} from 'lucide-react';
import { promptApi } from '../api/promptApi';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PromptCard from '../components/PromptCard';
import Button from '../components/Button';
import Select from '../components/Select';
import Modal from '../components/Modal';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  'All',
  'Development',
  'Writing',
  'Marketing',
  'Image Generation',
  'Productivity',
  'Education',
  'Other'
];

const AI_MODELS = [
  'All',
  'ChatGPT',
  'Gemini',
  'Claude',
  'Midjourney',
  'Other'
];

const MyPromptsPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [aiModel, setAiModel] = useState(searchParams.get('aiModel') || 'All');
  const [onlyFavorites, setOnlyFavorites] = useState(
    searchParams.get('favorites') === 'true'
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        sort,
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (aiModel !== 'All') params.aiModel = aiModel;
      if (onlyFavorites) params.isFavorite = true;

      const res = await promptApi.getPrompts(params);
      if (res.success) {
        setPrompts(res.prompts);
      }
    } catch (err) {
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  }, [search, category, aiModel, onlyFavorites, sort, toast]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrompts();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchPrompts]);

  const handleToggleFavorite = async (id, nextState) => {
    try {
      await promptApi.toggleFavorite(id);
      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFavorite: nextState } : p))
      );
      if (onlyFavorites && !nextState) {
        setPrompts((prev) => prev.filter((p) => p._id !== id));
      }
      toast.info(nextState ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error('Could not update favorite');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;
    try {
      await promptApi.deletePrompt(promptToDelete._id);
      toast.success('Prompt deleted');
      setPrompts((prev) => prev.filter((p) => p._id !== promptToDelete._id));
      setPromptToDelete(null);
    } catch (err) {
      toast.error('Could not delete prompt');
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await promptApi.seedPrompts();
      if (res.success) {
        toast.success(`Loaded ${res.count} curated sample prompts!`);
        await fetchPrompts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not seed prompts');
    } finally {
      setSeeding(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setAiModel('All');
    setOnlyFavorites(false);
    setSort('newest');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    aiModel !== 'All' ||
    onlyFavorites;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                My Prompts
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Search, filter, and organize your entire prompt collection
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Grid / List Mode Toggle */}
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

              <Link to="/prompts/create">
                <Button variant="primary" size="md" icon={PlusCircle}>
                  New Prompt
                </Button>
              </Link>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="space-y-4 mb-6">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, prompt instruction, description, or #tag..."
                className="w-full bg-[#0d121f] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
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

            {/* Filter Pills / Dropdowns Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Category Pills (matching Stitch design filter row) */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Right secondary filters: AI Model, Sort, Favorites */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* AI Model Dropdown */}
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="All">Model: All</option>
                  {AI_MODELS.filter((m) => m !== 'All').map((m) => (
                    <option key={m} value={m}>
                      Model: {m}
                    </option>
                  ))}
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="title-asc">Sort: Title (A-Z)</option>
                  <option value="title-desc">Sort: Title (Z-A)</option>
                </select>

                {/* Favorite Toggle Button */}
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    onlyFavorites
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      onlyFavorites ? 'fill-current text-rose-400' : ''
                    }`}
                  />
                  <span>Favorites</span>
                </button>

                {/* Clear Filter Button if active */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 ml-1"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results count & status */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
            <span>
              Showing{' '}
              <strong className="text-slate-200">{prompts.length}</strong>{' '}
              {prompts.length === 1 ? 'prompt' : 'prompts'}
            </span>
          </div>

          {/* Prompts Display */}
          {loading ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title={
                hasActiveFilters
                  ? 'No matching prompts found'
                  : 'Your prompt library is empty'
              }
              description={
                hasActiveFilters
                  ? 'Try adjusting your search terms, removing filters, or clearing the query.'
                  : 'Start building your curated AI library by adding your first prompt or seeding starter templates!'
              }
              actionLabel={
                hasActiveFilters ? 'Clear All Filters' : '+ Create New Prompt'
              }
              onAction={
                hasActiveFilters ? clearFilters : () => navigate('/prompts/create')
              }
              secondaryActionLabel={
                !hasActiveFilters
                  ? seeding
                    ? 'Loading...'
                    : 'Load Curated Sample Prompts'
                  : null
              }
              onSecondaryAction={!hasActiveFilters ? handleSeed : null}
            />
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {prompts.map((prompt) => (
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

      {/* Delete Modal */}
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
          ? This action cannot be reversed.
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

export default MyPromptsPage;
