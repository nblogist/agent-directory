import { Link } from 'react-router-dom';
import { APP_NAME } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white hover:text-primary transition-colors mb-3">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">deployed_code</span>
              {APP_NAME}
            </Link>
            <p className="text-sm text-gray-400">The AI-first agent application directory.</p>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/browse" className="hover:text-white transition-colors">Directory</Link></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-not-allowed opacity-60" title="Coming Soon">Rankings</a></li>
              <li><Link to="/browse?sort=newest" className="hover:text-white transition-colors">New Agents</Link></li>
            </ul>
          </div>

          {/* Column 3: Developer */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Developer</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors cursor-not-allowed opacity-60" title="Coming Soon">API Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors cursor-not-allowed opacity-60" title="Coming Soon">Submit Agent</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" aria-label="Network status: online" />
            Powered by CKB Network
          </div>
        </div>
      </div>
    </footer>
  );
}
