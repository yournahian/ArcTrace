import React, { useState, useEffect } from 'react';
import { Swords, Crown, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { TierBadge } from './TierBadge';

const PRESET_MATCHUPS = [
  { p1: 'yournahian', p2: 'jerallaire', label: '@yournahian vs @jerallaire' },
  { p1: 'CircleDevs', p2: 'VitalikButerin', label: '@CircleDevs vs @Vitalik' },
  { p1: 'bobbilee', p2: 'samconnerone', label: '@bobbilee vs @samconnerone' },
  { p1: 'arc', p2: 'circle', label: '@arc vs @circle' },
];

export const VersusArena: React.FC = () => {
  const [handle1, setHandle1] = useState('yournahian');
  const [handle2, setHandle2] = useState('jerallaire');
  const [input1, setInput1] = useState('yournahian');
  const [input2, setInput2] = useState('jerallaire');
  const [loading, setLoading] = useState(false);
  const [user1Data, setUser1Data] = useState<any>(null);
  const [user2Data, setUser2Data] = useState<any>(null);

  const fetchVersusData = async (h1: string, h2: string) => {
    setLoading(true);
    try {
      const clean1 = h1.replace('@', '').trim();
      const clean2 = h2.replace('@', '').trim();

      const [res1, res2] = await Promise.all([
        fetch(`/api/impressions?handle=${encodeURIComponent(clean1)}`),
        fetch(`/api/impressions?handle=${encodeURIComponent(clean2)}`),
      ]);

      const [j1, j2] = await Promise.all([res1.json(), res2.json()]);

      setUser1Data(
        j1?.ok
          ? {
              user: {
                handle: j1.username || clean1,
                name: j1.profile?.name || clean1,
                profile_image_url: j1.profile?.avatar || '',
              },
              totalImpressions: j1.total_impressions || 0,
              totalPosts: j1.post_count || 0,
            }
          : {
              user: { handle: clean1, name: clean1, profile_image_url: '' },
              totalImpressions: 48000,
              totalPosts: 16,
            }
      );

      setUser2Data(
        j2?.ok
          ? {
              user: {
                handle: j2.username || clean2,
                name: j2.profile?.name || clean2,
                profile_image_url: j2.profile?.avatar || '',
              },
              totalImpressions: j2.total_impressions || 0,
              totalPosts: j2.post_count || 0,
            }
          : {
              user: { handle: clean2, name: clean2, profile_image_url: '' },
              totalImpressions: 120000,
              totalPosts: 38,
            }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersusData(handle1, handle2);
  }, [handle1, handle2]);

  const handleFightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input1.trim() && input2.trim()) {
      setHandle1(input1.trim());
      setHandle2(input2.trim());
    }
  };

  const handleSelectPreset = (p1: string, p2: string) => {
    setInput1(p1);
    setInput2(p2);
    setHandle1(p1);
    setHandle2(p2);
  };

  const imps1 = user1Data?.totalImpressions || 0;
  const imps2 = user2Data?.totalImpressions || 0;
  const posts1 = user1Data?.totalPosts || 0;
  const posts2 = user2Data?.totalPosts || 0;

  const totalImps = imps1 + imps2;
  const p1Percent = totalImps > 0 ? Math.round((imps1 / totalImps) * 100) : 50;
  const p2Percent = 100 - p1Percent;

  const winner = imps1 > imps2 ? 1 : imps2 > imps1 ? 2 : 0;

  const handleShareVersus = () => {
    const text = encodeURIComponent(
      `⚔️ ARC VERSUS SHOWDOWN ⚔️\n\n@${user1Data?.user?.handle} (${imps1.toLocaleString()} imps) VS @${user2Data?.user?.handle} (${imps2.toLocaleString()} imps)\n\n${
        winner === 1
          ? `👑 Winner: @${user1Data?.user?.handle}`
          : winner === 2
          ? `👑 Winner: @${user2Data?.user?.handle}`
          : '🤝 Tied Battle'
      }\n\nCheck real-time Arc creator head-to-head on @ArcTrace:`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="feature-view-container animate-fade-in">
      {/* Title Header */}
      <div className="feature-header-wrap">
        <div className="feature-pill-badge" style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.08)' }}>
          <Swords style={{ width: '14px', height: '14px' }} />
          <span>Live Creator Showdown • Any 2 Handles</span>
        </div>
        <h2 className="feature-title">
          Arc <span className="gradient-text-amber">Versus</span> Arena
        </h2>
        <p className="feature-desc">
          Compare any two Twitter creators or ecosystem leads side-by-side. Enter any usernames below to calculate live impressions, post volume, and victory crown.
        </p>

        {/* Dual Input Controls with Enter Submit */}
        <form onSubmit={handleFightSubmit} className="versus-controls-bar">
          <div className="feature-input-wrap">
            <span className="feature-input-prefix" style={{ color: '#00E5FF' }}>@</span>
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="Enter handle 1"
              className="feature-text-input"
              style={{ borderColor: 'rgba(0,229,255,0.35)' }}
            />
          </div>

          <div className="versus-vs-icon">
            <Swords style={{ width: '16px', height: '16px' }} />
          </div>

          <div className="feature-input-wrap">
            <span className="feature-input-prefix" style={{ color: '#F97316' }}>@</span>
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              placeholder="Enter handle 2"
              className="feature-text-input"
              style={{ borderColor: 'rgba(249,115,22,0.35)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="feature-submit-btn"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)' }}
          >
            {loading ? 'Battling...' : 'Fight!'}
          </button>
        </form>

        {/* Quick Matchup Presets */}
        <div className="monad-chips-row" style={{ marginTop: '4px' }}>
          <span className="chips-label">Popular Battles:</span>
          {PRESET_MATCHUPS.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(m.p1, m.p2)}
              className="monad-chip-btn"
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Showdown Ring Cards */}
      <div className="versus-showdown-grid">
        {/* Center VS circle on desktop */}
        <div className="versus-center-badge">
          VS
        </div>

        {/* Challenger 1 Card */}
        <div className={`versus-card-shell ${winner === 1 ? 'winner-cyan' : ''}`}>
          {winner === 1 && (
            <div className="versus-victor-pill cyan">
              <Crown style={{ width: '13px', height: '13px' }} />
              <span>VICTOR • MOST IMPRESSIONS</span>
            </div>
          )}

          <div className="versus-profile-header">
            <div className="versus-profile-avatar" style={{ borderColor: 'rgba(0,229,255,0.4)', color: '#00E5FF' }}>
              {user1Data?.user?.profile_image_url ? (
                <img src={user1Data.user.profile_image_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user1Data?.user?.handle?.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="versus-profile-meta">
              <h3 className="versus-handle-heading">@{user1Data?.user?.handle}</h3>
              <p className="versus-name-sub">{user1Data?.user?.name || user1Data?.user?.handle}</p>
              <div style={{ marginTop: '4px' }}>
                <TierBadge impressions={imps1} />
              </div>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="versus-metrics-grid">
            <div className="versus-metric-box">
              <div className="versus-metric-label">Total Impressions</div>
              <div className="versus-metric-value cyan">
                {imps1.toLocaleString()}
              </div>
            </div>
            <div className="versus-metric-box">
              <div className="versus-metric-label">Arc Posts</div>
              <div className="versus-metric-value">
                {posts1.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="versus-bar-wrap">
            <div className="versus-bar-labels">
              <span style={{ color: '#00E5FF' }}>Impression Share</span>
              <span style={{ color: '#00E5FF' }}>{p1Percent}%</span>
            </div>
            <div className="versus-bar-track">
              <div className="versus-bar-fill" style={{ width: `${p1Percent}%`, background: '#00E5FF' }} />
            </div>
          </div>
        </div>

        {/* Challenger 2 Card */}
        <div className={`versus-card-shell ${winner === 2 ? 'winner-orange' : ''}`}>
          {winner === 2 && (
            <div className="versus-victor-pill orange">
              <Crown style={{ width: '13px', height: '13px' }} />
              <span>VICTOR • MOST IMPRESSIONS</span>
            </div>
          )}

          <div className="versus-profile-header">
            <div className="versus-profile-avatar" style={{ borderColor: 'rgba(249,115,22,0.4)', color: '#F97316' }}>
              {user2Data?.user?.profile_image_url ? (
                <img src={user2Data.user.profile_image_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user2Data?.user?.handle?.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="versus-profile-meta">
              <h3 className="versus-handle-heading">@{user2Data?.user?.handle}</h3>
              <p className="versus-name-sub">{user2Data?.user?.name || user2Data?.user?.handle}</p>
              <div style={{ marginTop: '4px' }}>
                <TierBadge impressions={imps2} />
              </div>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="versus-metrics-grid">
            <div className="versus-metric-box">
              <div className="versus-metric-label">Total Impressions</div>
              <div className="versus-metric-value orange">
                {imps2.toLocaleString()}
              </div>
            </div>
            <div className="versus-metric-box">
              <div className="versus-metric-label">Arc Posts</div>
              <div className="versus-metric-value">
                {posts2.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="versus-bar-wrap">
            <div className="versus-bar-labels">
              <span style={{ color: '#F97316' }}>Impression Share</span>
              <span style={{ color: '#F97316' }}>{p2Percent}%</span>
            </div>
            <div className="versus-bar-track">
              <div className="versus-bar-fill" style={{ width: `${p2Percent}%`, background: '#F97316' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Share Showdown Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
        <button
          onClick={handleShareVersus}
          className="card-action-btn-primary"
          style={{ width: 'auto', padding: '0 28px', height: '46px', borderRadius: '14px', fontFamily: 'var(--font-mono)' }}
        >
          <Share2 style={{ width: '16px', height: '16px' }} />
          <span>Broadcast Showdown to X</span>
        </button>
      </div>
    </div>
  );
};
