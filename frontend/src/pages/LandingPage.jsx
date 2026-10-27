import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderOpen, Sparkles, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: FolderOpen,
    title: 'Save prompts',
    description: 'Keep useful prompts together in one place.',
  },
  {
    icon: Search,
    title: 'Find them easily',
    description: 'Search by title, category or prompt text.',
  },
  {
    icon: Sparkles,
    title: 'Improve a draft',
    description: 'Use the improver to make a prompt clearer.',
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-page text-body">
      <Navbar />
      <main className="w-full max-w-5xl mx-auto flex-1 px-4 sm:px-6 py-12 sm:py-16">
        <section className="max-w-2xl">
          <p className="text-sm font-medium text-muted">B.Tech CSE project</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Prompt Vault AI
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-7">
            A simple place to write, improve and save prompts for AI tools.
            Create your own prompt library and find your work again whenever
            you need it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={isAuthenticated ? '/prompts/create' : '/register'}>
              <Button variant="primary" size="md">
                Create Prompt
              </Button>
            </Link>
            <Link to={isAuthenticated ? '/ai-improver' : '/register'}>
              <Button variant="secondary" size="md">
                Generate / Improve
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="mt-14 grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="simple-card p-5">
              <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted leading-6">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 simple-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold">Start with a prompt of your own</h2>
            <p className="mt-1 text-sm text-muted">
              Create an account to save and manage your prompts.
            </p>
          </div>
          <Link to={isAuthenticated ? '/dashboard' : '/register'}>
            <Button variant="primary" size="md">
              {isAuthenticated ? 'Open Dashboard' : 'Get Started'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
