import { Link } from 'react-router-dom';

/**
 * Styled 404 Not Found page.
 * Shown when a route doesn't match or when an agent slug returns 404 from the API.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-7xl text-gray-600 mb-4 block">
          error_outline
        </span>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="bg-primary hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(55,19,236,0.4)] active:scale-95 transition-all px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base leading-none">home</span>
            Back to Home
          </Link>
          <Link
            to="/browse"
            className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base leading-none">explore</span>
            Browse Agents
          </Link>
        </div>
      </div>
    </div>
  );
}
