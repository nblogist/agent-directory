import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PublicListing } from '../../types/api';
import ComingSoonOverlay from './ComingSoonOverlay';

interface DetailDescriptionProps {
  listing: PublicListing;
}

/** Fake chart bars for the Performance Metrics coming-soon background */
function FauxChartBars() {
  const heights = [40, 65, 50, 80, 55, 70, 45, 90, 60, 75];
  return (
    <div className="p-6 flex items-end gap-2 h-32">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-primary/40 rounded-t"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

/** Fake review rows for the Community Reviews coming-soon background */
function FauxReviews() {
  return (
    <div className="p-4 space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-dark-border shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-dark-border rounded w-1/3" />
            <div className="h-2 bg-dark-border rounded w-full" />
            <div className="h-2 bg-dark-border rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Main content area of the detail page.
 * Renders the listing description with markdown and shows coming-soon sections below.
 */
export default function DetailDescription({ listing }: DetailDescriptionProps) {
  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-dark-border mb-6 flex gap-0 overflow-x-auto">
        <button className="px-4 py-3 border-b-2 border-primary text-white font-medium shrink-0 whitespace-nowrap">
          Overview
        </button>
        {['Performance', 'Integrations', 'Reviews', 'Technical Specs'].map(tab => (
          <button
            key={tab}
            className="px-4 py-3 text-gray-500 cursor-not-allowed shrink-0 whitespace-nowrap"
            title="Coming Soon"
            disabled
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Markdown description card */}
      <div className="glass-card rounded-xl border border-dark-border p-6 sm:p-8">
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {listing.description || '_No description provided._'}
          </ReactMarkdown>
        </div>
      </div>

      {/* Performance Metrics — Coming Soon */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        <ComingSoonOverlay title="Charts and usage metrics will appear here">
          <FauxChartBars />
        </ComingSoonOverlay>
      </div>

      {/* Community Reviews — Coming Soon */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Community Reviews</h2>
        <ComingSoonOverlay title="Be the first to review this agent">
          <FauxReviews />
        </ComingSoonOverlay>
      </div>
    </div>
  );
}
