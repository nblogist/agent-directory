import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../lib/adminStore';
import { APP_NAME } from '../../lib/constants';

export function AdminLayout() {
  const clearToken = useAdminStore((s) => s.clearToken);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  function handleNavClick() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark-bg">
      {/* Mobile header bar — hidden on md+ */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-dark-surface border-b border-dark-border shrink-0">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-lg font-bold text-white">{APP_NAME}</span>
        <span className="text-xs text-gray-500 font-medium">Admin</span>
      </div>

      {/* Backdrop — shown on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-dark-surface border-r border-dark-border flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:transform-none md:shrink-0
        `}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-dark-border flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">{APP_NAME}</span>
            <span className="ml-2 text-xs text-gray-500 font-medium">Admin</span>
          </div>
          {/* Close button — visible only on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/admin/dashboard"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/listings"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">list_alt</span>
            Listings
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
