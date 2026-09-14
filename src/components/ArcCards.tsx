import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Sparkles, RefreshCw, Star, Zap, Flame, Shield, Award, Check, Copy } from 'lucide-react';
import { exportArcCardPNG } from './ArcCardCanvasExporter';
import { ArcLogo } from './ArcLogo';

interface CardArchetype {
  id: string;
  title: string;
  lore: string;
  rarity: 'MYTHIC' | 'LEGENDARY' | 'EPIC' | 'RARE';
  glowColor: string;
  accentBg: string;
  tagline: string;
  badge: string;
}

const ARCHETYPES: Record<string, CardArchetype> = {
  pioneer: {
    id: 'pioneer',
    title: 'Mainnet Pioneer',
    lore: 'Bridged liquidity on Block #1 and never bridged back. Holds genesis conviction through all market weather.',
    rarity: 'MYTHIC',
    glowColor: '#00E5FF',
    accentBg: 'rgba(0, 229, 255, 0.15)',
    tagline: 'GENESIS CLASS',
    badge: '🚀',
  },
  architect: {
    id: 'architect',
    title: 'Arc Architect',
    lore: 'Deploys directly to production at 3:00 AM with zero test suite. Sub-second finality is their native language.',
    rarity: 'LEGENDARY',
    glowColor: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.15)',
    tagline: 'SYSTEM BUILDER',
    badge: '⚙️',
  },
  hater: {
    id: 'hater',
    title: 'Diamond-Tier Hater',
    lore: 'Spends 14 hours a day quote-tweeting competing L1s from an anonymous anime profile with surgical precision.',
    rarity: 'LEGENDARY',
    glowColor: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.15)',
    tagline: 'FUD DESTROYER',
    badge: '⚡',
  },
  researcher: {
    id: 'researcher',
    title: 'Gigabrain Researcher',
    lore: 'Writes 47-tweet longform treatises dissecting rollup latency, deterministic execution, and state verification.',
    rarity: 'EPIC',
    glowColor: '#3B82F6',
    accentBg: 'rgba(59, 130, 246, 0.15)',
    tagline: 'ALPHA INTELLECT',
    badge: '🧠',
  },
  vibe: {
    id: 'vibe',
    title: 'No Technical Ability',
    lore: 'Does not know what an RPC URL is, yet commands 40,000 followers purely through memes and relentless energy.',
    rarity: 'RARE',
    glowColor: '#EC4899',
    accentBg: 'rgba(236, 72, 153, 0.15)',
    tagline: 'CULTURE MAXI',
    badge: '🎯',
  },
  speed: {
    id: 'speed',
    title: 'Speed Demon',
    lore: 'Finalizes opinions faster than 400ms consensus. Types at 180 words per minute across 12 Discord tabs.',
    rarity: 'EPIC',
    glowColor: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    tagline: 'CONSENSUS SPEED',
    badge: '⚡',
  },
};

