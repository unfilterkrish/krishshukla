import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'My Prompts', path: '/prompts' },
  { name: 'Favorites', path: '/favorites' },
  { name: 'Improve Prompt', path: '/ai-improver' },
  { name: 'Settings', path: '/settings' },
];

const Sidebar = () => (
  <aside className="md:w-52 shrink-0 md:border-r border-line">
    <nav className="flex md:flex-col gap-1 overflow-x-auto p-3 md:sticky md:top-14">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `whitespace-nowrap rounded px-3 py-2 text-sm ${
              isActive ? 'bg-accent-light text-accent font-medium' : 'nav-link'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
