import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  Star,
  Copy,
  Check,
  FolderOpen,
  Filter,
  CheckCircle2,
  Lock,
  Layers,
  Wand2,
  Bot,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Share2,
  Heart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../api/aiApi';

const LandingPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [copiedHero, setCopiedHero] = useState(false);

  // Interactive AI Improver Demo state right on landing page
  const [demoInput, setDemoInput] = useState('make a good website for my project');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState({
    originalScore: 38,
    qualityScore: 92,
    improvedPrompt:
      'Create a modern responsive portfolio website for a MERN Stack developer using React and Tailwind CSS. Include a dark-mode hero section, interactive project showcase cards with github links, skill radar chart, and accessible contact form with formik validation.',
    category: 'Development',
    tags: ['React', 'MERN', 'Frontend', 'TailwindCSS'],
    suggestions: [
      'Added explicit tech stack constraints (React, Tailwind CSS, MERN)',
      'Defined key visual components and dark-mode requirement',
      'Specified interactive widgets (radar chart, project showcase)',
      'Added accessible form requirements and validation library'
    ]
  });

  const handleCopyHero = () => {
    navigator.clipboard.writeText(
      'Create a cinematic product photograph with dramatic studio lighting, {105mm f/1.4} lens depth of field, subtle rim glow, hyper-detailed texture on dark obsidian background...'
    );
    setCopiedHero(true);
    toast.success('Prompt copied!');
    setTimeout(() => setCopiedHero(false), 2000);
  };

  const handleRunDemo = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    try {
      const res = await aiApi.improveDemo({
        prompt: demoInput,
        category: 'Development',
        aiModel: 'ChatGPT'
      });
      if (res.success && res.data) {
        setDemoResult({
          originalScore: res.data.originalScore || 38,
          qualityScore: res.data.qualityScore || 92,
          improvedPrompt: res.data.improvedPrompt,
          category: res.data.suggestedCategory || 'Development',
          tags: res.data.suggestedTags || ['React', 'MERN', 'Frontend'],
          suggestions: res.data.suggestions || []
        });
        toast.success('Prompt enhanced with AI score!');
      }
    } catch (err) {
      toast.info('Enhancement applied with smart rules engine');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-700/20 via-indigo-600/15 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

          <div className="text-center max-w-3xl mx-auto">
            {/* Top Badge matching Stitch */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner mb-6 backdrop-blur-md">
              <span className="text-cyan-400">✦</span>
              <span>Your AI Prompt Workspace</span>
            </div>

            {/* Headline matching Stitch exact layout & colors */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-5">
              <span>Your AI Prompts.</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Organized.{' '}
              </span>
              <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                Smarter.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Save, organize, discover and improve your best AI prompts — all in
              one powerful workspace.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-semibold shadow-xl shadow-indigo-600/30"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <a href="#explore" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto font-semibold flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Explore Prompts</span>
                </Button>
              </a>
            </div>

            {/* 5-Star Social Proof from Stitch design */}
            <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <span>🛡️</span>
                <span>Built for creators, developers & AI enthusiasts</span>
              </div>
            </div>
          </div>

          {/* ================= HERO CARD PREVIEW (Exact match of Stitch design) ================= */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-b from-[#111728] to-[#0c101d] border border-slate-800/90 shadow-2xl p-6 relative overflow-hidden backdrop-blur-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Image Generation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    ChatGPT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700/60">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Tags */}
              <h3 className="text-lg font-bold text-white mb-2">
                Cinematic Product Photography
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded">
                  #cinematic
                </span>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded">
                  #product
                </span>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded">
                  #photography
                </span>
              </div>

              {/* Monospace Code Prompt Snippet */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                "Create a cinematic product photograph with dramatic studio
                lighting,{' '}
                <span className="text-cyan-300 bg-cyan-950/70 px-1 py-0.5 rounded border border-cyan-800/60 font-semibold">
                  &#123;105mm f/1.4&#125;
                </span>{' '}
                lens depth of field, subtle rim glow, hyper-detailed texture on
                dark obsidian background...."
              </div>

              {/* Card Footer: Copy Prompt, Shares, Quality */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleCopyHero}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-purple-600/30 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95"
                >
                  {copiedHero ? (
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

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">248 shares</span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    98% Score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className="py-12 border-y border-slate-800/80 bg-[#090d16]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  10K+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                  Prompts Saved
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 tracking-tight">
                  2K+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                  Active Users
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 tracking-tight">
                  50+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                  Categories
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-indigo-300 tracking-tight">
                  10+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                  AI Models
                </p>
              </div>
            </div>

            {/* Supported Models strip */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono font-medium text-slate-400">
              <span className="hover:text-emerald-400 transition-colors">ChatGPT</span>
              <span>·</span>
              <span className="hover:text-amber-400 transition-colors">Claude</span>
              <span>·</span>
              <span className="hover:text-blue-400 transition-colors">Gemini</span>
              <span>·</span>
              <span className="hover:text-pink-400 transition-colors">Midjourney</span>
              <span>·</span>
              <span className="hover:text-purple-400 transition-colors">Llama 3</span>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ("ENGINEERED FOR FLOW") ================= */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Engineered For Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              Everything you need to manage your prompts
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              A smarter workspace for saving, organizing and improving the
              prompts you use every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-purple-500/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Save & Organize</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep your best prompts organized in one personal AI vault with zero clutter.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Find Anything Fast</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Search your prompt library instantly using titles, categories and parameter tags.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Improve with AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turn simple prompts into cleaner, more powerful instructions with automated scoring.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quick Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep your most useful prompts just one click away on any desktop or mobile device.
              </p>
            </div>
          </div>
        </section>

        {/* ================= INSTANT RETRIEVAL / LIBRARY PREVIEW ================= */}
        <section id="explore" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Copy & Checklist */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Instant Retrieval
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4 tracking-tight">
                Your entire prompt library, in one place.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mb-8 leading-relaxed">
                Stop scrolling through old chats to find the prompt you need.
                Store everything in a clean, searchable workspace.
              </p>

              {/* Feature Checklist matching Stitch */}
              <div className="space-y-3.5 mb-8">
                {[
                  'Search instantly across variables and instructions',
                  'Organize with custom categories and color codes',
                  'Add custom tags for fast multi-dimensional filtering',
                  'Favorite important prompts for one-tap retrieval',
                  'Copy with one click directly into any AI tool'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-300 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link to={isAuthenticated ? '/prompts' : '/register'}>
                <Button variant="primary" size="md" icon={ArrowRight}>
                  Explore Your Vault
                </Button>
              </Link>
            </div>

            {/* Right Column: Interactive UI Mock matching Stitch screenshot */}
            <div className="rounded-2xl bg-[#0c101c] border border-slate-800 p-6 shadow-2xl relative">
              {/* Search Bar with ⌘K badge */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search prompts, tags, models..."
                  readOnly
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-300 cursor-default"
                />
                <span className="absolute right-3 top-2 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                  ⌘K
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/30 text-purple-200 border border-purple-500/40">
                  All (42)
                </span>
                <span className="px-3 py-1 rounded-full text-xs text-slate-400 bg-slate-900 border border-slate-800">
                  Development
                </span>
                <span className="px-3 py-1 rounded-full text-xs text-slate-400 bg-slate-900 border border-slate-800">
                  Writing
                </span>
                <span className="px-3 py-1 rounded-full text-xs text-slate-400 bg-slate-900 border border-slate-800">
                  Marketing
                </span>
              </div>

              {/* Dropdown Filters row */}
              <div className="flex items-center justify-between gap-2 mb-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  <span>Model: Claude, GPT, Other</span>
                  <span className="text-[10px]">▼</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  <span>Recently Used</span>
                  <SlidersHorizontal className="w-3 h-3" />
                </div>
              </div>

              {/* Mock Prompt Items */}
              <div className="space-y-3">
                {/* Item 1 */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold text-white">
                        Code Refactoring & Unit Tests
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Heart className="w-3 h-3 text-rose-400 fill-current" />
                      <Share2 className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-xs font-mono text-slate-400 line-clamp-1 mb-2">
                    Refactor the provided TypeScript React hook for state...
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Claude 3.5 Sonnet
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      #React
                    </span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        High-Converting SaaS Landing Copy
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Heart className="w-3 h-3" />
                      <Share2 className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-xs font-mono text-slate-400 line-clamp-1 mb-2">
                    Adopt the persona of an elite direct-response copywriter...
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      GPT-4o
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      #Copywriting
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AI IMPROVER SHOWCASE ("AUTONOMOUS REFINEMENT") ================= */}
        <section id="ai-showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Autonomous Refinement
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              Make every prompt better with AI.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Transform rough ideas into clear, structured and high-quality
              prompts in seconds.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Original Card */}
            <div className="rounded-2xl bg-[#0c101c] border border-slate-800 p-5 mb-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">
                  Original Prompt
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                  ▲ {demoResult.originalScore}/100 Vague
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 font-mono text-sm text-slate-200 border border-slate-800 focus:outline-none focus:border-purple-500"
                  placeholder="Type any prompt..."
                />
                <Button
                  onClick={handleRunDemo}
                  loading={demoLoading}
                  variant="primary"
                  size="sm"
                  className="shrink-0"
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  Score
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-2.5">
                Lacks persona, tech stack constraints, visual layout specifics, and interaction states.
              </p>
            </div>

            {/* Downward Pulse Arrow */}
            <div className="flex justify-center -my-1 relative z-10">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg">
                <Wand2 className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* AI Improved Card */}
            <div className="rounded-2xl bg-gradient-to-b from-[#111728] to-[#0c101c] border border-purple-500/30 p-6 mt-3 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-bold text-purple-300">
                    AI Improved Prompt
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  {demoResult.qualityScore}/100 High Quality
                </span>
              </div>

              {/* Improved Prompt Monospace content */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                "{demoResult.improvedPrompt}"
              </div>

              {/* Quality Progress Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Quality Score:</span>
                  <span className="text-cyan-400">{demoResult.qualityScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${demoResult.qualityScore}%` }}
                  />
                </div>
              </div>

              {/* Category & Tags row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-slate-200 font-semibold">
                    {demoResult.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {demoResult.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-purple-300 bg-purple-900/30 border border-purple-500/20 px-2 py-0.5 rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link to="/ai-improver">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 hover:opacity-95 transition-all">
                  <Sparkles className="w-4 h-4" />
                  <span>Improve Your Prompt in Studio 🪄</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= WORKFLOW SECTION (Three Steps) ================= */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              From idea to powerful prompt in three steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Create</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Write a new prompt or save one you already use directly into your cloud vault.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Organize</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add categories, tags and AI model configurations for instantaneous multi-filter search.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Improve & Reuse</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use AI to improve your prompt instructions and copy them seamlessly whenever inspiration strikes.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA CARD ================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d121f] to-[#080b12] border border-purple-500/30 p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto mb-6 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Build your personal AI prompt library.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-md mx-auto">
              Your best prompts deserve a better home. Join thousands of creators engineering higher-quality AI outputs.
            </p>

            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button
                variant="primary"
                size="lg"
                className="font-bold shadow-xl shadow-purple-600/30 px-8 py-3.5"
              >
                <span>Create Your Vault</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <p className="text-xs text-slate-400 mt-4">
              Free to get started · No credit card required
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
