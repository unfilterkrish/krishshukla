import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Copy,
  Check,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Bot
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Color map for categories matching Stitch dark palette
const CATEGORY_COLORS = {
  'Image Generation': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Development: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  Marketing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Productivity: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Writing: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  Education: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  Other: 'bg-slate-500/10 text-slate-300 border-slate-700'
};

// Model indicator badges
const MODEL_COLORS = {
  ChatGPT: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Claude: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Gemini: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Midjourney: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Other: 'text-slate-400 bg-slate-500/10 border-slate-700'
};

const PromptCard = ({
  prompt,
  onToggleFavorite,
  onDelete,
  viewMode = 'grid' // 'grid' | 'list'
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [isFavLocal, setIsFavLocal] = useState(prompt.isFavorite);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const nextState = !isFavLocal;
    setIsFavLocal(nextState);
    if (onToggleFavorite) {
      await onToggleFavorite(prompt._id, nextState);
    }
  };

  const handleCardClick = () => {
    navigate(`/prompts/${prompt._id}`);
  };

  // Highlights `{parameter}` tokens inside prompt previews
  const renderHighlightedContent = (text) => {
    const parts = text.split(/(\{.*?\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        return (
          <span
            key={i}
            className="text-cyan-300 bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-800/60 text-xs font-mono font-semibold"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-purple-950/20"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.Other
              }`}
            >
              {prompt.category}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${
                MODEL_COLORS[prompt.aiModel] || MODEL_COLORS.Other
              }`}
            >
              <Bot className="w-3 h-3" />
              {prompt.aiModel}
            </span>
            {prompt.tags &&
              prompt.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
            {prompt.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-mono">
            {prompt.content}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-xl transition-colors ${
              isFavLocal
                ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
            }`}
            title={isFavLocal ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavLocal ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-purple-600/30 text-slate-200 hover:text-white border border-slate-700/60 hover:border-purple-500/40 text-xs font-medium transition-colors"
            title="Copy prompt"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigate(`/prompts/edit/${prompt._id}`)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Edit prompt"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(prompt)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete prompt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid view (matching Stitch prompt card preview closely)
  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#0d121f]/90 hover:bg-[#111728] border border-slate-800/90 hover:border-purple-500/40 transition-all duration-300 p-5 cursor-pointer shadow-xl hover:shadow-purple-950/20 hover:-translate-y-0.5"
    >
      <div>
        {/* Top bar with category, model and favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.Other
              }`}
            >
              {prompt.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border flex items-center gap-1 ${
                MODEL_COLORS[prompt.aiModel] || MODEL_COLORS.Other
              }`}
            >
              <Bot className="w-3 h-3" />
              {prompt.aiModel}
            </span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavLocal
                  ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
              }`}
              title={isFavLocal ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavLocal ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1 mb-2">
          {prompt.title}
        </h3>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {prompt.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[11px] font-medium text-slate-400">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Content Box with monospace font matching Stitch design */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 overflow-hidden text-xs font-mono text-slate-300 leading-relaxed line-clamp-4 select-text">
          "{renderHighlightedContent(prompt.content)}"
        </div>
      </div>

      {/* Card Footer: Copy Prompt button & actions */}
      <div
        className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-purple-600/30 text-slate-200 hover:text-white border border-slate-700/70 hover:border-purple-500/40 text-xs font-semibold transition-all duration-150 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Prompt copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-purple-400" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/ai-improver?prompt=${encodeURIComponent(prompt.content)}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors"
            title="Improve with AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/prompts/edit/${prompt._id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Edit prompt"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(prompt)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete prompt"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
