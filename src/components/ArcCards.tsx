import React, { useState, useRef } from 'react';
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

// 100% Original Arc Network Archetypes with high-res character illustrations
export const ARC_ARCHETYPES: Record<string, CardArchetype> = {
  pioneer: {
    id: 'pioneer',
    title: 'Genesis Pioneer',
    lore: 'Bridged liquidity on Genesis Block #1 and never bridged back. Holds unshakable conviction in the Economic OS.',
    rarity: 'MYTHIC',
    glowColor: '#00E5FF',
    image: '/cards/pioneer.jpg',
    badgeEmoji: '🚀',
    iconBg: '#00E5FF',
  },
  architect: {
    id: 'architect',
    title: 'Economic Architect',
    lore: 'Deploys composable financial primitives directly to Arc testnet. Sub-second finality is their native language.',
    rarity: 'LEGENDARY',
    glowColor: '#F59E0B',
    image: '/cards/architect.jpg',
    badgeEmoji: '⚙️',
    iconBg: '#F59E0B',
  },
  usdc_titan: {
    id: 'usdc_titan',
    title: 'USDC Liquidity Titan',
    lore: 'Trades exclusively on native Circle USDC settlement rails. Zero synthetic wrapped tokens, pure capital efficiency.',
    rarity: 'LEGENDARY',
    glowColor: '#8B5CF6',
    image: '/cards/usdc_titan.png',
    badgeEmoji: '💎',
    iconBg: '#8B5CF6',
  },
  finalizer: {
    id: 'finalizer',
    title: 'Sub-Second Finalizer',
    lore: 'Settles state transitions in under 400ms. Executes opinions before other L1s can even calculate gas fees.',
    rarity: 'LEGENDARY',
    glowColor: '#EF4444',
    image: '/cards/finalizer.png',
    badgeEmoji: '⚡',
    iconBg: '#EF4444',
  },
  navigator: {
    id: 'navigator',
    title: 'CCTP Navigator',
    lore: 'Teleports multi-chain liquidity across Ethereum, Solana, and Arc with zero slippage via native CCTP conduits.',
    rarity: 'EPIC',
    glowColor: '#EC4899',
    image: '/cards/navigator.png',
    badgeEmoji: '🌐',
    iconBg: '#EC4899',
  },
  sentinel: {
    id: 'sentinel',
    title: 'Deterministic Sentinel',
    lore: 'Protects the timeline with verifiable metrics and TPS charts. Believes in fast, sub-second deterministic settlement.',
    rarity: 'RARE',
    glowColor: '#10B981',
    image: '/cards/no_tech.jpg',
    badgeEmoji: '🛡️',
    iconBg: '#10B981',
  },
};

