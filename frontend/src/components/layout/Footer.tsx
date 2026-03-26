import { Link } from 'react-router-dom';
import { APP_NAME } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl">deployed_code</span>
            <Link to="/" className="text-lg font-bold">{APP_NAME}</Link>
            <span className="text-xs text-theme-text-muted block mt-1">Autonomous Agent-First Directory</span>
          </div>
          <p className="text-theme-text-secondary text-sm leading-relaxed">
            The open directory for AI agents, tools, and infrastructure. Built for agents and the humans behind them.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://github.com/nblogist/AgentRadar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">code</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-theme-text-muted">
              <li><Link to="/browse" className="hover:text-primary transition-colors">Directory</Link></li>
              <li><Link to="/browse?sort=newest" className="hover:text-primary transition-colors">New Listings</Link></li>
              <li><Link to="/check-status" className="hover:text-primary transition-colors">Submission Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Developer</h4>
            <ul className="space-y-2 text-sm text-theme-text-muted">
              <li><Link to="/api-docs" className="hover:text-primary transition-colors">API Docs</Link></li>
              <li><Link to="/submit" className="hover:text-primary transition-colors">Submit a Listing</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-primary/10">
        <p className="text-xs text-theme-text-muted">&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
