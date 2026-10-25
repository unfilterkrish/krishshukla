import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  BookmarkPlus,
  ArrowRight,
  TrendingUp,
  Tag,
  Layers,
  Bot,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { promptApi } from '../api/promptApi';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Select from '../components/Select';
import { TextArea } from '../components/Input';

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

const SAMPLE_PROMPTS = [
  {
    label: 'MERN Website (from Stitch design)',
    text: 'make a good website for my project',
    category: 'Development',
    aiModel: 'ChatGPT'
  },
  {
    label: 'Product Photography',
    text: 'product photo of a luxury perfume bottle on black obsidian table',
    category: 'Image Generation',
    aiModel: 'Midjourney'
  },
  {
    label: 'SaaS Copywriting',
    text: 'write a landing page headline and hero text for an ai note taking tool',
    category: 'Marketing',
    aiModel: 'Claude'
  }
];

const AiImproverPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputPrompt, setInputPrompt] = useState(
    searchParams.get('prompt') || ''
  );
  const [category, setCategory] = useState(
    searchParams.get('category') || 'Development'
  );
  const [aiModel, setAiModel] = useState(
    searchParams.get('aiModel') || 'ChatGPT'
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);

  // If prompt was passed via URL query, auto-enhance on load
  useEffect(() => {
    const queryPrompt = searchParams.get('prompt');
    if (queryPrompt && !result) {
      handleImprove(queryPrompt);
    }
  }, [searchParams]);

  const handleImprove = async (promptToUse) => {
    const text = (promptToUse || inputPrompt).trim();
    if (!text) {
      toast.error('Please paste or write a prompt first');
      return;
    }

    setLoading(true);
    try {
      const res = await aiApi.improvePrompt({
        prompt: text,
        category,
        aiModel,
      });

      if (res.success && res.data) {
        setResult(res.data);
        toast.success(`Prompt analyzed & improved! Quality Score: ${res.data.qualityScore}/100`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Improvement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.improvedPrompt) return;
    try {
      await navigator.clipboard.writeText(result.improvedPrompt);
      setCopied(true);
      toast.success('Improved prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSaveToVault = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const newPrompt = {
        title: result.suggestedTitle || 'AI Enhanced Prompt',
        content: result.improvedPrompt,
        category: result.suggestedCategory || category,
        aiModel: aiModel,
        tags: result.suggestedTags || [],
        description: `Enhanced via AI Studio with Quality Score ${result.qualityScore}/100.`,
      };

      await promptApi.createPrompt(newPrompt);
      toast.success('Prompt successfully saved to your vault!');
      navigate('/prompts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save prompt');
    } finally {
      setSaving(false);
    }
  };

  const handleFineTuneInEditor = () => {
    if (!result) return;
    navigate('/prompts/create', {
      state: {
        title: result.suggestedTitle,
        content: result.improvedPrompt,
        category: result.suggestedCategory || category,
        aiModel: aiModel,
        tags: result.suggestedTags || [],
        description: `Enhanced via AI Studio (Score: ${result.qualityScore}/100)`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Header */}
          <div className="pb-6 border-b border-slate-800/80 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Autonomous Refinement Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Prompt Improver
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Transform rough, vague ideas into clear, structured, high-quality
              instructions with automated quality scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Workspace Panel */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Your Prompt
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    {inputPrompt.length} chars
                  </span>
                </div>

                <TextArea
                  rows={8}
                  placeholder="Paste your prompt here... (e.g. 'make a good website for my project')"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  className="bg-slate-950/80"
                />

                {/* Target Configuration */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Select
                    label="Category"
                    options={CATEGORIES}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <Select
                    label="Target Model"
                    options={AI_MODELS}
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                  />
                </div>

                {/* Submit Action */}
                <div className="mt-5">
                  <Button
                    onClick={() => handleImprove()}
                    loading={loading}
                    variant="primary"
                    size="lg"
                    className="w-full font-bold shadow-xl shadow-purple-600/30 py-3"
                  >
                    <Wand2 className="w-4 h-4 mr-1.5" />
                    <span>Improve Prompt ✨</span>
                  </Button>
                </div>
              </div>

              {/* Quick Try Sample Chips */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <p className="text-xs font-semibold text-slate-400 mb-2.5">
                  Need inspiration? Try these presets:
                </p>
                <div className="space-y-1.5">
                  {SAMPLE_PROMPTS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputPrompt(sample.text);
                        setCategory(sample.category);
                        setAiModel(sample.aiModel);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/30 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium truncate">{sample.label}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {sample.aiModel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output / Results Panel */}
            <div className="lg:col-span-7">
              {loading ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0c101c] border border-slate-800">
                  <div className="relative mb-4">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Wand2 className="w-5 h-5 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Analyzing & Restructuring...
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs text-center">
                    Injecting expert persona, defining crisp constraints, and formatting parameters.
                  </p>
                </div>
              ) : result ? (
                <div className="rounded-2xl bg-gradient-to-b from-[#111728] to-[#0c101c] border border-purple-500/40 p-6 shadow-2xl space-y-6">
                  {/* Quality Score Header matching Stitch Before & After */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                          AI Improved Prompt
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white mt-1">
                        {result.suggestedTitle}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>Quality Score:</span>
                        <span className="text-white text-sm">
                          {result.qualityScore} / 100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Optimization Gain:</span>
                      <span className="text-cyan-400 font-semibold">
                        +{result.qualityScore - (result.originalScore || 35)}% clarity improvement
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                        style={{ width: `${result.qualityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Improved Prompt Box (Monospace) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Improved Version
                      </span>
                      <button
                        onClick={handleCopy}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
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
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                      "{result.improvedPrompt}"
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">
                        Suggested Category:
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                        {result.suggestedCategory || category}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">
                        Suggested Tags:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(result.suggestedTags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Suggestions List */}
                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5 mb-2.5">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        Specific Improvements Made:
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {result.suggestions.map((sug, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold">•</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <Button
                      onClick={handleCopy}
                      variant="secondary"
                      size="md"
                      icon={copied ? Check : Copy}
                      className="w-full sm:w-auto"
                    >
                      {copied ? 'Copied to Clipboard' : 'Copy Improved Prompt'}
                    </Button>

                    <Button
                      onClick={handleFineTuneInEditor}
                      variant="glass"
                      size="md"
                      className="w-full sm:w-auto text-purple-300 hover:text-white"
                    >
                      Fine-tune in Editor &rarr;
                    </Button>

                    <Button
                      onClick={handleSaveToVault}
                      loading={saving}
                      variant="primary"
                      size="md"
                      icon={BookmarkPlus}
                      className="w-full sm:w-auto font-bold"
                    >
                      Save to Vault
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty state when no prompt has been improved yet */
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0c101c]/60 border border-dashed border-slate-800 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-inner">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Ready to refine your prompts
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                    Enter a prompt on the left and click "Improve Prompt" to receive
                    a structured, scored, production-ready instruction.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AiImproverPage;

