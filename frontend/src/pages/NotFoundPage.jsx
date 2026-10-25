import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 shadow-inner">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-slate-200 mb-3">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        The prompt or page you are looking for does not exist or has been moved to another vault sector.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="secondary" size="md" icon={Home}>
            Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

