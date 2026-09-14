import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, Zap, Layers, Copy, Check, ExternalLink, Activity, Clock, Sparkles } from 'lucide-react';

export const MainnetRadar: React.FC = () => {
  // Target: September 16, 2026, 12:00:00 UTC
  const targetDate = new Date('2026-09-16T12:00:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });
  const [copiedRpc, setCopiedRpc] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: Math.floor(diff / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRpc(true);
    setTimeout(() => setCopiedRpc(false), 2000);
  };

  const readinessPercent = 94.6;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Countdown Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0B1528] via-[#080E1D] to-[#040711] p-8 md:p-12 shadow-[0_0_50px_rgba(0,229,255,0.12)]">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Pulsing Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-300">
              Mainnet Genesis Radar • T-Minus
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Arc Mainnet Launch{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              September 16, 2026
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">
            The dawn of high-throughput sub-second settlement for institutional and decentralized commerce.
            Circle USDC native liquidity engine powering the next financial paradigm.
          </p>

          {/* Countdown Clock Grid */}
          <div className="grid grid-cols-4 gap-3 md:gap-6 w-full max-w-2xl pt-2">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINUTES', val: timeLeft.minutes },
              { label: 'SECONDS', val: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 md:p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-inner relative overflow-hidden group hover:border-cyan-500/40 transition-all"
              >
                <div className="text-2xl md:text-5xl font-black font-mono text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {String(item.val).padStart(2, '0')}
                </div>
                <div className="text-[10px] md:text-xs font-mono font-semibold tracking-wider text-slate-400 mt-1">
                  {item.label}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Readiness Progress Bar */}
          <div className="w-full max-w-2xl space-y-2 pt-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Network Genesis Readiness
              </span>
              <span className="text-cyan-300 font-bold">{readinessPercent}% Ready</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800/80 border border-white/5 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-1000 shadow-[0_0_12px_rgba(0,229,255,0.6)]"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Ecosystem Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Zap,
            title: 'Sub-Second Finality',
            desc: 'Deterministic block execution with sub-400ms consensus finality designed for real-time payments.',
            status: 'Audited & Ready',
            color: 'text-amber-400',
            border: 'border-amber-500/20 hover:border-amber-500/40',
          },
          {
            icon: ShieldCheck,
            title: 'Circle CCTP v3',
            desc: 'Native Cross-Chain Transfer Protocol v3 connecting Arc directly with Ethereum, Solana, and Base.',
            status: 'Active on Testnet',
            color: 'text-cyan-400',
            border: 'border-cyan-500/20 hover:border-cyan-500/40',
          },
          {
            icon: Layers,
            title: 'Native Gas Abstraction',
            desc: 'Pay gas in native USDC. Zero need for secondary gas volatility or wrapping friction.',
            status: 'Core Standard',
            color: 'text-sky-400',
            border: 'border-sky-500/20 hover:border-sky-500/40',
          },
          {
            icon: Radio,
            title: 'Institutional Gateway',
            desc: 'Direct compliance-friendly settlement rails verified by major global market makers.',
            status: 'Live at Genesis',
            color: 'text-emerald-400',
            border: 'border-emerald-500/20 hover:border-emerald-500/40',
          },
        ].map((item, i) => {
          const IconComponent = item.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl border ${item.border} bg-[#0A101D]/70 backdrop-blur-md transition-all duration-300 flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit">
                    <IconComponent className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Genesis Release</span>
                <span className="text-cyan-400 font-semibold">v1.0</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network RPC & Developer Info Card */}
      <div className="rounded-2xl border border-white/10 bg-[#090E1B] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Arc Genesis Network Config
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure your EVM wallet or validator nodes for genesis deployment.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard('https://mainnet.arc.network/rpc')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-colors w-fit"
          >
            {copiedRpc ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedRpc ? 'Copied to Clipboard' : 'Copy Genesis RPC'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Network Name', value: 'Arc Mainnet' },
            { label: 'Chain ID', value: '7923' },
            { label: 'Gas Token', value: 'USDC (Native)' },
            { label: 'Genesis Block Target', value: 'Sept 16, 2026' },
          ].map((cfg, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[11px] font-mono text-slate-500 uppercase">{cfg.label}</div>
              <div className="text-sm font-mono font-bold text-white mt-1">{cfg.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};