'use client';

import React, { useEffect, useState } from 'react';

interface GemContributor {
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bio: string;
  followers: number;
  following: number;
  joined: string;
  arc_score: string;
  verified: boolean;
}

function formatStatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export const ArcGems: React.FC = () => {
  const [gems, setGems] = useState<GemContributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gems')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.projects) {
          setGems(data.projects);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatJoined = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `Joined ${d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    } catch {
      return '';
    }
  };

  const renderCard = (gem: GemContributor) => (
    <div
      key={gem.handle}
      style={{
        background: 'rgba(11, 19, 38, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(172, 198, 233, 0.16)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
        marginBottom: '14px',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Banner */}
      <div
        style={{
          height: '52px',
          background: gem.banner
            ? `url(${gem.banner}) center/cover no-repeat`
            : 'linear-gradient(135deg, #1B3158, #2563EB)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      />

      <div style={{ padding: '0 18px 18px 18px', position: 'relative' }}>
        {/* Avatar & Follow action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-26px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '3px solid #0A1124',
              overflow: 'hidden',
              background: '#1E293B',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gem.avatar}
              alt={gem.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <a
            href={`https://x.com/${gem.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#ffffff',
              color: '#0A1124',
              textDecoration: 'none',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '700',
              transition: 'all 0.15s ease',
            }}
          >
            Follow
          </a>
        </div>

        {/* Name & Handle */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>{gem.name}</span>
            {gem.verified && (
              <svg viewBox="0 0 24 24" fill="#1D9BF0" width="16" height="16">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
            <span
              style={{
                marginLeft: 'auto',
                background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
                color: 'var(--arc-cyan)',
                fontSize: '11px',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              Arc Rank {gem.arc_score}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--arc-text-muted)' }}>@{gem.handle}</p>
        </div>

        {/* Bio */}
        <p style={{ fontSize: '13px', color: 'var(--arc-static-ether)', marginTop: '8px', lineHeight: '1.45' }}>
          {gem.bio}
        </p>

        {/* Following & Followers Stats (Following on LEFT, Followers on RIGHT) */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--arc-text-muted)' }}>
          <span>
            <strong style={{ color: '#ffffff' }}>{formatStatNumber(gem.following)}</strong> Following
          </span>
          <span>
            <strong style={{ color: '#ffffff' }}>{formatStatNumber(gem.followers)}</strong> Followers
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--arc-text-dim)' }}>
            {formatJoined(gem.joined)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '480px',
        height: 'calc(100dvh - 170px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '26px', fontWeight: '700' }}>
          💎 Arc Gems
        </h2>
        <p style={{ color: 'var(--arc-sky-sync)', fontSize: '13px', marginTop: '4px' }}>
          Top ecosystem voices, protocol researchers, and stablecoin builders on Arc.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div className="loading-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      ) : (
        <div
          className="scrollbar-hide"
          style={{
            overflowY: 'auto',
            flex: 1,
            paddingRight: '2px',
          }}
        >
          {gems.map((gem) => renderCard(gem))}
        </div>
      )}
    </div>
  );
};