export const ArcCards: React.FC = () => {
  const [handle, setHandle] = useState('yournahian');
  const [inputVal, setInputVal] = useState('yournahian');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 3D tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  const fetchUserCard = async (targetHandle: string) => {
    setLoading(true);
    setIsRevealed(false);
    setIsFlipped(false);
    try {
      const clean = targetHandle.replace('@', '').trim();
      const res = await fetch(`/api/impressions?handle=${encodeURIComponent(clean)}&project=arc`);
      const json = await res.json();
      if (json && json.user) {
        setUserData(json);
      } else {
        setUserData({
          user: { handle: clean, name: clean, profile_image_url: '' },
          totalImpressions: 0,
          totalPosts: 0,
          tweets: [],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCard(handle);
  }, [handle]);

  // Determine Archetype based on real metrics and tweet contents
  const getArchetype = (): CardArchetype => {
    if (!userData) return ARCHETYPES.pioneer;
    const imps = userData.totalImpressions || 0;
    const posts = userData.totalPosts || 0;
    const tweets = (userData.tweets || []).map((t: any) => t.text?.toLowerCase() || '').join(' ');

    if (imps > 100000 || tweets.includes('genesis') || tweets.includes('mainnet')) {
      return ARCHETYPES.pioneer;
    }
    if (tweets.includes('code') || tweets.includes('build') || tweets.includes('sdk') || tweets.includes('dev')) {
      return ARCHETYPES.architect;
    }
    if (tweets.includes('ratio') || tweets.includes('mid') || tweets.includes('cope') || tweets.includes('l1')) {
      return ARCHETYPES.hater;
    }
    if (tweets.includes('research') || tweets.includes('thread') || tweets.includes('liquidity') || posts > 20) {
      return ARCHETYPES.researcher;
    }
    if (posts > 10) {
      return ARCHETYPES.speed;
    }
    return ARCHETYPES.vibe;
  };

  const archetype = getArchetype();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setIsFlipped(true);
  };

  const handleDownload = async () => {
    if (!userData) return;
    setDownloading(true);
    try {
      const blob = await exportArcCardPNG({
        handle: userData.user.handle,
        name: userData.user.name,
        avatar: userData.user.profile_image_url || '',
        archetypeId: archetype.id,
        archetypeTitle: archetype.title,
        archetypeLore: archetype.lore,
        rarity: archetype.rarity,
        impressions: userData.totalImpressions || 0,
        wave: 'WAVE 1 • MAINNET',
        glowColor: archetype.glowColor,
      });
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userData.user.handle}-arc-card.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareX = () => {
    if (!userData) return;
    const text = encodeURIComponent(
      `I unlocked my official @arc Collectible Card: ${archetype.badge} ${archetype.title} (${archetype.rarity})!\n\n⚡ Total Arc Impressions: ${(userData.totalImpressions || 0).toLocaleString()}\n🌊 Wave 1 Genesis\n\nCheck your Arc Card on @ArcTrace:`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in flex flex-col items-center">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Collectible Card Game • Genesis Wave 1</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Arc Collectible <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">Cards</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Every creator gets a unique cryptographic card generated from their verified Arc metrics.
          Flip to reveal, tilt in 3D, and download your card for X.
        </p>

        {/* Handle Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputVal.trim()) setHandle(inputVal.trim());
          }}
          className="flex items-center gap-2 max-w-md mx-auto pt-2"
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">@</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="twitter_handle"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Generate'}
          </button>
        </form>
      </div>

      {/* Main 3D Card Interactive Stage */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full py-4">
        {/* Card Canvas with 3D Perspective */}
        <div
          className="relative perspective-1000"
          style={{ perspective: '1200px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={cardRef}
            onClick={() => {
              if (!isRevealed) handleReveal();
              else setIsFlipped(!isFlipped);
            }}
            className="cursor-pointer select-none transition-transform duration-200 ease-out relative"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 0 : 180)}deg)`,
              transformStyle: 'preserve-3d',
              width: '340px',
              height: '520px',
            }}
          >
            {/* FRONT OF CARD (Revealed State) */}
            <div
              className="absolute inset-0 rounded-[28px] p-1 shadow-2xl backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                background: `linear-gradient(135deg, ${archetype.glowColor}, #A855F7, #3B82F6)`,
                boxShadow: `0 0 35px ${archetype.glowColor}55`,
              }}
            >
              {/* Inner Dark Shell */}
              <div className="relative w-full h-full rounded-[25px] bg-[#0A0F1D] overflow-hidden flex flex-col justify-between p-5">
                {/* Holographic Glare Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
                  }}
                />

                {/* Top Bar: Handle + Star + Rarity */}
                <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400/40 bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-300">
                      {userData?.user?.profile_image_url ? (
                        <img src={userData.user.profile_image_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        userData?.user?.handle?.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                        <span>@{userData?.user?.handle || 'creator'}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                    </div>
                  </div>
                  <div
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold tracking-wider border"
                    style={{
                      borderColor: archetype.glowColor,
                      color: archetype.glowColor,
                      backgroundColor: `${archetype.glowColor}15`,
                    }}
                  >
                    {archetype.rarity}
                  </div>
                </div>

                {/* Center Hero Character Artwork */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-3">
                  {/* Glowing Aura Rings */}
                  <div
                    className="absolute w-44 h-44 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
                    style={{ backgroundColor: archetype.glowColor }}
                  />
                  <div className="w-36 h-36 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-3 backdrop-blur-md flex flex-col items-center justify-center shadow-xl relative overflow-hidden group">
                    <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-bounce">
                      {archetype.badge}
                    </div>
                    <div className="text-[11px] font-mono font-extrabold tracking-widest text-white uppercase mt-2">
                      {archetype.tagline}
                    </div>
                    <div
                      className="absolute bottom-1.5 px-2 py-0.5 rounded-md text-[9px] font-mono text-cyan-300 font-bold"
                      style={{ backgroundColor: `${archetype.glowColor}25` }}
                    >
                      {(userData?.totalImpressions || 0).toLocaleString()} IMPRESSIONS
                    </div>
                  </div>
                </div>

                {/* Trait & Lore Box (Monad Cards Style) */}
                <div
                  className="relative z-10 rounded-xl p-3 border space-y-1.5 backdrop-blur-md"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    borderColor: `${archetype.glowColor}40`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                      <span>{archetype.badge}</span>
                      <span>{archetype.title}</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">TRAIT #01</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {archetype.lore}
                  </p>
                </div>

                {/* Bottom Footer: Wave Stamp + Arc Logo */}
                <div className="relative z-10 flex items-center justify-between pt-2.5 mt-2 border-t border-white/10 text-[10px] font-mono">
                  <span className="text-slate-400 tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    WAVE 1 • MAINNET
                  </span>
                  <div className="flex items-center gap-1 text-cyan-300 font-bold">
                    <ArcLogo className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ARC TRACE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK OF CARD (Unrevealed / Holographic Back) */}
            <div
              className="absolute inset-0 rounded-[28px] p-1 shadow-2xl backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #00E5FF, #3B82F6, #1E1B4B)',
                boxShadow: '0 0 35px rgba(0,229,255,0.4)',
              }}
            >
              <div className="relative w-full h-full rounded-[25px] bg-[#060A16] overflow-hidden flex flex-col items-center justify-between p-6 text-center">
                {/* Back Geometric Rays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.15)_0%,_transparent_70%)]" />

                <div className="relative z-10 w-full flex justify-between items-center text-[10px] font-mono text-cyan-400 tracking-widest">
                  <span>OFFICIAL TCG</span>
                  <span>SERIES 1</span>
                </div>

                {/* Big Arc Emblem Center */}
                <div className="relative z-10 flex flex-col items-center space-y-4 my-auto">
                  <div className="relative p-6 rounded-full border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_30px_rgba(0,229,255,0.5)] animate-pulse">
                    <ArcLogo className="w-16 h-16 text-cyan-300" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-black tracking-wider text-white">ARC NETWORK</div>
                    <div className="text-xs font-mono text-cyan-300">GENESIS COLLECTION</div>
                  </div>
                </div>

                {/* Click to Reveal Button */}
                <div className="relative z-10 w-full">
                  <div className="px-4 py-2.5 rounded-xl border border-cyan-400/40 bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                    <span>CLICK TO REVEAL CARD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Info Sidebar */}
        <div className="w-full max-w-sm space-y-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-[#0A101D] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Card Controls
              </div>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Flip Card
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleShareX}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1DA1F2] hover:bg-[#1a94df] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Card to X (Twitter)</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{downloading ? 'Rendering 2x PNG...' : 'Download Retina 2x PNG'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-2 px-4 rounded-xl border border-white/5 bg-transparent hover:bg-white/5 text-slate-400 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Card Link'}</span>
              </button>
            </div>

            {/* NFT Mint Future Badge */}
            <div className="pt-3 border-t border-white/10">
              <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-1">
                <div className="text-[11px] font-mono font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  ✦ Mint as NFT (Coming on Mainnet)
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Wave 1 cards will be mintable directly on Arc Mainnet using native USDC gas with verified on-chain tier metadata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
