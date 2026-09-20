import React, { useState, useEffect } from 'react';
import { X, Key, Globe, ShieldAlert, CheckCircle2, Save, Trash2 } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig } from '../../config/supabase';

export default function SupabaseModal({
  isOpen,
  onClose,
  onConfigUpdated
}) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url || '');
      setKey(config.key || '');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setError('');

    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl || !cleanKey) {
      setError('Both Supabase URL and Publishable Anon Key are required.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setError('Supabase URL must start with https://');
      return;
    }

    saveSupabaseConfig(cleanUrl, cleanKey);
    setSuccess(true);

    if (onConfigUpdated) {
      onConfigUpdated();
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    saveSupabaseConfig('', '');
    setUrl('');
    setKey('');
    setSuccess(false);
    if (onConfigUpdated) {
      onConfigUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg cyber-panel p-6 rounded-2xl border border-cyber-cyan/40 shadow-neon-cyan/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-cyber-border hover:border-cyber-cyan text-gray-400 hover:text-white bg-cyber-surface transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-cyber-cyan" />
          <h2 className="text-base font-mono font-bold tracking-wider text-white uppercase">
            Supabase Realtime Configuration
          </h2>
        </div>

        <p className="text-xs text-gray-400 font-sans mb-4 leading-relaxed">
          Configure your Supabase project credentials to enable Realtime Broadcast across the editor and OBS overlays.
        </p>

        {/* Security Warning */}
        <div className="p-3 mb-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-2.5 text-xs text-yellow-300 font-sans">
          <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-yellow-200 mb-0.5">Use Public / Anon Key Only</strong>
            Never input your <code className="bg-yellow-500/20 px-1 rounded">service_role</code> secret key. Only use the client-safe public anon key from Supabase Dashboard &gt; Settings &gt; API.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>SUPABASE PROJECT URL</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded-lg p-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>SUPABASE ANON / PUBLISHABLE KEY</span>
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded-lg p-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-2 rounded bg-cyber-red/10 border border-cyber-red text-cyber-red text-xs font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2 rounded bg-cyber-green/10 border border-cyber-green text-cyber-green text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configuration saved! Reconnecting to Realtime...</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyber-border hover:border-cyber-red text-xs font-mono text-gray-400 hover:text-cyber-red bg-cyber-surface transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-cyber-border hover:border-gray-500 text-xs font-mono text-gray-300 transition-all"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-black font-bold text-xs font-mono shadow-neon-cyan/40 shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE & CONNECT</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
