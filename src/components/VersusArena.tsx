import React, { useState } from 'react';
import { Swords, Crown, Share2, Sparkles, UserPlus } from 'lucide-react';
import { TierBadge } from './TierBadge';

const POPULAR_MATCHUPS = [
  { p1: 'yournahian', p2: 'jerallaire', label: 'yournahian vs jerallaire' },
  { p1: 'CircleDevs', p2: 'VitalikButerin', label: 'CircleDevs vs Vitalik' },
  { p1: 'bobbilee', p2: 'samconnerone', label: 'bobbilee vs samconnerone' },
  { p1: 'arc', p2: 'circle', label: 'arc vs circle' },
];

export const VersusArena: React.FC = () => {
  // Free, empty input fields by default
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [loading, setLoading] = useState(false);
  const [user1Data, setUser1Data] = useState<any>(null);
  const [user2Data, setUser2Data] = useState<any>(null);
  const [hasBattled, setHasBattled] = useState(false);

  const fetchVersusData = async (h1: string, h2: string) => {
    const clean1 = h1.replace('@', '').trim();
    const clean2 = h2.replace('@', '').trim();
    if (!clean1 || !clean2) return;

    setLoading(true);
    try {
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
              totalImpressions: 0,
              totalPosts: 0,
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
              totalImpressions: 0,
              totalPosts: 0,
            }
      );
      setHasBattled(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input1.trim() && input2.trim()) {
      fetchVersusData(input1, input2);
    }
  };

  const handleSelectPreset = (p1: string, p2: string) => {
    setInput1(p1);
    setInput2(p2);
    // Fill the inputs ONLY — do not auto-battle so the user can review and click Fight!
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
    if (!user1Data || !user2Data) return;
    const text = encodeURIComponent(
      `⚔️ ARC VERSUS SHOWDOWN ⚔️\n\n@${user1Data.user.handle} (${imps1.toLocaleString()} imps) VS @${user2Data.user.handle} (${imps2.toLocaleString()} imps)\n\n${
        winner === 1
          ? `👑 Winner: @${user1Data.user.handle}`
          : winner === 2
          ? `👑 Winner: @${user2Data.user.handle}`
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
          <span>Live Creator Showdown • Free Any 2 Handles</span>
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
              placeholder="Enter first handle"
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
              placeholder="Enter second handle"
              className="feature-text-input"
              style={{ borderColor: 'rgba(249,115,22,0.35)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input1.trim() || !input2.trim()}
            className="feature-submit-btn"
            style={{
              background: loading
                ? 'rgba(245, 158, 11, 0.4)'
                : !input1.trim() || !input2.trim()
                ? 'rgba(255, 255, 255, 0.08)'
                : 'linear-gradient(135deg, #F59E0B, #F97316)',
              cursor: loading || !input1.trim() || !input2.trim() ? 'not-allowed' : 'pointer',
              minWidth: '150px',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Swords style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                <span>Battling...</span>
              </span>
            ) : !input1.trim() || !input2.trim() ? (
              'Enter 2 Handles'
            ) : hasBattled ? (
              '⚔️ Rematch!'
            ) : (
              '⚔️ Fight!'
            )}
          </button>
        </form>

        {/* Quick Matchup Presets */}
        <div className="monad-chips-row" style={{ marginTop: '4px' }}>
          <span className="chips-label">Quick Battles:</span>
          {POPULAR_MATCHUPS.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(m.p1, m.p2)}
              className="monad-chip-btn"
            >
              @{m.label}
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
        <div className={`versus-card-shell ${hasBattled && winner === 1 ? 'winner-cyan' : ''}`}>
          {hasBattled && winner === 1 && (
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
                user1Data?.user?.handle
                  ? user1Data.user.handle.slice(0, 2).toUpperCase()
                  : input1.trim()
                  ? input1.replace('@', '').trim().slice(0, 2).toUpperCase()
                  : '?'
              )}
            </div>
            <div className="versus-profile-meta">
              <h3 className="versus-handle-heading">
                {user1Data?.user?.handle
                  ? `@${user1Data.user.handle}`
                  : input1.trim()
                  ? `@${input1.replace('@', '').trim()}`
                  : 'Challenger #1'}
              </h3>
              <p className="versus-name-sub">
                {loading
                  ? '⚡ Analyzing Arc metrics...'
                  : user1Data?.user?.name
                  ? user1Data.user.name
                  : hasBattled
                  ? 'Ready'
                  : input1.trim()
                  ? 'Ready for battle'
                  : 'Enter handle above'}
              </p>
              {hasBattled && !loading && (
                <div style={{ marginTop: '4px' }}>
                  <TierBadge impressions={imps1} />
                </div>
              )}
            </div>
          </div>

          {/* Metric Stats */}
          <div className="versus-metrics-grid">
            <div className="versus-metric-box">
              <div className="versus-metric-label">Total Impressions</div>
              <div className="versus-metric-value cyan">
                {loading ? '...' : hasBattled ? imps1.toLocaleString() : '—'}
              </div>
            </div>
            <div className="versus-metric-box">
              <div className="versus-metric-label">Arc Posts</div>
              <div className="versus-metric-value">
                {loading ? '...' : hasBattled ? posts1.toLocaleString() : '—'}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="versus-bar-wrap">
            <div className="versus-bar-labels">
              <span style={{ color: '#00E5FF' }}>Impression Share</span>
              <span style={{ color: '#00E5FF' }}>{hasBattled ? `${p1Percent}%` : '—'}</span>
            </div>
            <div className="versus-bar-track">
              <div className="versus-bar-fill" style={{ width: hasBattled ? `${p1Percent}%` : '50%', background: '#00E5FF' }} />
            </div>
          </div>
        </div>

        {/* Challenger 2 Card */}
        <div className={`versus-card-shell ${hasBattled && winner === 2 ? 'winner-orange' : ''}`}>
          {hasBattled && winner === 2 && (
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
                user2Data?.user?.handle
                  ? user2Data.user.handle.slice(0, 2).toUpperCase()
                  : input2.trim()
                  ? input2.replace('@', '').trim().slice(0, 2).toUpperCase()
                  : '?'
              )}
            </div>
            <div className="versus-profile-meta">
              <h3 className="versus-handle-heading">
                {user2Data?.user?.handle
                  ? `@${user2Data.user.handle}`
                  : input2.trim()
                  ? `@${input2.replace('@', '').trim()}`
                  : 'Challenger #2'}
              </h3>
              <p className="versus-name-sub">
                {loading
                  ? '⚡ Analyzing Arc metrics...'
                  : user2Data?.user?.name
                  ? user2Data.user.name
                  : hasBattled
                  ? 'Ready'
                  : input2.trim()
                  ? 'Ready for battle'
                  : 'Enter handle above'}
              </p>
              {hasBattled && !loading && (
                <div style={{ marginTop: '4px' }}>
                  <TierBadge impressions={imps2} />
                </div>
              )}
            </div>
          </div>

          {/* Metric Stats */}
          <div className="versus-metrics-grid">
            <div className="versus-metric-box">
              <div className="versus-metric-label">Total Impressions</div>
              <div className="versus-metric-value orange">
                {loading ? '...' : hasBattled ? imps2.toLocaleString() : '—'}
              </div>
            </div>
            <div className="versus-metric-box">
              <div className="versus-metric-label">Arc Posts</div>
              <div className="versus-metric-value">
                {loading ? '...' : hasBattled ? posts2.toLocaleString() : '—'}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="versus-bar-wrap">
            <div className="versus-bar-labels">
              <span style={{ color: '#F97316' }}>Impression Share</span>
              <span style={{ color: '#F97316' }}>{hasBattled ? `${p2Percent}%` : '—'}</span>
            </div>
            <div className="versus-bar-track">
              <div className="versus-bar-fill" style={{ width: hasBattled ? `${p2Percent}%` : '50%', background: '#F97316' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Share Showdown Footer */}
      {hasBattled && (
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
      )}
    </div>
  );
};
