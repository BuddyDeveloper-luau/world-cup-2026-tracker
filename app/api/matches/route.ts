import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  stage: z.string().max(50).regex(/^[a-zA-Z0-9\s-]*$/).optional(),
  search: z.string().max(50).regex(/^[a-zA-Z0-9\s]*$/).optional(),
});

// Built-in fallback match database (guarantees website works instantly out-of-the-box)
const FALLBACK_MATCHES = [
  { id: '1', match_date: '2026-07-19', stage: 'Final', group_name: null, home_team: 'Spain', home_flag: '🇪🇸', home_score: 1, away_team: 'Argentina', away_flag: '🇦🇷', away_score: 0, status: 'FT (AET)', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { id: '2', match_date: '2026-07-18', stage: 'Bronze Final', group_name: null, home_team: 'England', home_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', home_score: 6, away_team: 'France', away_flag: '🇫🇷', away_score: 4, status: 'FT', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { id: '3', match_date: '2026-07-15', stage: 'Semi-finals', group_name: null, home_team: 'Argentina', home_flag: '🇦🇷', home_score: 2, away_team: 'England', away_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away_score: 1, status: 'FT', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { id: '4', match_date: '2026-07-14', stage: 'Semi-finals', group_name: null, home_team: 'Spain', home_flag: '🇪🇸', home_score: 2, away_team: 'France', away_flag: '🇫🇷', away_score: 0, status: 'FT', venue: 'AT&T Stadium', city: 'Arlington' },
  { id: '5', match_date: '2026-07-11', stage: 'Quarter-finals', group_name: null, home_team: 'Argentina', home_flag: '🇦🇷', home_score: 3, away_team: 'Switzerland', away_flag: '🇨🇭', away_score: 1, status: 'FT (AET)', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { id: '6', match_date: '2026-07-11', stage: 'Quarter-finals', group_name: null, home_team: 'England', home_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', home_score: 2, away_team: 'Norway', away_flag: '🇳🇴', away_score: 1, status: 'FT (AET)', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { id: '7', match_date: '2026-07-10', stage: 'Quarter-finals', group_name: null, home_team: 'Spain', home_flag: '🇪🇸', home_score: 2, away_team: 'Belgium', away_flag: '🇧🇪', away_score: 1, status: 'FT', venue: 'SoFi Stadium', city: 'Inglewood' },
  { id: '8', match_date: '2026-07-09', stage: 'Quarter-finals', group_name: null, home_team: 'France', home_flag: '🇫🇷', home_score: 2, away_team: 'Morocco', away_flag: '🇲🇦', away_score: 0, status: 'FT', venue: 'Gillette Stadium', city: 'Foxborough' },
  { id: '9', match_date: '2026-07-07', stage: 'Round of 16', group_name: null, home_team: 'Switzerland', home_flag: '🇨🇭', home_score: 0, away_team: 'Colombia', away_flag: '🇨🇴', away_score: 0, status: 'FT (P 4-3)', venue: 'BC Place', city: 'Vancouver' },
  { id: '10', match_date: '2026-07-07', stage: 'Round of 16', group_name: null, home_team: 'Argentina', home_flag: '🇦🇷', home_score: 3, away_team: 'Egypt', away_flag: '🇪🇬', away_score: 2, status: 'FT', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { id: '11', match_date: '2026-07-06', stage: 'Round of 16', group_name: null, home_team: 'Belgium', home_flag: '🇧🇪', home_score: 4, away_team: 'United States', away_flag: '🇺🇸', away_score: 1, status: 'FT', venue: 'Lumen Field', city: 'Seattle' },
  { id: '12', match_date: '2026-07-06', stage: 'Round of 16', group_name: null, home_team: 'Spain', home_flag: '🇪🇸', home_score: 1, away_team: 'Portugal', away_flag: '🇵🇹', away_score: 0, status: 'FT', venue: 'AT&T Stadium', city: 'Arlington' },
  { id: '13', match_date: '2026-07-05', stage: 'Round of 16', group_name: null, home_team: 'England', home_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', home_score: 3, away_team: 'Mexico', away_flag: '🇲🇽', away_score: 2, status: 'FT', venue: 'Estadio Azteca', city: 'Mexico City' },
  { id: '14', match_date: '2026-07-05', stage: 'Round of 16', group_name: null, home_team: 'Norway', home_flag: '🇳🇴', home_score: 2, away_team: 'Brazil', away_flag: '🇧🇷', away_score: 1, status: 'FT', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { id: '15', match_date: '2026-07-04', stage: 'Round of 16', group_name: null, home_team: 'Morocco', home_flag: '🇲🇦', home_score: 3, away_team: 'Canada', away_flag: '🇨🇦', away_score: 0, status: 'FT', venue: 'Reliant Stadium', city: 'Houston' },
  { id: '16', match_date: '2026-07-04', stage: 'Round of 16', group_name: null, home_team: 'France', home_flag: '🇫🇷', home_score: 1, away_team: 'Paraguay', away_flag: '🇵🇾', away_score: 0, status: 'FT', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { id: '17', match_date: '2026-06-27', stage: 'Group Stage', group_name: 'Group L', home_team: 'England', home_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', home_score: 2, away_team: 'Panama', away_flag: '🇵🇦', away_score: 0, status: 'FT', venue: 'MetLife Stadium', city: 'East Rutherford' },
  { id: '18', match_date: '2026-06-27', stage: 'Group Stage', group_name: 'Group J', home_team: 'Argentina', home_flag: '🇦🇷', home_score: 3, away_team: 'Jordan', away_flag: '🇯🇴', away_score: 1, status: 'FT', venue: 'AT&T Stadium', city: 'Arlington' },
  { id: '19', match_date: '2026-06-12', stage: 'Group Stage', group_name: 'Group D', home_team: 'United States', home_flag: '🇺🇸', home_score: 2, away_team: 'Australia', away_flag: '🇦🇺', away_score: 0, status: 'FT', venue: 'SoFi Stadium', city: 'Inglewood' },
  { id: '20', match_date: '2026-06-11', stage: 'Group Stage', group_name: 'Group A', home_team: 'Mexico', home_flag: '🇲🇽', home_score: 2, away_team: 'South Africa', away_flag: '🇿🇦', away_score: 0, status: 'FT', venue: 'Estadio Azteca', city: 'Mexico City' }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      stage: searchParams.get('stage') || undefined,
      search: searchParams.get('search') || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    const stageFilter = parsed.data.stage;
    const searchFilter = parsed.data.search?.toLowerCase();

    // Try Supabase if env variables are defined
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      let query = supabase.from('world_cup_matches').select('*').order('match_date', { ascending: false });

      if (stageFilter && stageFilter !== 'All') {
        query = query.eq('stage', stageFilter);
      }
      if (searchFilter) {
        query = query.or(`home_team.ilike.%${searchFilter}%,away_team.ilike.%${searchFilter}%,city.ilike.%${searchFilter}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({ matches: data }, {
          headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
        });
      }
    }

    // Fallback in-memory dataset
    let filtered = [...FALLBACK_MATCHES];
    if (stageFilter && stageFilter !== 'All') {
      filtered = filtered.filter(m => m.stage.toLowerCase() === stageFilter.toLowerCase());
    }
    if (searchFilter) {
      filtered = filtered.filter(m => 
        m.home_team.toLowerCase().includes(searchFilter) ||
        m.away_team.toLowerCase().includes(searchFilter) ||
        m.city.toLowerCase().includes(searchFilter)
      );
    }

    return NextResponse.json({ matches: filtered }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
