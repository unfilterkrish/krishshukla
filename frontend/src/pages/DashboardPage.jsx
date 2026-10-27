import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { promptApi } from '../api/promptApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PromptCard from '../components/PromptCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPrompts: 0, favoritesCount: 0 });
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, promptsResponse] = await Promise.all([
        promptApi.getStats(),
        promptApi.getPrompts({ sort: 'newest' }),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
      if (promptsResponse.success) {
        setRecentPrompts(promptsResponse.prompts.slice(0, 3));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load dashboard.');
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
      setRecentPrompts((current) =>
        current.map((prompt) =>
          prompt._id === id ? { ...prompt, isFavorite: nextState } : prompt
        )
      );
      setStats((current) => ({
        ...current,
        favoritesCount: Math.max(
          0,
          current.favoritesCount + (nextState ? 1 : -1)
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update favorite.');
    }
  };

  const handleDelete = async () => {
    if (!promptToDelete) return;
    try {
      await promptApi.deletePrompt(promptToDelete._id);
      setRecentPrompts((current) =>
        current.filter((prompt) => prompt._id !== promptToDelete._id)
      );
      setStats((current) => ({
        ...current,
        totalPrompts: Math.max(0, current.totalPrompts - 1),
      }));
      setPromptToDelete(null);
      toast.success('Prompt deleted.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete prompt.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="mt-1 text-sm text-muted">
                Welcome, {user?.name || 'there'}. Here are your saved prompts.
              </p>
            </div>
            <Link to="/prompts/create">
              <Button variant="primary" icon={Plus}>Create Prompt</Button>
            </Link>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="simple-card p-5">
              <p className="text-sm text-muted">Total prompts</p>
              <p className="mt-2 text-3xl font-semibold">{stats.totalPrompts}</p>
            </div>
            <div className="simple-card p-5">
              <p className="text-sm text-muted">Favorites</p>
              <p className="mt-2 text-3xl font-semibold">{stats.favoritesCount}</p>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold">Recent prompts</h2>
                <p className="mt-1 text-sm text-muted">Your latest saved work</p>
              </div>
              <Link className="text-sm text-accent hover:underline" to="/prompts">
                View all
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading prompts..." />
            ) : recentPrompts.length === 0 ? (
              <EmptyState
                title="No prompts saved yet"
                description="Create your first prompt to start building your library."
                actionLabel="Create Prompt"
                onAction={() => navigate('/prompts/create')}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt._id}
                    prompt={prompt}
                    viewMode="list"
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={setPromptToDelete}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 simple-card p-5">
            <h2 className="font-semibold">Improve a prompt</h2>
            <p className="mt-1 text-sm text-muted">
              Paste a draft to get a clearer version from the prompt improver.
            </p>
            <Link className="inline-block mt-3 text-sm text-accent hover:underline" to="/ai-improver">
              Open Improve Prompt
            </Link>
          </section>
        </main>
      </div>

      <Modal
        isOpen={Boolean(promptToDelete)}
        onClose={() => setPromptToDelete(null)}
        title="Delete prompt?"
      >
        <p className="text-sm text-muted mb-5">
          This will permanently delete “{promptToDelete?.title}”.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setPromptToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
