import React, { useState } from 'react';
import { Download, User } from 'lucide-react';
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
  const [exporting, setExporting] = useState(false);

  const handleSaveProfile = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be blank.');
      return;
    }
    updateUser({ name: name.trim() });
    toast.success('Profile saved.');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await promptApi.getPrompts();
      if (!response.success || !response.prompts) {
        throw new Error('Could not export prompts.');
      }
      const file = new Blob([JSON.stringify(response.prompts, null, 2)], {
        type: 'application/json',
      });
      const downloadUrl = URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = `prompt-vault-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      toast.success(`Exported ${response.prompts.length} prompts.`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not export prompts.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="mt-1 text-sm text-muted">Update your account name or download your prompts.</p>
          </header>

          <div className="max-w-2xl space-y-4">
            <section className="simple-card p-5">
              <h2 className="font-semibold">Profile</h2>
              <form className="mt-4 space-y-4" onSubmit={handleSaveProfile}>
                <Input
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  icon={User}
                />
                <Input label="Email" value={user?.email || ''} disabled />
                <Button type="submit" variant="primary">Save changes</Button>
              </form>
            </section>

            <section className="simple-card p-5">
              <h2 className="font-semibold">Export prompts</h2>
              <p className="mt-1 text-sm text-muted">
                Download a JSON backup of the prompts saved in your vault.
              </p>
              <Button
                className="mt-4"
                variant="secondary"
                loading={exporting}
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
