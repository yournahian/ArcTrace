import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Sparkles, RefreshCw, Star, Copy, Check } from 'lucide-react';
import { exportArcCardPNG } from './ArcCardCanvasExporter';
import { ArcLogo } from './ArcLogo';

export interface CardArchetype {
  id: string;
  title: string;
  lore: string;
  rarity: 'MYTHIC' | 'LEGENDARY' | 'EPIC' | 'RARE';
  glowColor: string;
  image: string;
  badgeEmoji: string;
  iconBg: string;
}

const ARCHETYPES: Record<string, CardArchetype> = {
  hater: {
    id: 'hater',
    title: 'Diamond-Tier Hater',
    lore: 'Primarily defined by being antagonistic or contrarian, especially towards competitors (fair).',
    rarity: 'LEGENDARY',
    glowColor: '#EF4444',
    image: '/cards/hater.png',
    badgeEmoji: '👊',
    iconBg: '#EF4444',
  },
  true_og: {
    id: 'true_og',
    title: 'True OG',
    lore: 'Respected UNC in the space. Revered for experience or influence. Why are you still here?',
    rarity: 'LEGENDARY',
    glowColor: '#A855F7',
    image: '/cards/true_og.png',
    badgeEmoji: '👑',
    iconBg: '#8B5CF6',
  },
  no_tech: {
    id: 'no_tech',
    title: 'No Technical Ability',
    lore: 'Protector of the timeline. Fights and fuels slop full-time. Screentime go brrrr',
    rarity: 'RARE',
    glowColor: '#EC4899',
    image: '/cards/kate.png',
    badgeEmoji: '⚔️',
    iconBg: '#EC4899',
  },
  pioneer: {
    id: 'pioneer',
    title: 'Mainnet Pioneer',
    lore: 'Bridged liquidity on Block #1 and never bridged back. Holds genesis conviction through all market weather.',
    rarity: 'MYTHIC',
    glowColor: '#00E5FF',
    image: '/cards/pioneer.jpg',
    badgeEmoji: '🚀',
    iconBg: '#00E5FF',
  },
  architect: {
    id: 'architect',
    title: 'Arc Architect',
    lore: 'Deploys directly to production at 3:00 AM with zero test suite. Sub-second finality is their native language.',
    rarity: 'LEGENDARY',
    glowColor: '#F59E0B',
    image: '/cards/architect.jpg',
    badgeEmoji: '⚙️',
    iconBg: '#F59E0B',
  },
  bitgirl: {
    id: 'bitgirl',
    title: 'Culture Maxi',
    lore: 'Commands 40,000 followers purely through memes and relentless energy. Up only.',
    rarity: 'EPIC',
    glowColor: '#10B981',
    image: '/cards/no_tech.jpg',
    badgeEmoji: '🎯',
    iconBg: '#10B981',
  },
};

