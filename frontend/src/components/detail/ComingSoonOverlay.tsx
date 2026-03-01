import type { ReactNode } from 'react';

interface ComingSoonOverlayProps {
  title?: string;
  children?: ReactNode;
}

/**
 * Reusable overlay for sections that are not yet available.
 * Blurs optional background content and shows a lock icon + "Coming Soon" message.
 */
export default function ComingSoonOverlay({ title, children }: ComingSoonOverlayProps) {
  return (
    <div className="relative rounded-xl border border-dark-border overflow-hidden min-h-[120px]">
      {/* Background: blurred placeholder content */}
      {children && (
        <div className="blur-sm opacity-30 pointer-events-none">
          {children}
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-surface/80 backdrop-blur-sm">
        <span className="material-symbols-outlined text-3xl text-gray-500 mb-2">lock</span>
        <span className="text-gray-400 font-medium">Coming Soon</span>
        {title && (
          <span className="text-sm text-gray-500 mt-1">{title}</span>
        )}
      </div>
    </div>
  );
}
