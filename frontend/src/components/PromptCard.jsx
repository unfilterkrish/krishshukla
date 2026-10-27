import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Edit3, Heart, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Button from './Button';

const PromptCard = ({ prompt, onToggleFavorite, onDelete }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(prompt.isFavorite);

  const handleCopy = async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied.');
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      toast.error('Could not copy the prompt.');
    }
  };

  const handleFavorite = async (event) => {
    event.stopPropagation();
    const nextValue = !isFavorite;
    setIsFavorite(nextValue);
    if (onToggleFavorite) {
      await onToggleFavorite(prompt._id, nextValue);
    }
  };

  return (
    <article className="simple-card p-4">
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => navigate(`/prompts/${prompt._id}`)}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="px-2 py-1 bg-page border border-line rounded">
            {prompt.category || 'Other'}
          </span>
          {prompt.aiModel && <span>{prompt.aiModel}</span>}
        </div>
        <h3 className="mt-3 font-semibold">{prompt.title}</h3>
        <p className="mt-2 text-sm text-muted leading-5 line-clamp-3">
          {prompt.content}
        </p>
      </button>

      <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleFavorite}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-accent' : ''}`} />
          {isFavorite ? 'Saved' : 'Favorite'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/prompts/edit/${prompt._id}`);
          }}
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </Button>
        {onDelete && (
          <Button
            size="sm"
            variant="secondary"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(prompt);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        )}
      </div>
    </article>
  );
};

export default PromptCard;
