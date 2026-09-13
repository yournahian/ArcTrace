'use client';

import React, { useState } from 'react';
import { NavigationDock, TabType } from '@/components/NavigationDock';
import { ProofOfWork } from '@/components/ProofOfWork';
import { ArcGems } from '@/components/ArcGems';
import { TopArcPosts } from '@/components/TopArcPosts';
import { ArcLogo } from '@/components/ArcLogo';
import { FollowGate } from '@/components/FollowGate';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('proof');

  return (
    <div className="app-viewport">
      {/* Access Gate Requiring Visitor to Follow @yournahian on X */}
      <FollowGate />

      {/* Top Header */}
      <header className="app-header">
        <div className="brand-link">
          <div className="brand-badge">
            <ArcLogo size={24} color="#2563EB" />
            <span className="brand-name">ArcTrace</span>
            <span className="brand-pill">Network</span>
          </div>
        </div>

        <div className="header-right">
          <a
            href="https://testnet.arcscan.app"
            target="_blank"
            rel="noopener noreferrer"
            className="arc-status-chip"
            title="Arc Public Testnet Explorer"
          >
            <span className="pulse-dot" />
            <span>Testnet 5042002</span>
          </a>
        </div>
      </header>

      {/* Floating Navigation Dock (Desktop Left / Mobile Bottom) */}
      <NavigationDock activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Interactive Stage */}
      <main className="main-stage">
        {activeTab === 'proof' && <ProofOfWork />}
        {activeTab === 'terminal' && <ArcGems />}
        {activeTab === 'best_posts' && <TopArcPosts />}
      </main>
    </div>
  );
}
