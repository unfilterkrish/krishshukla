import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Copy, Save } from 'lucide-react';
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
  'Other',
];

const AI_MODELS = ['ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'Other'];

const AiImproverPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputPrompt, setInputPrompt] = useState(searchParams.get('prompt') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'Development');
  const [aiModel, setAiModel] = useState(searchParams.get('aiModel') || 'ChatGPT');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);

  const handleImprove = async (promptToUse = inputPrompt) => {
    const text = promptToUse.trim();
    if (!text) {
      toast.error('Enter a prompt to improve.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await aiApi.improvePrompt({
        prompt: text,
        category,
        aiModel,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Could not improve this prompt.');
      }
      setResult(response.data);
      toast.success('Prompt improved.');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Improvement failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setInputPrompt(prompt);
      handleImprove(prompt);
    }
  }, [searchParams]);

  const handleCopy = async () => {
    if (!result?.improvedPrompt) return;
    try {
      await navigator.clipboard.writeText(result.improvedPrompt);
      setCopied(true);
      toast.success('Improved prompt copied.');
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      toast.error('Could not copy the prompt.');
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await promptApi.createPrompt({
        title: result.suggestedTitle || 'Improved prompt',
        content: result.improvedPrompt,
        category: result.suggestedCategory || category,
        aiModel,
        tags: result.suggestedTags || [],
        description: 'Improved with Prompt Vault AI.',
      });
      toast.success('Prompt saved to your vault.');
      navigate('/prompts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save the prompt.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Improve Prompt</h1>
            <p className="mt-1 text-sm text-muted">
              Paste a prompt, choose a category and model, then review the improved version.
            </p>
          </header>

          <div className="max-w-3xl space-y-5">
            <section className="simple-card p-5">
              <TextArea
                label="Prompt to improve"
                rows={7}
                placeholder="Paste or write your prompt here..."
                value={inputPrompt}
                onChange={(event) => {
                  setInputPrompt(event.target.value);
                  setResult(null);
                }}
              />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={CATEGORIES}
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
                <Select
                  label="AI model"
                  options={AI_MODELS}
                  value={aiModel}
                  onChange={(event) => setAiModel(event.target.value)}
                />
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  loading={loading}
                  disabled={!inputPrompt.trim()}
                  onClick={() => handleImprove()}
                >
                  {loading ? 'Improving...' : 'Improve Prompt'}
                </Button>
              </div>
            </section>

            {loading && (
              <p className="text-sm text-muted" role="status">
                Improving your prompt. Please wait...
              </p>
            )}

            {result && (
              <section className="simple-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {result.suggestedTitle || 'Improved prompt'}
                    </h2>
                    {result.qualityScore != null && (
                      <p className="mt-1 text-sm text-muted">
                        Quality score: {result.qualityScore}/100
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="primary" loading={saving} onClick={handleSave}>
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-page border border-line rounded whitespace-pre-wrap text-sm leading-6 select-text">
                  {result.improvedPrompt}
                </div>
                <Link
                  className="inline-block mt-4 text-sm text-accent hover:underline"
                  to="/prompts/create"
                  state={{
                    title: result.suggestedTitle,
                    content: result.improvedPrompt,
                    category: result.suggestedCategory || category,
                    aiModel,
                    tags: result.suggestedTags || [],
                  }}
                >
                  Edit before saving
                </Link>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AiImproverPage;
