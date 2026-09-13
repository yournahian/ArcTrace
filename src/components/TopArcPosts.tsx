'use client';

import React, { useState } from 'react';
import { ArcLogo } from './ArcLogo';

interface ArcPost {
  id: string;
  screen_name: string;
  created_at: string;
  views: number;
  likes: number;
  reposts: number;
  replies: number;
  quotes?: number;
  text: string;
  author_name: string;
  author_avatar: string;
  author_verified?: boolean;
  url: string;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export const TopArcPosts: React.FC = () => {
  const [handle, setHandle] = useState('yournahian');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<ArcPost[]>([]);
  const [searchedUser, setSearchedUser] = useState('');

  const fetchTopPosts = async (targetHandle: string) => {
    const clean = targetHandle.trim().replace(/^@/, '');
    if (!clean) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/impressions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: clean }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Failed to fetch posts');
        return;
      }

      const allPosts: ArcPost[] = data.posts || [];
      // Sort posts by highest views / impressions first
      const sorted = allPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
      setPosts(sorted);
      setSearchedUser(data.profile?.screen_name || clean);
    } catch (err) {
      console.error(err);
      setError('Unable to load Arc posts');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTopPosts('yournahian');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTopPosts(handle);
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontSize: '28px', fontWeight: '700' }}>
          🌟 Best Posts About Arc
        </h2>
        <p style={{ color: 'var(--arc-sky-sync)', fontSize: '14px', marginTop: '4px' }}>
          Discover the highest-impact tweets and community discussions for Arc Network.
        </p>
      </div>

      <form onSubmit={handleSearch} className="search-form" style={{ marginBottom: '24px' }}>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Enter an X username (e.g. yournahian)"
          className="pow-input"
        />
        {handle.trim() && (
          <button type="submit" className="submit-btn" aria-label="Search Top Posts">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </form>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px' }}>
          <div className="loading-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      )}

      {error && <p style={{ color: '#f87171', textAlign: 'center', fontSize: '14px' }}>{error}</p>}

      {!loading && posts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--arc-sky-sync)', fontWeight: '600' }}>
              Top {posts.length} Arc Posts for @{searchedUser}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--arc-text-dim)' }}>Ranked by Impressions</span>
          </div>

          {posts.slice(0, 8).map((post, idx) => (
            <div
              key={post.id || idx}
              style={{
                background: 'rgba(11, 19, 38, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: idx === 0 ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid rgba(172, 198, 233, 0.16)',
                padding: '20px',
                boxShadow: idx === 0 ? '0 12px 32px rgba(0, 229, 255, 0.1)' : '0 8px 24px rgba(0,0,0,0.3)',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {idx === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '18px',
                    background: 'rgba(0, 229, 255, 0.12)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    color: 'var(--arc-cyan)',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  🏆 #1 Best Post
                </div>
              )}

              {/* Author Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#1E293B',
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.author_avatar} alt={post.author_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <strong style={{ fontSize: '14px', color: '#ffffff' }}>{post.author_name}</strong>
                    {post.author_verified && (
                      <svg viewBox="0 0 24 24" fill="#1D9BF0" width="14" height="14">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--arc-text-muted)' }}>@{post.screen_name}</span>
                </div>
              </div>

              {/* Tweet Content */}
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--arc-static-ether)',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line',
                  marginBottom: '14px',
                }}
              >
                {post.text}
              </p>

              {/* Metrics & Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '12px',
                  fontSize: '12px',
                  color: 'var(--arc-text-muted)',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--arc-cyan)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    👁️ {post.views.toLocaleString()} views
                  </span>
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.replies} replies</span>
                  <span style={{ color: 'var(--arc-text-dim)' }}>{formatDate(post.created_at)}</span>
                </div>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--arc-cyan)',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Open on X</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="12" height="12">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