export const ArcCards: React.FC = () => {
  const [handle, setHandle] = useState('yournahian');
  const [inputVal, setInputVal] = useState('yournahian');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('pioneer');
  const [isFlipped, setIsFlipped] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 3D tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  const fetchUserCard = async (targetHandle: string) => {
    setLoading(true);
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

        // Auto-detect archetype based on metrics
        const imps = json.total_impressions || 0;
        if (clean.toLowerCase() === 'yournahian') {
          setSelectedArchetypeId('pioneer');
        } else if (imps > 100000) {
          setSelectedArchetypeId('true_og');
        } else if (imps > 50000) {
          setSelectedArchetypeId('architect');
        } else {
          setSelectedArchetypeId('hater');
        }
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

  const archetype = ARCHETYPES[selectedArchetypeId] || ARCHETYPES.pioneer;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleDownload = async () => {
    if (!userData) return;
    setDownloading(true);
    try {
      const blob = await exportArcCardPNG({
        handle: userData.user.handle,
        name: userData.user.name,
        avatar: userData.user.profile_image_url || '',
        cardImage: archetype.image,
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
      `I unlocked my official @arc Collectible Card: ${archetype.title} (${archetype.rarity})!\n\n⚡ Total Arc Impressions: ${(userData.totalImpressions || 0).toLocaleString()}\n🌊 Wave 1 Genesis\n\nReveal your Arc Card on @ArcTrace:`
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
    <div className="monad-style-stage animate-fade-in">
      {/* Top Search Bar */}
      <div className="monad-search-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputVal.trim()) setHandle(inputVal.trim());
          }}
          className="monad-search-form"
        >
          <div className="monad-input-pill">
            <span className="monad-input-prefix">@</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="enter_twitter_handle"
              className="monad-input-field"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="monad-btn-generate"
          >
            {loading ? 'Generating...' : 'Generate Card'}
          </button>
        </form>

        {/* Archetype Selector Chips */}
        <div className="monad-chips-row">
          <span className="chips-label">Preview Archetypes:</span>
          {Object.values(ARCHETYPES).map((arch) => (
            <button
              key={arch.id}
              type="button"
              onClick={() => setSelectedArchetypeId(arch.id)}
              className={`monad-chip-btn ${selectedArchetypeId === arch.id ? 'active' : ''}`}
              style={{
                borderColor: selectedArchetypeId === arch.id ? arch.glowColor : 'rgba(255,255,255,0.12)',
                color: selectedArchetypeId === arch.id ? arch.glowColor : '#94A3B8',
                background: selectedArchetypeId === arch.id ? `${arch.glowColor}18` : 'rgba(255,255,255,0.03)',
              }}
            >
              <span>{arch.badgeEmoji}</span>
              <span>{arch.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Card Stage */}
      <div className="monad-stage-center">
        {/* Card and Action Side Buttons Wrapper */}
        <div className="monad-card-and-actions">
          {/* Card Canvas with 3D Perspective */}
          <div
            className="monad-perspective-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={cardRef}
              onClick={() => setIsFlipped(!isFlipped)}
              className="monad-card-3d"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 0 : 180)}deg)`,
                boxShadow: `0 0 50px ${archetype.glowColor}66, 0 0 100px ${archetype.glowColor}33`,
              }}
            >
              {/* CARD FRONT (Monad Style High-Fidelity) */}
              <div
                className="monad-card-face monad-card-front"
                style={{
                  border: `2px solid ${archetype.glowColor}`,
                }}
              >
                {/* Holographic dynamic sheen */}
                <div
                  className="monad-holographic-sheen"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
                  }}
                />

                {/* Top Nameplate Box */}
                <div className="monad-card-nameplate">
                  <span className="monad-nameplate-text">
                    @{userData?.user?.handle || 'creator'}
                  </span>
                  <div
                    className="monad-nameplate-star"
                    style={{ color: archetype.glowColor }}
                  >
                    ✦
                  </div>
                </div>

                {/* Character Artwork Frame */}
                <div className="monad-art-frame">
                  <img
                    src={archetype.image}
                    alt={archetype.title}
                    className="monad-art-image"
                  />
                </div>

                {/* Trait Box (Monad Cards Anatomy) */}
                <div className="monad-trait-card">
                  <div
                    className="monad-trait-icon-box"
                    style={{ background: archetype.iconBg }}
                  >
                    <span className="monad-trait-icon">{archetype.badgeEmoji}</span>
                  </div>
                  <div className="monad-trait-content">
                    <div className="monad-trait-title">
                      {archetype.title}
                    </div>
                    <p className="monad-trait-lore">
                      {archetype.lore}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer: Brand & Wave Stamp */}
                <div className="monad-card-footer">
                  <span className="monad-footer-brand">Arc Cards</span>
                  <div className="monad-wave-badge">
                    <span>WAVE 1</span>
                  </div>
                </div>
              </div>

              {/* CARD BACK (Unrevealed Official Holographic Back) */}
              <div
                className="monad-card-face monad-card-back"
                style={{
                  border: '2px solid rgba(0, 229, 255, 0.6)',
                  boxShadow: '0 0 50px rgba(0, 229, 255, 0.4)',
                }}
              >
                <div className="monad-back-header">
                  <span>ARC CARDS</span>
                  <span>SERIES 1</span>
                </div>

                <div className="monad-back-center-logo">
                  <div className="monad-back-emblem">
                    <ArcLogo size={64} color="#00E5FF" />
                  </div>
                  <div className="monad-back-title">ARC NETWORK</div>
                  <div className="monad-back-subtitle">GENESIS WAVE 1</div>
                </div>

                <div className="monad-back-cta">
                  <Sparkles style={{ width: '16px', height: '16px', color: '#00E5FF' }} />
                  <span>CLICK TO FLIP CARD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons on Right (Monad Cards exact layout) */}
          <div className="monad-floating-actions">
            <button
              type="button"
              onClick={handleShareX}
              title="Share to X"
              className="monad-action-circle"
            >
              <Share2 style={{ width: '18px', height: '18px' }} />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Link"
              className="monad-action-circle"
            >
              {copiedLink ? <Check style={{ width: '18px', height: '18px', color: '#10B981' }} /> : <Copy style={{ width: '18px', height: '18px' }} />}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              title="Download Card PNG"
              className="monad-action-circle"
            >
              <Download style={{ width: '18px', height: '18px' }} />
            </button>

            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              title="Flip Card"
              className="monad-action-circle"
            >
              <RefreshCw style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        {/* Big Monad Cards Title & Footer Banner (From Screenshot) */}
        <div className="monad-banner-footer">
          <h1 className="monad-huge-title">ARC CARDS</h1>
          <div className="monad-wave-divider">
            <span className="divider-line" />
            <span className="divider-text">WAVE 1 — MUTUALS</span>
            <span className="divider-line" />
          </div>
          <p className="monad-quote-text">
            &ldquo;A token of appreciation for Crypto Twitter&rdquo;
          </p>
          <div className="monad-signed-in">
            Signed in as <span className="signed-handle">@{userData?.user?.handle || handle}</span>
          </div>

          <button
            type="button"
            onClick={handleShareX}
            className="monad-claim-button"
            style={{
              boxShadow: `0 0 35px ${archetype.glowColor}88`,
              background: `linear-gradient(135deg, ${archetype.glowColor}, #6366F1)`,
            }}
          >
            Claim & Share to X
          </button>
        </div>
      </div>
    </div>
  );
};
