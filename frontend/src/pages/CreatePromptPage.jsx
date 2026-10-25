import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Save,
  X,
  Plus,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { promptApi } from '../api/promptApi';
import { aiApi } from '../api/aiApi';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input, { TextArea } from '../components/Input';
import Select from '../components/Select';

const CATEGORIES = [
  'Development',
  'Writing',
  'Marketing',
  'Image Generation',
  'Productivity',
  'Education',
  'Other'
];

const AI_MODELS = [
  'ChatGPT',
  'Gemini',
  'Claude',
  'Midjourney',
  'Other'
];

const CreatePromptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // If redirected from AI Improver with initial state
  const prefill = location.state || {};

  const [formData, setFormData] = useState({
    title: prefill.title || '',
    description: prefill.description || '',
    content: prefill.content || '',
    category: prefill.category || 'Development',
    aiModel: prefill.aiModel || 'ChatGPT',
  });

  const [tags, setTags] = useState(prefill.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Prompt content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await promptApi.createPrompt({
        ...formData,
        tags,
      });
      toast.success('Prompt created successfully!');
      navigate('/prompts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleInlineImprove = async () => {
    if (!formData.content.trim()) {
      setErrors((prev) => ({
        ...prev,
        content: 'Please enter prompt content to improve with AI',
      }));
      return;
    }

    setImproving(true);
    try {
      const res = await aiApi.improvePrompt({
        prompt: formData.content,
        category: formData.category,
        aiModel: formData.aiModel,
      });

      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          content: res.data.improvedPrompt,
          title: prev.title || res.data.suggestedTitle,
          category: res.data.suggestedCategory || prev.category,
        }));
        if (res.data.suggestedTags && res.data.suggestedTags.length > 0) {
          setTags((prev) => Array.from(new Set([...prev, ...res.data.suggestedTags])));
        }
        toast.success(`Prompt enhanced! (Quality score: ${res.data.qualityScore}/100)`);
      }
    } catch (err) {
      toast.error('AI improvement failed. Please try again.');
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/prompts')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Create New Prompt
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Save a reusable instruction to your personal cloud vault
                </p>
              </div>
            </div>

            {/* Quick Improve with AI Button */}
            <Button
              onClick={handleInlineImprove}
              loading={improving}
              variant="cyan"
              size="sm"
              icon={Wand2}
            >
              Improve with AI ✨
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            {/* Title */}
            <Input
              label="Prompt Title"
              name="title"
              required
              placeholder="e.g. Cinematic Product Photography"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />

            {/* Category and AI Model Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                name="category"
                required
                options={CATEGORIES}
                value={formData.category}
                onChange={handleChange}
              />

              <Select
                label="Target AI Model"
                name="aiModel"
                required
                options={AI_MODELS}
                value={formData.aiModel}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <Input
              label="Description (Optional context or notes)"
              name="description"
              placeholder="Brief summary of when and how to use this prompt..."
              value={formData.description}
              onChange={handleChange}
            />

            {/* Prompt Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Prompt Content <span className="text-purple-400">*</span>
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {formData.content.length} characters
                </span>
              </div>
              <TextArea
                name="content"
                rows={6}
                required
                placeholder="Write or paste your full prompt instruction here. Use {variables} for dynamic tokens..."
                value={formData.content}
                onChange={handleChange}
                error={errors.content}
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Pro tip: Wrap interchangeable placeholders in curly braces like{' '}
                <code className="text-cyan-300 font-mono">&#123;Product_Name&#125;</code> for instant visibility.
              </p>
            </div>

            {/* Tags Manager */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tags (Press Enter or comma to add)
              </label>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all flex flex-wrap items-center gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={tags.length === 0 ? "e.g. React, MERN, Frontend..." : "Add another..."}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none flex-1 min-w-[120px] px-2 py-1"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/prompts')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                icon={Save}
              >
                Save Prompt
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreatePromptPage;
