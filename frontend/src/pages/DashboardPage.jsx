import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  FolderOpen,
  Heart,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  Wand2,
  Database,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { promptApi } from '../api/promptApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PromptCard from '../components/PromptCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPrompts: 0,
    favoritesCount: 0,
    categoriesCount: 0,
    recentlyAddedCount: 0,
  });
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, promptsRes] = await Promise.all([
        promptApi.getStats(),
        promptApi.getPrompts({ sort: 'newest' })
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (promptsRes.success) {
        // Show recent 6 prompts
        setRecentPrompts(promptsRes.prompts.slice(0, 6));
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleFavorite = async (id, nextState) => {
    try {
      await promptApi.toggleFavorite(id);
      // Update local state
      setRecentPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFavorite: nextState } : p))
      );
      setStats((prev) => ({
        ...prev,
        favoritesCount: nextState
          ? prev.favoritesCount + 1
          : Math.max(0, prev.favoritesCount - 1),
      }));
      toast.info(nextState ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error('Could not update favorite');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;
    try {
      await promptApi.deletePrompt(promptToDelete._id);
      toast.success('Prompt deleted successfully');
      setRecentPrompts((prev) =>
        prev.filter((p) => p._id !== promptToDelete._id)
      );
      setStats((prev) => ({
        ...prev,
        totalPrompts: Math.max(0, prev.totalPrompts - 1),
      }));
      setPromptToDelete(null);
    } catch (err) {
      toast.error('Failed to delete prompt');
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await promptApi.seedPrompts();
      if (res.success) {
        toast.success(`Loaded ${res.count} curated sample prompts!`);
        await fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not seed sample prompts');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Welcome Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Workspace Overview
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Welcome back, {user?.name || 'Creator'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Here is what is happening across your AI prompt vault today.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to="/ai-improver">
                <Button variant="glass" size="md" icon={Wand2}>
                  AI Studio
                </Button>
              </Link>
              <Link to="/prompts/create">
                <Button variant="primary" size="md" icon={PlusCircle}>
                  + Create New Prompt
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {/* Total Prompts */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-[#0c101c] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Prompts
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <FolderOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.totalPrompts}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Stored in your private vault
              </p>
            </div>

            {/* Favorites */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-[#0c101c] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-rose-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Favorites
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.favoritesCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Marked for rapid access
              </p>
            </div>

            {/* Categories */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-[#0c101c] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Categories
                </span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.categoriesCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Distinct topic domains
              </p>
            </div>

            {/* Recently Added */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-[#0c101c] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recently Added
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.recentlyAddedCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Created in the last 7 days
              </p>
            </div>
          </div>

          {/* AI Banner */}
          <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-cyan-900/20 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Enhance prompts with AI Prompt Improver
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyze clarity, add structured parameters, and improve quality scores.
                </p>
              </div>
            </div>
            <Link to="/ai-improver">
              <Button variant="cyan" size="sm" icon={Wand2} className="shrink-0">
                Launch Improver
              </Button>
            </Link>
          </div>

          {/* Recent Prompts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Recent Prompts
                </h2>
                <p className="text-xs text-slate-400">
                  Your most recently created and updated instructions
                </p>
              </div>
              {stats.totalPrompts > 0 && (
                <Link
                  to="/prompts"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
                >
                  <span>View All Prompts ({stats.totalPrompts})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : recentPrompts.length === 0 ? (
              <EmptyState
                icon={Database}
                title="Your Vault is Empty"
                description="Get started by creating your very first prompt, or seed our curated starter pack inspired by the Stitch design!"
                actionLabel="+ Create New Prompt"
                onAction={() => navigate('/prompts/create')}
                secondaryActionLabel={
                  seeding ? 'Seeding...' : 'Load Sample Prompts'
                }
                onSecondaryAction={handleSeed}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt._id}
                    prompt={prompt}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={(p) => setPromptToDelete(p)}
                  />
                ))}
              </div>
            )}
          </div>
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

export default DashboardPage;
