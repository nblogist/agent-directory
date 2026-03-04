const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'developer-tools-infrastructure': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'wallets-payments':               { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'data-analytics':                 { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  'identity-reputation':            { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'communication-messaging':        { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'marketplaces-task-coordination': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'social-community':               { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'other':                          { bg: 'bg-slate-500/10', text: 'text-slate-400' },
};

export function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? { bg: 'bg-primary/10', text: 'text-primary' };
}
