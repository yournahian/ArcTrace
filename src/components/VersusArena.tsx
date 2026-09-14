import React, { useState, useEffect } from 'react';
import { Swords, Crown, TrendingUp, Award, Share2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { TierBadge, getContributorTier } from './TierBadge';
import { ArcLogo } from './ArcLogo';

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
        fetch(`/api/impressions?handle=${encodeURIComponent(clean1)}&project=arc`),
        fetch(`/api/impressions?handle=${encodeURIComponent(clean2)}&project=arc`),
      ]);

      const [j1, j2] = await Promise.all([res1.json(), res2.json()]);

      setUser1Data(
        j1?.user
          ? j1
          : {
              user: { handle: clean1, name: clean1, profile_image_url: '' },
              totalImpressions: 0,
              totalPosts: 0,
              tweets: [],
            }
      );

      setUser2Data(
        j2?.user
          ? j2
          : {
              user: { handle: clean2, name: clean2, profile_image_url: '' },
              totalImpressions: 0,
              totalPosts: 0,
              tweets: [],
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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Swords className="w-3.5 h-3.5" />
          <span>Head-to-Head Arena • Real-Time Metrics</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Arc <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">Versus</span> Arena
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Pit two Arc creators or ecosystem leads side-by-side. Compare verified impressions, post velocity, and contributor rank.
        </p>

        {/* Dual Input Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-2xl mx-auto">
          <div className="relative w-full sm:w-1/2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-sm font-bold">@</span>
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="challenger_1"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
          </div>

          <div className="p-2 rounded-full bg-white/5 border border-white/10 text-amber-400">
            <Swords className="w-4 h-4" />
          </div>

          <div className="relative w-full sm:w-1/2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 font-mono text-sm font-bold">@</span>
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              placeholder="challenger_2"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 text-sm font-mono"
            />
          </div>

          <button
            onClick={() => {
              if (input1.trim() && input2.trim()) {
                setHandle1(input1.trim());
                setHandle2(input2.trim());
              }
            }}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-500 hover:opacity-90 text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Battling...' : 'Fight!'}
          </button>
        </div>
      </div>

      {/* Showdown Ring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* VS Center Badge on Desktop */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#060913] border-2 border-amber-400/80 items-center justify-center font-black font-mono text-amber-400 text-sm shadow-[0_0_25px_rgba(245,158,11,0.6)]">
          VS
        </div>

        {/* Challenger 1 Card */}
        <div
          className={`relative rounded-3xl p-6 md:p-8 border transition-all duration-300 flex flex-col justify-between space-y-6 ${
            winner === 1
              ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/40 via-[#0A1224] to-[#040814] shadow-[0_0_40px_rgba(0,229,255,0.2)]'
              : 'border-white/10 bg-[#0A101E] opacity-90'
          }`}
        >
          {winner === 1 && (
            <div className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-cyan-400 text-black font-mono font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.6)]">
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span>VICTOR • MOST IMPRESSIONS</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-400/40 bg-slate-800 flex items-center justify-center text-lg font-bold text-cyan-300">
              {user1Data?.user?.profile_image_url ? (
                <img src={user1Data.user.profile_image_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user1Data?.user?.handle?.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-mono">@{user1Data?.user?.handle}</h3>
              <p className="text-xs text-slate-400">{user1Data?.user?.name || user1Data?.user?.handle}</p>
              <div className="mt-1.5">
                <TierBadge impressions={imps1} />
              </div>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] font-mono text-slate-400">Total Impressions</div>
              <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                {imps1.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] font-mono text-slate-400">Arc Posts</div>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {posts1.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold">Impression Share</span>
              <span className="text-cyan-300 font-bold">{p1Percent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all duration-700" style={{ width: `${p1Percent}%` }} />
            </div>
          </div>
        </div>

        {/* Challenger 2 Card */}
        <div
          className={`relative rounded-3xl p-6 md:p-8 border transition-all duration-300 flex flex-col justify-between space-y-6 ${
            winner === 2
              ? 'border-orange-400 bg-gradient-to-b from-orange-950/40 via-[#180E0A] to-[#0D0704] shadow-[0_0_40px_rgba(249,115,22,0.2)]'
              : 'border-white/10 bg-[#0A101E] opacity-90'
          }`}
        >
          {winner === 2 && (
            <div className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-orange-400 text-black font-mono font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.6)]">
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span>VICTOR • MOST IMPRESSIONS</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-400/40 bg-slate-800 flex items-center justify-center text-lg font-bold text-orange-300">
              {user2Data?.user?.profile_image_url ? (
                <img src={user2Data.user.profile_image_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user2Data?.user?.handle?.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-mono">@{user2Data?.user?.handle}</h3>
              <p className="text-xs text-slate-400">{user2Data?.user?.name || user2Data?.user?.handle}</p>
              <div className="mt-1.5">
                <TierBadge impressions={imps2} />
              </div>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] font-mono text-slate-400">Total Impressions</div>
              <div className="text-2xl font-black font-mono text-orange-300 mt-1">
                {imps2.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] font-mono text-slate-400">Arc Posts</div>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {posts2.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Dominance Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-orange-300 font-bold">Impression Share</span>
              <span className="text-orange-300 font-bold">{p2Percent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full transition-all duration-700" style={{ width: `${p2Percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Share Showdown Footer */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleShareVersus}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#1DA1F2] hover:bg-[#1a94df] text-white font-mono font-bold text-sm transition-all shadow-[0_0_20px_rgba(29,161,242,0.3)]"
        >
          <Share2 className="w-4 h-4" />
          <span>Broadcast Showdown to X</span>
        </button>
      </div>
    </div>
  );
};
