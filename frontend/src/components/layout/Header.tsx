import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../lib/constants';

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      navigate(`/browse?search=${encodeURIComponent(q)}`);
      setSearch('');
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-dark-bg/80 backdrop-blur-md px-6 lg:px-20 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">deployed_code</span>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">{APP_NAME}</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/browse" className={({ isActive }) => `text-sm font-medium hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>Directory</NavLink>
            <NavLink to="/submit" className={({ isActive }) => `text-sm font-medium hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}>Submit</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              className="bg-primary/10 border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary"
              placeholder="Search tools, services, platforms..."
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          <Link to="/submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(55,19,236,0.4)] active:scale-95">
            Submit a Listing
          </Link>
        </div>
      </div>
    </header>
  );
}
