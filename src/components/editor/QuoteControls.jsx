import React, { useState } from 'react';
import { Sparkles, MessageSquareQuote, RotateCcw, Globe } from 'lucide-react';
import clsx from 'clsx';
import { getRandomQuote, getDefaultOverlayState } from '../../services/quotesService';

export default function QuoteControls({
  state,
  onChange,
  onReset,
  language: propLanguage,
  onLanguageChange
}) {
  // Support both controlled and uncontrolled usage; default to 'id' (INDONESIA)
  const [internalLanguage, setInternalLanguage] = useState('id');
  const language = propLanguage !== undefined ? propLanguage : internalLanguage;

  const handleLanguageSelect = (lang) => {
    setInternalLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const handleGenerateQuote = () => {
    // Pass current quote to prevent consecutive duplicate
    const random = getRandomQuote(state.category, language, state.quote);
    onChange({
      quote: random.quote,
      category: random.category,
      subHeader: random.subHeader,
      footerText: random.footerText
    });
  };

  const handleNewOverlay = () => {
    const defaults = getDefaultOverlayState(state.channelId);
    const random = getRandomQuote('ALL', language, state.quote);
    onChange({
      ...defaults,
      quote: random.quote,
      category: random.category,
      subHeader: random.subHeader,
      footerText: random.footerText
    });
  };

  return (
    <div className="cyber-panel p-4 rounded-xl border border-cyber-border space-y-4">
      {/* Header & Main Actions */}
      <div className="flex items-center justify-between border-b border-cyber-border/50 pb-2">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-cyber-cyan uppercase">
            Quote Control
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateQuote}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/50 hover:border-cyber-cyan text-cyber-cyan rounded-lg text-xs font-mono font-bold transition-all shadow-neon-cyan/20 shadow-sm"
            title="Fetch a random quote according to selected language & category"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GENERATE QUOTE</span>
          </button>
          <button
            onClick={handleNewOverlay}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyber-surface hover:bg-cyber-card border border-cyber-border hover:border-gray-500 text-gray-300 hover:text-white rounded-lg text-xs font-mono transition-all"
            title="Reset overlay to clean state with a fresh quote"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>NEW OVERLAY</span>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1.5 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>QUOTE LANGUAGE</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLanguageSelect('id')}
            className={clsx(
              'py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wide border transition-all flex items-center justify-center gap-1.5',
              language === 'id'
                ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-neon-cyan/40 shadow-sm'
                : 'bg-cyber-surface text-gray-400 border-cyber-border hover:border-cyber-cyan/40 hover:text-white'
            )}
          >
            <span>🇮🇩</span>
            <span>INDONESIA</span>
          </button>

          <button
            type="button"
            onClick={() => handleLanguageSelect('en')}
            className={clsx(
              'py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wide border transition-all flex items-center justify-center gap-1.5',
              language === 'en'
                ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-neon-cyan/40 shadow-sm'
                : 'bg-cyber-surface text-gray-400 border-cyber-border hover:border-cyber-cyan/40 hover:text-white'
            )}
          >
            <span>🇬🇧</span>
            <span>ENGLISH</span>
          </button>

          <button
            type="button"
            onClick={() => handleLanguageSelect('random')}
            className={clsx(
              'py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wide border transition-all flex items-center justify-center gap-1.5',
              language === 'random'
                ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-neon-cyan/40 shadow-sm'
                : 'bg-cyber-surface text-gray-400 border-cyber-border hover:border-cyber-cyan/40 hover:text-white'
            )}
          >
            <span>🔀</span>
            <span>RANDOM</span>
          </button>
        </div>
      </div>

      {/* Quote Text Input */}
      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1 flex justify-between">
          <span>BROADCAST QUOTE TEXT</span>
          <span className="text-[10px] text-cyber-cyan font-mono">{state.quote.length} CHARS</span>
        </label>
        <textarea
          rows={3}
          value={state.quote}
          onChange={(e) => onChange({ quote: e.target.value })}
          placeholder="Enter the broadcast quote here..."
          className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyber-cyan font-sans transition-all resize-none shadow-inner leading-relaxed"
        />
      </div>

      {/* Header & SubHeader Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">
            HEADER TEXT
          </label>
          <input
            type="text"
            value={state.headerText}
            onChange={(e) => onChange({ headerText: e.target.value })}
            placeholder="THE BONTOT RADIO"
            className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-xs text-white placeholder-gray-600 font-mono focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">
            SUB-HEADER TEXT
          </label>
          <input
            type="text"
            value={state.subHeader}
            onChange={(e) => onChange({ subHeader: e.target.value })}
            placeholder="LIVE BROADCAST // 104.8 FM"
            className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-xs text-white placeholder-gray-600 font-mono focus:outline-none"
          />
        </div>
      </div>

      {/* Footer Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">
            PRIMARY FOOTER
          </label>
          <input
            type="text"
            value={state.footerText}
            onChange={(e) => onChange({ footerText: e.target.value })}
            placeholder="TRANSMITTING TO THE VOID"
            className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-xs text-white placeholder-gray-600 font-mono focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">
            SECONDARY FOOTER / TELEMETRY
          </label>
          <input
            type="text"
            value={state.secondaryFooter}
            onChange={(e) => onChange({ secondaryFooter: e.target.value })}
            placeholder="LIVE BROADCAST // 1080x1920"
            className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-xs text-white placeholder-gray-600 font-mono focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
