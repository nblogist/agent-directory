import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrendingPills from './TrendingPills';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/browse?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/browse');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <section className="py-20 sm:py-28 text-center max-w-4xl mx-auto px-4">
      {/* Badge pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
          bolt
        </span>
        The Next Evolution of AI
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight neon-glow">
        Discover the Best AI Agents
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
        Browse, compare, and discover AI-first tools and agents across the
        decentralized ecosystem.
      </p>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="mt-10 max-w-xl mx-auto"
        role="search"
        aria-label="Search AI agents"
      >
        <div className="relative flex items-center bg-dark-surface border border-dark-border rounded-xl focus-within:border-primary/50 transition-colors">
          {/* Search icon */}
          <span
            className="material-symbols-outlined absolute left-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          >
            search
          </span>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search AI agents..."
            className="w-full bg-transparent pl-12 pr-32 py-4 text-lg rounded-xl outline-none placeholder:text-gray-500 text-white"
          />

          {/* Explore button */}
          <button
            type="submit"
            className="absolute right-2 bg-primary hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(55,19,236,0.4)] active:scale-95 transition-all text-white font-semibold px-6 py-2.5 rounded-lg"
          >
            Explore
          </button>
        </div>
      </form>

      {/* Trending category pills */}
      <TrendingPills />
    </section>
  );
}
