import { NextResponse } from 'next/server';

export async function GET() {
  const gems = [
    {
      name: 'Jeremy Allaire',
      handle: 'jerallaire',
      avatar: 'https://unavatar.io/x/jerallaire',
      banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
      bio: 'Co-Founder & CEO @circle. Open internet platforms, crypto, stablecoins, human and civil rights. $USDC, Arc, CPN.',
      followers: 188600,
      following: 1605,
      joined: '2014-05-01',
      arc_score: '99.8%',
      verified: true,
    },
    {
      name: 'yournahian.base.eth',
      handle: 'yournahian',
      avatar: 'https://pbs.twimg.com/profile_images/1966521996080209920/MbtcGvTv_400x400.jpg',
      banner: 'https://pbs.twimg.com/profile_banners/1860739181322063872/1751111404',
      bio: '🛠️ Building @Ababilpay on @arc | Be Brave Be @base | Writing to earn attention | Building, learning, connecting',
      followers: 2348,
      following: 1587,
      joined: '2024-11-24',
      arc_score: '98.5%',
      verified: true,
    },
    {
      name: 'Circle Developers',
      handle: 'CircleDevs',
      avatar: 'https://unavatar.io/x/CircleDevs',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      bio: 'Developer platform & SDKs for Circle Web3 Services, Programmable Wallets, and Arc Network.',
      followers: 48900,
      following: 210,
      joined: '2021-02-14',
      arc_score: '99.1%',
      verified: true,
    },
    {
      name: 'Arc Network',
      handle: 'arc',
      avatar: 'https://unavatar.io/x/arc',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      bio: 'Purpose-built Layer-1 blockchain for stablecoin-native financial applications with USDC as gas.',
      followers: 124500,
      following: 88,
      joined: '2023-11-01',
      arc_score: '100%',
      verified: true,
    },
    {
      name: 'DeFi Researcher Arc',
      handle: 'arcalpha',
      avatar: 'https://unavatar.io/x/VitalikButerin',
      banner: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80',
      bio: 'Analyzing sub-second finality, Reth execution layers, and Malachite consensus on Arc.',
      followers: 24300,
      following: 615,
      joined: '2022-09-18',
      arc_score: '94.8%',
      verified: false,
    }
  ];

  return NextResponse.json({
    ok: true,
    projects: gems,
  });
}
