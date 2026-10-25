import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Heart,
  Edit3,
  Trash2,
  Sparkles,
  Bot,
  Calendar,
  Layers,
  Tag,
  Clock,
  Terminal
} from 'lucide-react';
import { promptApi } from '../api/promptApi';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const PromptDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        const res = await promptApi.getPromptById(id);
        if (res.success && res.prompt) {
          setPrompt(res.prompt);
          setIsFavorite(res.prompt.isFavorite);
        }
      } catch (err) {
        toast.error('Failed to load prompt details');
        navigate('/prompts');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, navigate, toast]);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleToggleFavorite = async () => {
    if (!prompt) return;
    try {
      const nextFav = !isFavorite;
      setIsFavorite(nextFav);
      await promptApi.toggleFavorite(prompt._id);
      toast.info(nextFav ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      setIsFavorite(!isFavorite);
      toast.error('Could not update favorite');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!prompt) return;
    try {
      await promptApi.deletePrompt(prompt._id);
      toast.success('Prompt deleted successfully');
      navigate('/prompts');
    } catch (err) {
      toast.error('Failed to delete prompt');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center p-8">
            <LoadingSpinner size="lg" message="Loading prompt details..." />
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) return null;

  const wordCount = prompt.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = prompt.content.length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
            <button
              onClick={() => navigate('/prompts')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </button>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400'
                }`}
                title={isFavorite ? 'In favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`}
                />
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>

              <Link to={`/prompts/edit/${prompt._id}`}>
                <Button variant="secondary" size="sm" icon={Edit3}>
                  Edit
                </Button>
              </Link>

              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Prompt Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {prompt.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                {prompt.aiModel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {prompt.title}
            </h1>

            {prompt.description && (
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                {prompt.description}
              </p>
            )}
          </div>

          {/* Full Prompt Content Terminal Card */}
          <div className="rounded-2xl bg-[#0c101c] border border-slate-800 shadow-2xl overflow-hidden mb-8">
            {/* Terminal Top bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  prompt_content.txt
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
                <button
                  onClick={handleCopy}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-xs font-semibold"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>

            {/* Prompt Body with selectable whitespace */}
            <div className="p-6 font-mono text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text bg-[#07090e]">
              {prompt.content}
            </div>
          </div>

          {/* AI Improver Teaser Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-slate-300">
                Want to refine constraints or test this instruction against our AI scoring engine?
              </span>
            </div>
            <Link
              to={`/ai-improver?prompt=${encodeURIComponent(prompt.content)}&category=${encodeURIComponent(prompt.category)}&aiModel=${encodeURIComponent(prompt.aiModel)}`}
            >
              <Button variant="cyan" size="sm" icon={Sparkles} className="shrink-0">
                Improve in AI Studio
              </Button>
            </Link>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs">
            {/* Tags */}
            <div>
              <span className="font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Tags ({prompt.tags?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags && prompt.tags.length > 0 ? (
                  prompt.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">No tags assigned</span>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Timestamps
              </span>
              <p className="text-slate-300">
                Created: {new Date(prompt.createdAt).toLocaleString()}
              </p>
              <p className="text-slate-400">
                Last modified: {new Date(prompt.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Prompt"
      >
        <p className="text-sm text-slate-300 mb-6">
          Are you sure you want to delete{' '}
          <strong className="text-white">"{prompt.title}"</strong>? This action
          cannot be reversed.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowDeleteModal(false)}
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

export default PromptDetailsPage;
