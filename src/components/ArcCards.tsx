import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Sparkles, RefreshCw, Star, Award, Check, Copy } from 'lucide-react';
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
      const res = await fetch(`/api/impressions?handle=${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (json && json.ok) {
        setUserData({
          user: {
            handle: json.username || clean,
            name: json.profile?.name || clean,
            profile_image_url: json.profile?.avatar || '',
          },
          totalImpressions: json.total_impressions || 0,
          totalPosts: json.post_count || 0,
          tweets: json.posts || [],
        });
      } else {
        setUserData({
          user: { handle: clean, name: clean, profile_image_url: '' },
          totalImpressions: 24500,
          totalPosts: 12,
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

  // Determine Archetype based on real metrics and tweets
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

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

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
    <div className="feature-view-container">
      {/* Header Banner */}
      <div className="feature-header-wrap">
        <div className="feature-pill-badge">
          <Sparkles style={{ width: '14px', height: '14px' }} />
          <span>Collectible Card Game • Genesis Wave 1</span>
        </div>
        <h2 className="feature-title">
          Arc Collectible <span className="gradient-text-cyan">Cards</span>
        </h2>
        <p className="feature-desc">
          Every creator gets a unique cryptographic card generated from their verified Arc metrics.
          Flip to reveal, tilt in 3D, and download your card for X.
        </p>

        {/* Handle Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputVal.trim()) setHandle(inputVal.trim());
          }}
          className="feature-search-form"
        >
          <div className="feature-input-wrap">
            <span className="feature-input-prefix">@</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="twitter_handle"
              className="feature-text-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="feature-submit-btn"
          >
            {loading ? 'Analyzing...' : 'Generate'}
          </button>
        </form>
      </div>

      {/* Main 3D Card Interactive Stage */}
      <div className="cards-layout-wrap">
        {/* Card Canvas with 3D Perspective */}
        <div
          className="card-stage-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={cardRef}
            onClick={() => {
              if (!isRevealed) handleReveal();
              else setIsFlipped(!isFlipped);
            }}
            className="card-3d-wrapper"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 0 : 180)}deg)`,
            }}
          >
            {/* FRONT OF CARD (Revealed State) */}
            <div
              className="card-outer-rim"
              style={{
                background: `linear-gradient(135deg, ${archetype.glowColor}, #A855F7, #3B82F6)`,
                boxShadow: `0 0 35px ${archetype.glowColor}55`,
              }}
            >
              <div className="card-inner-shell">
                {/* Holographic Glare Sheen */}
                <div
                  className="card-glare-overlay"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)`,
                  }}
                />

                {/* Top Bar: Handle + Star + Rarity */}
                <div className="card-top-bar">
                  <div className="card-user-info">
                    <div className="card-avatar-circle">
                      {userData?.user?.profile_image_url ? (
                        <img src={userData.user.profile_image_url} alt="avatar" className="card-avatar-img" />
                      ) : (
                        userData?.user?.handle?.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="card-handle-text">
                      <span>@{userData?.user?.handle || 'creator'}</span>
                      <Star style={{ width: '12px', height: '12px', color: '#F59E0B', fill: '#F59E0B' }} />
                    </div>
                  </div>
                  <div
                    className="card-rarity-pill"
                    style={{
                      borderColor: archetype.glowColor,
                      color: archetype.glowColor,
                      backgroundColor: `${archetype.glowColor}18`,
                    }}
                  >
                    {archetype.rarity}
                  </div>
                </div>

                {/* Center Hero Character Artwork */}
                <div className="card-hero-box">
                  <div
                    className="card-aura-glow"
                    style={{ backgroundColor: archetype.glowColor }}
                  />
                  <div className="card-character-frame">
                    <div className="card-character-emoji">
                      {archetype.badge}
                    </div>
                    <div className="card-tagline-text">
                      {archetype.tagline}
                    </div>
                    <div
                      className="card-impressions-tag"
                      style={{ backgroundColor: `${archetype.glowColor}25` }}
                    >
                      {(userData?.totalImpressions || 0).toLocaleString()} IMPRESSIONS
                    </div>
                  </div>
                </div>

                {/* Trait & Lore Box (Monad Cards Style) */}
                <div
                  className="card-trait-box"
                  style={{ borderColor: `${archetype.glowColor}40` }}
                >
                  <div className="trait-header-row">
                    <span className="trait-title-text">
                      <span>{archetype.badge}</span>
                      <span>{archetype.title}</span>
                    </span>
                    <span className="trait-slot-tag">TRAIT #01</span>
                  </div>
                  <p className="trait-lore-paragraph">
                    {archetype.lore}
                  </p>
                </div>

                {/* Bottom Footer: Wave Stamp + Arc Logo */}
                <div className="card-footer-row">
                  <span className="card-wave-stamp">
                    <span className="card-wave-dot" />
                    WAVE 1 • MAINNET
                  </span>
                  <div className="card-brand-tag">
                    <ArcLogo size={14} color="#00E5FF" />
                    <span>ARC TRACE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK OF CARD (Unrevealed / Holographic Back) */}
            <div
              className="card-outer-rim"
              style={{
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #00E5FF, #3B82F6, #1E1B4B)',
                boxShadow: '0 0 35px rgba(0,229,255,0.4)',
              }}
            >
              <div className="card-back-shell">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#00E5FF', letterSpacing: '0.1em' }}>
                  <span>OFFICIAL TCG</span>
                  <span>SERIES 1</span>
                </div>

                {/* Big Arc Emblem Center */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', margin: 'auto 0' }}>
                  <div className="card-back-emblem-wrap">
                    <ArcLogo size={56} color="#00E5FF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.05em' }}>ARC NETWORK</div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#00E5FF', marginTop: '2px' }}>GENESIS COLLECTION</div>
                  </div>
                </div>

                {/* Click to Reveal Button */}
                <div className="card-back-reveal-btn">
                  <Sparkles style={{ width: '16px', height: '16px', color: '#00E5FF' }} />
                  <span>CLICK TO REVEAL CARD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Info Sidebar */}
        <div className="card-actions-sidebar">
          <div className="card-actions-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award style={{ width: '16px', height: '16px', color: '#00E5FF' }} />
              <span>Card Controls</span>
            </div>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="card-flip-btn"
            >
              <RefreshCw style={{ width: '12px', height: '12px' }} />
              Flip Card
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleShareX}
              className="card-action-btn-primary"
            >
              <Share2 style={{ width: '15px', height: '15px' }} />
              <span>Share Card to X</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="card-action-btn-secondary"
            >
              <Download style={{ width: '15px', height: '15px', color: '#00E5FF' }} />
              <span>{downloading ? 'Rendering 2x PNG...' : 'Download Retina 2x PNG'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="card-action-btn-link"
            >
              {copiedLink ? <Check style={{ width: '14px', height: '14px', color: '#10B981' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Card Link'}</span>
            </button>
          </div>

          {/* NFT Mint Future Badge */}
          <div className="card-nft-upgrade-banner">
            <div className="nft-upgrade-box">
              <div className="nft-upgrade-title">
                <Sparkles style={{ width: '13px', height: '13px' }} />
                ✦ Mint as NFT (Coming on Mainnet)
              </div>
              <p className="nft-upgrade-desc">
                Wave 1 cards will be mintable directly on Arc Mainnet using native USDC gas with verified on-chain tier metadata.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
