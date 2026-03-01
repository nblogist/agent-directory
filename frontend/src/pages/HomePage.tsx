import { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import LeaderboardTable from '../components/home/LeaderboardTable';
import StatsBar from '../components/home/StatsBar';
import { APP_NAME } from '../lib/constants';

/**
 * HomePage — the public landing page.
 *
 * Sections (top to bottom, matching homepage_2 design):
 *   1. HeroSection    — badge, h1, subtitle, large search bar, trending category pills
 *   2. LeaderboardTable — top 5 agents ranked by view count from /api/listings?sort=views&per_page=5
 *   3. StatsBar       — 4-stat grid (total agents, views, categories, chains) from real API
 *
 * All data fetching is handled independently by each child component via TanStack Query.
 * This component is responsible only for composition and page-level concerns (title, structure).
 */
export default function HomePage() {
  useEffect(() => {
    document.title = `${APP_NAME} — Discover the Best AI Agents`;
    return () => {
      document.title = APP_NAME;
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hero: badge, headline, search, trending pills */}
      <HeroSection />

      {/* Top agents leaderboard */}
      <LeaderboardTable />

      {/* Platform stats bar */}
      <StatsBar />
    </div>
  );
}
