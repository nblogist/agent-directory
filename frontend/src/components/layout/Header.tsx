import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../lib/constants';
import { useTheme, type Theme } from '../../lib/theme';
import RadarLogo from '../RadarLogo';

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const themeIcons: Record<Theme, string> = { light: 'light_mode', dark: 'dark_mode', system: 'monitor' };
  const themeOrder: Theme[] = ['dark', 'light', 'system'];
  function cycleTheme() {
    const i = themeOrder.indexOf(theme);
    setTheme(themeOrder[(i + 1) % themeOrder.length]);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      navigate(`/browse?search=${encodeURIComponent(q)}`);
      setSearch('');
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-dark-bg/80 backdrop-blur-md px-4 sm:px-6 lg:px-20 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-12">
          <Link to="/" className="flex items-center gap-2">
            <RadarLogo size="w-9 h-9" />
            <h2 className="text-xl font-bold tracking-tight text-theme-text">{APP_NAME}</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/browse" className={({ isActive }) => `text-sm font-medium whitespace-nowrap hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-theme-text-secondary'}`}>Directory</NavLink>
            <NavLink to="/api-docs" className={({ isActive }) => `text-sm font-medium whitespace-nowrap hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-theme-text-secondary'}`}>For Agents</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-secondary text-lg">search</span>
            <input
              className="bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm w-64 text-theme-text placeholder:text-theme-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Search tools, services, platforms..."
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          <button
            onClick={cycleTheme}
            className="p-2 text-theme-text-secondary hover:text-primary transition-colors"
            aria-label={`Theme: ${theme}`}
            title={`Theme: ${theme}`}
          >
            <span className="material-symbols-outlined text-lg">{themeIcons[theme]}</span>
          </button>
          <Link to="/submit" className="hidden sm:inline-flex whitespace-nowrap bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(55,19,236,0.4)] active:scale-95">
            Submit a Listing
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="md:hidden p-2 text-theme-text-secondary hover:text-theme-text transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-2 border-t border-primary/10 pt-4 space-y-3">
          <NavLink to="/browse" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `block text-sm font-medium px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/5' : 'text-theme-text-secondary hover:text-theme-text'}`}>Directory</NavLink>
          <NavLink to="/submit" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `block text-sm font-medium px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/5' : 'text-theme-text-secondary hover:text-theme-text'}`}>Submit</NavLink>
          <NavLink to="/api-docs" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `block text-sm font-medium px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/5' : 'text-theme-text-secondary hover:text-theme-text'}`}>For Agents</NavLink>
        </nav>
      )}
    </header>
  );
}
