import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="font-semibold text-lg tracking-tight"
          >
            Prompt Vault AI
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            <Link className="nav-link" to="/">Home</Link>
            {isAuthenticated && (
              <>
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                <Link className="nav-link" to="/prompts">My Prompts</Link>
                <Link className="nav-link" to="/ai-improver">Improve Prompt</Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted">{user?.name}</span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">Log in</Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Create account</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded border border-line"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-line py-3 flex flex-col gap-1">
            <Link className="mobile-nav-link" to="/" onClick={closeMenu}>Home</Link>
            {isAuthenticated ? (
              <>
                <Link className="mobile-nav-link" to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                <Link className="mobile-nav-link" to="/prompts" onClick={closeMenu}>My Prompts</Link>
                <Link className="mobile-nav-link" to="/ai-improver" onClick={closeMenu}>Improve Prompt</Link>
                <button className="mobile-nav-link text-left" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link className="mobile-nav-link" to="/login" onClick={closeMenu}>Log in</Link>
                <Link className="mobile-nav-link" to="/register" onClick={closeMenu}>Create account</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
