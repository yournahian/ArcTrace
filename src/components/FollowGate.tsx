'use client';

import React, { useState, useEffect } from 'react';
import { ArcLogo } from './ArcLogo';

export const FollowGate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'prompt' | 'detecting' | 'unlocked'>('prompt');

  useEffect(() => {
    // Check sessionStorage: if not verified in this session, show the gate
    const isUnlocked = sessionStorage.getItem('arctrace_follow_unlocked');
    if (!isUnlocked) {
      setIsOpen(true);
    }
  }, []);

  const handleFollowClick = () => {
    // Open X profile in new tab
    window.open('https://x.com/yournahian', '_blank', 'noopener,noreferrer');

    // Switch to detecting state
    setStep('detecting');

    // Processing period (3.5 seconds)
    setTimeout(() => {
      setStep('unlocked');
    }, 3500);
  };

  const handleEnter = () => {
    sessionStorage.setItem('arctrace_follow_unlocked', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        backgroundColor: 'rgba(6, 9, 19, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Follow on X to continue"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(10, 18, 36, 0.95)',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 229, 255, 0.15)',
          textAlign: 'center',
          color: '#ffffff',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Banner with Arc branding */}
        <div
          style={{
            height: '90px',
            background: 'linear-gradient(135deg, #0A1224 0%, #1E3A8A 50%, #00E5FF 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ background: 'rgba(6, 9, 19, 0.7)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArcLogo size={18} />
            <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--arc-cyan)', letterSpacing: '0.05em' }}>
              ARCTRACE ACCESS GATE
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '0 24px 28px 24px', position: 'relative' }}>
          {/* Overlapping Avatar */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #0A1224',
              background: '#1E293B',
              margin: '-34px auto 14px auto',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://pbs.twimg.com/profile_images/1966521996080209920/MbtcGvTv_400x400.jpg"
              alt="yournahian avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {step === 'prompt' && (
            <>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#ffffff',
                  lineHeight: '1.3',
                }}
              >
                Follow @yournahian on X
              </h2>
              <p style={{ color: 'var(--arc-sky-sync)', fontSize: '13px', marginTop: '6px', lineHeight: '1.45' }}>
                Follow the builder behind ArcTrace on X to unlock access to Arc engagement analytics.
              </p>

              <button
                type="button"
                onClick={handleFollowClick}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 255, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Follow @yournahian to Continue</span>
              </button>
            </>
          )}

          {step === 'detecting' && (
            <div style={{ padding: '16px 0' }}>
              <div className="loading-dots" style={{ height: '40px' }}>
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--arc-cyan)',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginTop: '12px',
                }}
              >
                Detecting whether you followed...
              </p>
              <p style={{ fontSize: '12px', color: 'var(--arc-text-dim)', marginTop: '4px' }}>
                Checking connection to @yournahian on X
              </p>
            </div>
          )}

          {step === 'unlocked' && (
            <div style={{ padding: '12px 0 6px 0' }}>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ffffff',
                  lineHeight: '1.4',
                  marginBottom: '16px',
                }}
              >
                I don&apos;t know if you followed, but there you go.
              </p>

              <button
                type="button"
                onClick={handleEnter}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '13px 20px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 255, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                }}
              >
                Continue to ArcTrace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
