import React from 'react';
import { Palette, Shuffle } from 'lucide-react';
import clsx from 'clsx';
import { getCategories, STYLES } from '../../services/quotesService';

export default function StyleControls({
  state,
  onChange,
  language = 'id'
}) {
  const categories = getCategories(language);

  const handleRandomStyle = () => {
    const remainingStyles = STYLES.filter(s => s.id !== state.styleId);
    const random = remainingStyles[Math.floor(Math.random() * remainingStyles.length)];
    if (random) {
      onChange({ styleId: random.id });
    }
  };

  return (
    <div className="cyber-panel p-4 rounded-xl border border-cyber-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/50 pb-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-cyber-cyan uppercase">
            Category & Visual Style
          </h2>
        </div>
        <button
          onClick={handleRandomStyle}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-cyber-surface hover:bg-cyber-card border border-cyber-cyan/30 hover:border-cyber-cyan text-cyber-cyan rounded text-xs font-mono transition-all"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>RANDOM STYLE</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-mono text-gray-400 mb-2">
          QUOTE CATEGORY
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => {
            const isSelected = state.category === cat || (cat === 'ALL' && !state.category);
            return (
              <button
                key={cat}
                onClick={() => onChange({ category: cat === 'ALL' ? '' : cat })}
                className={clsx(
                  'px-2.5 py-1 rounded text-xs font-mono transition-all border',
                  isSelected
                    ? 'bg-cyber-cyan text-black font-bold border-cyber-cyan shadow-neon-cyan/40 shadow-sm'
                    : 'bg-cyber-surface text-gray-400 border-cyber-border hover:border-cyber-cyan/50 hover:text-white'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Style Cards */}
      <div>
        <label className="block text-xs font-mono text-gray-400 mb-2">
          OVERLAY THEME PRESET
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {STYLES.map(style => {
            const isSelected = state.styleId === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onChange({ styleId: style.id })}
                className={clsx(
                  'text-left p-2.5 rounded-lg border transition-all relative overflow-hidden',
                  isSelected
                    ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-neon-cyan/20 shadow-md'
                    : 'border-cyber-border bg-cyber-surface/60 hover:border-cyber-border hover:bg-cyber-surface'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={clsx(
                    'text-xs font-bold font-mono tracking-wide',
                    isSelected ? 'text-cyber-cyan' : 'text-gray-200'
                  )}>
                    {style.name}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  {style.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