export const ArcCards: React.FC = () => {
  // Free input field by default: empty string
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('pioneer');
  // Starts with card back showing (unrevealed pack) so user experiences the opening animation!
  const [isFlipped, setIsFlipped] = useState(false);
  const [openingStage, setOpeningStage] = useState<'idle' | 'charging' | 'spinning' | 'revealed'>('idle');
  const [showFlash, setShowFlash] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 3D tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  // Opening / Reveal Animation Trigger
  const triggerOpeningSequence = (targetArchetypeId?: string) => {
    if (targetArchetypeId) setSelectedArchetypeId(targetArchetypeId);
    setIsFlipped(false);
    setOpeningStage('charging');

    // Stage 1: Card charges up and vibrates with glowing aura (550ms)
    setTimeout(() => {
      setOpeningStage('spinning');

      // Stage 2: In the middle of 3D rotation, switch face to front and trigger flash
      setTimeout(() => {
        setIsFlipped(true);
        setShowFlash(true);
      }, 450);

      // Stage 3: Snap into place face-up with bounce
      setTimeout(() => {
        setOpeningStage('revealed');
        setTimeout(() => setShowFlash(false), 700);
      }, 900);
    }, 550);
  };

  const fetchUserCard = async (targetHandle: string) => {
    const clean = targetHandle.replace('@', '').trim();
    if (!clean) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/impressions?handle=${encodeURIComponent(clean)}`);
      const json = await res.json();
      let assignedArchetype = 'navigator';

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

        // Auto-assign archetype based on real stats
        const imps = json.total_impressions || 0;
        if (clean.toLowerCase() === 'yournahian') {
          assignedArchetype = 'pioneer';
        } else if (imps > 100000) {
          assignedArchetype = 'usdc_titan';
        } else if (imps > 50000) {
          assignedArchetype = 'architect';
        } else if (imps > 20000) {
          assignedArchetype = 'finalizer';
        } else {
          assignedArchetype = 'navigator';
        }
      } else {
        setUserData({
          user: { handle: clean, name: clean, profile_image_url: '' },
          totalImpressions: 0,
          totalPosts: 0,
          tweets: [],
        });
      }

      // Trigger the opening animation sequence with the assigned archetype!
      triggerOpeningSequence(assignedArchetype);
    } catch (e) {
      console.error(e);
      triggerOpeningSequence('pioneer');
    } finally {
      setLoading(false);
    }
  };

  const archetype = ARC_ARCHETYPES[selectedArchetypeId] || ARC_ARCHETYPES.pioneer;

  const handleSelectArchetype = (archId: string) => {
    setSelectedArchetypeId(archId);
    if (openingStage !== 'revealed') {
      triggerOpeningSequence(archId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (openingStage === 'charging' || openingStage === 'spinning') return;
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

  const handleCardClick = () => {
    if (openingStage === 'charging' || openingStage === 'spinning') return;
    if (openingStage === 'idle' || !isFlipped) {
      triggerOpeningSequence();
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  const handleDownload = async () => {
    const handleToUse = userData?.user?.handle || (inputVal.trim() ? inputVal.trim() : 'creator');
    setDownloading(true);
    try {
      const blob = await exportArcCardPNG({
        handle: handleToUse,
        name: userData?.user?.name || handleToUse,
        avatar: userData?.user?.profile_image_url || '',
        cardImage: archetype.image,
        archetypeId: archetype.id,
        archetypeTitle: archetype.title,
        archetypeLore: archetype.lore,
        rarity: archetype.rarity,
        impressions: userData?.totalImpressions || 0,
        wave: 'WAVE 1 • MAINNET',
        glowColor: archetype.glowColor,
      });
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${handleToUse}-arc-card.png`;
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
    const handleToUse = userData?.user?.handle || (inputVal.trim() ? inputVal.trim() : 'creator');
    const text = encodeURIComponent(
      `I forged my official @arc Collectible Card: ${archetype.badgeEmoji} ${archetype.title} (${archetype.rarity})!\n\n⚡ Total Arc Impressions: ${(userData?.totalImpressions || 0).toLocaleString()}\n🌊 Wave 1 Genesis\n\nForge your Arc Card on @ArcTrace:`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const displayHandle = userData?.user?.handle || (inputVal.trim() ? inputVal.trim() : 'yournahian');

  const getAnimationClass = () => {
    if (openingStage === 'charging') return 'card-is-charging';
    if (openingStage === 'spinning') return 'card-is-spinning';
    if (openingStage === 'revealed') return 'card-just-revealed';
    return '';
  };

  return (
    <div className="monad-style-stage animate-fade-in">
      {/* Top Search Bar (100% Free, no default name) */}
      <div className="monad-search-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputVal.trim()) fetchUserCard(inputVal.trim());
          }}
          className="monad-search-form"
        >
          <div className="monad-input-pill">
            <span className="monad-input-prefix">@</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter your X username to forge card"
              className="monad-input-field"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="monad-btn-generate"
          >
            {loading ? 'Forging...' : '⚡ Forge & Reveal Card'}
          </button>
        </form>

        {/* Archetype Selector Chips (Original Arc Archetypes) */}
        <div className="monad-chips-row">
          <span className="chips-label">Card Archetypes:</span>
          {Object.values(ARC_ARCHETYPES).map((arch) => (
            <button
              key={arch.id}
              type="button"
              onClick={() => handleSelectArchetype(arch.id)}
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
          {/* Ambient Spotlight Beams (Arc Mystery Stage) */}
          <div className={`card-spotlight-backdrop ${openingStage === 'charging' ? 'charging' : ''}`}>
            <div className="card-beam" />
            <div className="card-beam" />
            <div className="card-beam" />
            <div className="card-beam" />
            <div className="card-beam" />
            <div className="card-beam" />
          </div>

          {/* Flash burst overlay on reveal */}
          {showFlash && <div className="card-flash-burst" />}

          {/* Card Canvas with 3D Perspective */}
          <div
            className="monad-perspective-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={cardRef}
              onClick={handleCardClick}
              className={`monad-card-3d ${getAnimationClass()}`}
              style={{
                transform: openingStage === 'spinning' || openingStage === 'charging'
                  ? undefined
                  : `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 0 : 180)}deg)`,
                boxShadow: isFlipped
                  ? `0 0 55px ${archetype.glowColor}66, 0 0 110px ${archetype.glowColor}33`
                  : '0 0 50px rgba(0, 229, 255, 0.5), 0 0 100px rgba(99, 102, 241, 0.3)',
              }}
            >
              {/* CARD FRONT (Original Arc Aesthetics) */}
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
                    @{displayHandle}
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

                {/* Trait Box (Original Arc Archetype) */}
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
                  border: '2px solid rgba(0, 229, 255, 0.7)',
                  boxShadow: '0 0 50px rgba(0, 229, 255, 0.5)',
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
                  <span>{openingStage === 'charging' ? 'CHARGING ENERGY...' : 'CLICK TO REVEAL CARD'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons on Right */}
          <div className="monad-floating-actions">
            {/* Replay Opening Animation Button */}
            <button
              type="button"
              onClick={() => triggerOpeningSequence()}
              title="Replay Opening Animation"
              className="monad-action-circle"
              style={{ color: '#00E5FF', borderColor: 'rgba(0, 229, 255, 0.4)' }}
            >
              <Sparkles style={{ width: '18px', height: '18px' }} />
            </button>

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

        {/* Big Arc Cards Title & Footer Banner (Positioned beside card on desktop) */}
        <div className="monad-banner-footer">
          {openingStage !== 'revealed' && (
            <div className="unrevealed-badge">
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>GENESIS ARC PACK • UNREVEALED</span>
            </div>
          )}

          <h1 className="monad-huge-title">ARC CARDS</h1>
          <div className="monad-wave-divider">
            <span className="divider-line" />
            <span className="divider-text">WAVE 1 — GENESIS</span>
            <span className="divider-line" />
          </div>
          <p className="monad-quote-text">
            &ldquo;Forged on sub-second finality for the Arc Community&rdquo;
          </p>
          <div className="monad-signed-in">
            Forged for <span className="signed-handle">@{displayHandle || 'yournahian'}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {openingStage !== 'revealed' ? (
              <button
                type="button"
                onClick={() => triggerOpeningSequence()}
                className="monad-claim-button"
                style={{
                  boxShadow: '0 0 35px rgba(0, 229, 255, 0.7)',
                  background: 'linear-gradient(135deg, #00E5FF, #2563EB)',
                  color: '#040814',
                  fontWeight: 900,
                }}
              >
                ⚡ Open & Reveal Card ⚡
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleShareX}
                  className="monad-claim-button"
                  style={{
                    boxShadow: `0 0 35px ${archetype.glowColor}88`,
                    background: `linear-gradient(135deg, ${archetype.glowColor}, #2563EB)`,
                  }}
                >
                  Claim & Share to X
                </button>

                <button
                  type="button"
                  onClick={() => triggerOpeningSequence()}
                  className="replay-reveal-btn"
                >
                  <Sparkles style={{ width: '15px', height: '15px', color: '#00E5FF' }} />
                  <span>Replay Animation</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
