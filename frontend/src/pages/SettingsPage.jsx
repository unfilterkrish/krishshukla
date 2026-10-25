import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Download,
  Key,
  Check,
  Sparkles,
  Database,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { promptApi } from '../api/promptApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [exporting, setExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be blank');
      return;
    }
    updateUser({ name: name.trim() });
    setSavedSuccess(true);
    toast.success('Profile details saved!');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportVault = async () => {
    try {
      setExporting(true);
      const res = await promptApi.getPrompts();
      if (res.success && res.prompts) {
        const dataStr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(JSON.stringify(res.prompts, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute(
          'download',
          `prompt-vault-backup-${new Date().toISOString().slice(0, 10)}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success(`Exported ${res.prompts.length} prompts to JSON!`);
      }
    } catch (err) {
      toast.error('Failed to export prompt library');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="pb-6 border-b border-slate-800/80 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Settings & Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your personal preferences, AI engine integrations, and data backups
            </p>
          </div>

          <div className="max-w-3xl space-y-8">
            {/* User Profile Section */}
            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                Profile Information
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                />

                <Input
                  label="Email address"
                  value={email}
                  disabled
                  helperText="Email cannot be changed directly in demo mode."
                  icon={Mail}
                  className="opacity-70 cursor-not-allowed"
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={savedSuccess ? Check : null}
                  >
                    {savedSuccess ? 'Saved!' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </div>

            {/* AI Engine Provider Settings */}
            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  AI Engine Status
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Online & Active
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Prompt Vault AI uses a secure backend proxy to communicate with LLM providers.
                Your API keys are never exposed to the client browser.
              </p>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current AI Mode:</span>
                  <span className="font-semibold text-purple-300">
                    Dual Fallback Engine (Gemini / OpenAI / Smart Heuristics)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Environment API Key:</span>
                  <span className="font-mono text-cyan-400">
                    Configured in backend/.env
                  </span>
                </div>
              </div>
            </div>

            {/* Data Export & Backup */}
            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                Data Portability & Backup
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Download a complete, offline JSON copy of all your saved prompts, tags, categories, and AI model configurations.
              </p>

              <Button
                onClick={handleExportVault}
                loading={exporting}
                variant="secondary"
                size="md"
                icon={Download}
              >
                Export All Prompts (JSON)
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

