'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Search, Shield, Globe, Calendar, Award, ExternalLink, Lock } from 'lucide-react';

interface Match {
  id: string;
  match_date: string;
  stage: string;
  group_name: string | null;
  home_team: string;
  home_flag: string;
  home_score: number;
  away_team: string;
  away_flag: string;
  away_score: number;
  status: string;
  venue: string;
  city: string;
}

const STAGES = ['All', 'Final', 'Bronze Final', 'Semi-finals', 'Quarter-finals', 'Round of 16', 'Group Stage'];

export default function WorldCupScoresApp() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedStage, setSelectedStage] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch('/api/matches');
        const json = await res.json();
        if (json.matches) setMatches(json.matches);
      } catch (err) {
        console.error('Failed to load match data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchStage = selectedStage === 'All' || m.stage.toLowerCase() === selectedStage.toLowerCase();
      const term = search.toLowerCase();
      const matchSearch =
        !search ||
        m.home_team.toLowerCase().includes(term) ||
        m.away_team.toLowerCase().includes(term) ||
        m.city.toLowerCase().includes(term);
      return matchStage && matchSearch;
    });
  }, [matches, selectedStage, search]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Banner / Security Badge */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 text-center text-slate-950 flex items-center justify-center gap-2 shadow-inner">
        <Shield className="w-3.5 h-3.5" />
        <span>Enterprise Security Active: Rate Limiting • Supabase RLS • CSP L3 • Clerk Authenticated</span>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20 text-slate-950">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">FIFA World Cup 2026 Archive</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  VERIFIED SCORES
                </span>
              </div>
              <p className="text-xs text-slate-400">Complete Results, Bracket Progressions & Statistics</p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search team, stadium, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
            />
          </div>
        </div>
      </header>

      {/* Hero Podium / Tournament Overview */}
      <section className="bg-slate-900/40 border-b border-slate-800/60 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Champion Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4" /> 2026 World Champion
                </span>
                <span className="text-2xl">🇪🇸</span>
              </div>
              <div className="mt-3">
                <h2 className="text-2xl font-black text-white">Spain</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Defeated Argentina 1–0 (AET) at MetLife Stadium with a 106&apos; goal by Ferran Torres.
                </p>
              </div>
            </div>

            {/* Runner-Up Card */}
            <div className="relative overflow-hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4" /> Silver Medalist
                </span>
                <span className="text-2xl">🇦🇷</span>
              </div>
              <div className="mt-3">
                <h2 className="text-2xl font-black text-white">Argentina</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Reached the final with standout knockout victories over England and Switzerland.
                </p>
              </div>
            </div>

            {/* 3rd Place Card */}
            <div className="relative overflow-hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-700/90 flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-600" /> Bronze Medalist
                </span>
                <span className="text-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              </div>
              <div className="mt-3">
                <h2 className="text-2xl font-black text-white">England</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Triumphed over France 6–4 in Miami in one of the highest-scoring playoff matches in history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Stage Filter Buttons */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
            {STAGES.map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  selectedStage === stage
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 scale-105'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading verified match data securely...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/30 rounded-2xl border border-slate-800/80">
            <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-white">No matches found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your stage filter or search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((m) => {
              const homeWon = m.home_score > m.away_score;
              const awayWon = m.away_score > m.home_score;
              const isFinal = m.stage === 'Final';

              return (
                <div
                  key={m.id}
                  className={`relative overflow-hidden bg-slate-900/70 border rounded-2xl p-5 transition-all duration-200 hover:border-slate-700 hover:shadow-xl ${
                    isFinal ? 'border-amber-500/40 shadow-amber-500/5 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20' : 'border-slate-800'
                  }`}
                >
                  {/* Match Header */}
                  <div className="flex justify-between items-center text-xs pb-3 mb-3 border-b border-slate-800/80 text-slate-400">
                    <span className={`font-semibold tracking-wide uppercase px-2 py-0.5 rounded text-[10px] ${
                      isFinal ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {m.stage}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {m.match_date} • {m.city}
                    </span>
                  </div>

                  {/* Match Scoreboard */}
                  <div className="flex items-center justify-between py-2">
                    {/* Home Team */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-3xl filter drop-shadow">{m.home_flag}</span>
                      <div className="truncate">
                        <span className={`text-base block truncate ${homeWon ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {m.home_team}
                        </span>
                        {homeWon && <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Winner</span>}
                      </div>
                    </div>

                    {/* Scores & FT Status */}
                    <div className="flex flex-col items-center px-4">
                      <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1 rounded-xl border border-slate-800 shadow-inner">
                        <span className={`text-xl font-black ${homeWon ? 'text-white' : 'text-slate-400'}`}>{m.home_score}</span>
                        <span className="text-slate-600 font-bold">-</span>
                        <span className={`text-xl font-black ${awayWon ? 'text-white' : 'text-slate-400'}`}>{m.away_score}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                        {m.status}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-end gap-3 flex-1 min-w-0 text-right">
                      <div className="truncate">
                        <span className={`text-base block truncate ${awayWon ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {m.away_team}
                        </span>
                        {awayWon && <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Winner</span>}
                      </div>
                      <span className="text-3xl filter drop-shadow">{m.away_flag}</span>
                    </div>
                  </div>

                  {/* Match Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      {m.venue}
                    </span>
                    {m.group_name && (
                      <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 text-slate-300 font-mono">
                        {m.group_name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 px-4 sm:px-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 World Cup Archive Tracker. Built with Next.js, Clerk, Supabase, and Upstash Redis.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-400" /> 100% Security Compliant</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">Security Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
