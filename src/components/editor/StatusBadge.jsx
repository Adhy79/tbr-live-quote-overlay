import React from 'react';
import clsx from 'clsx';
import { Wifi, WifiOff, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function StatusBadge({ status, label, className = '' }) {
  let colorClass = 'border-cyber-border text-gray-400 bg-cyber-card';
  let icon = <WifiOff className="w-3.5 h-3.5" />;
  let displayText = status;

  switch (status) {
    case 'SUBSCRIBED':
    case 'CONNECTED':
      colorClass = 'border-cyber-green/50 text-cyber-green bg-cyber-green/10 shadow-[0_0_10px_rgba(0,255,136,0.2)]';
      icon = <CheckCircle2 className="w-3.5 h-3.5" />;
      displayText = 'CONNECTED';
      break;
    case 'CONNECTING':
      colorClass = 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10 animate-pulse';
      icon = <RefreshCw className="w-3.5 h-3.5 animate-spin" />;
      displayText = 'CONNECTING';
      break;
    case 'NOT_CONFIGURED':
      colorClass = 'border-cyber-red/60 text-cyber-red bg-cyber-red/10 animate-pulse';
      icon = <AlertTriangle className="w-3.5 h-3.5" />;
      displayText = 'REALTIME NOT CONFIGURED';
      break;
    case 'CHANNEL_ERROR':
    case 'ERROR':
    case 'TIMED_OUT':
      colorClass = 'border-cyber-red text-cyber-red bg-cyber-red/10';
      icon = <AlertTriangle className="w-3.5 h-3.5" />;
      displayText = 'CHANNEL ERROR';
      break;
    case 'CLOSED':
    case 'DISCONNECTED':
      colorClass = 'border-yellow-500/40 text-yellow-500 bg-yellow-500/10';
      icon = <WifiOff className="w-3.5 h-3.5" />;
      displayText = 'DISCONNECTED';
      break;
    default:
      displayText = status || 'OFFLINE';
  }

  return (
    <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono tracking-wider font-semibold', colorClass, className)}>
      {icon}
      {label && <span className="opacity-70">{label}:</span>}
      <span>{displayText}</span>
    </div>
  );
}
