-- ====================================================================
-- FIFA World Cup 2026 Database Schema & Security Configurations
-- ====================================================================

-- 1. Create Matches Table
CREATE TABLE IF NOT EXISTS public.world_cup_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_date DATE NOT NULL,
    stage VARCHAR(50) NOT NULL,
    group_name VARCHAR(10),
    home_team VARCHAR(100) NOT NULL,
    home_flag VARCHAR(10) NOT NULL,
    home_score INT NOT NULL DEFAULT 0,
    away_team VARCHAR(100) NOT NULL,
    away_flag VARCHAR(10) NOT NULL,
    away_score INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'FT',
    venue VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Security: Enable Row Level Security (RLS)
ALTER TABLE public.world_cup_matches ENABLE ROW LEVEL SECURITY;

-- 3. Security Policy: Public can ONLY read match results
DROP POLICY IF EXISTS "Allow public read-only access" ON public.world_cup_matches;
CREATE POLICY "Allow public read-only access" 
ON public.world_cup_matches 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 4. Security Policy: Admin service role for write operations
DROP POLICY IF EXISTS "Allow admin writes only" ON public.world_cup_matches;
CREATE POLICY "Allow admin writes only" 
ON public.world_cup_matches 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 5. Seed Data: All Key Matches and Knockout Results
INSERT INTO public.world_cup_matches 
(match_date, stage, group_name, home_team, home_flag, home_score, away_team, away_flag, away_score, status, venue, city)
VALUES
-- Group Stage Highlights
('2026-06-11', 'Group Stage', 'Group A', 'Mexico', '🇲🇽', 2, 'South Africa', '🇿🇦', 0, 'FT', 'Estadio Azteca', 'Mexico City'),
('2026-06-12', 'Group Stage', 'Group B', 'Canada', '🇨🇦', 1, 'Bosnia and Herzegovina', '🇧🇦', 1, 'FT', 'BMO Field', 'Toronto'),
('2026-06-12', 'Group Stage', 'Group D', 'United States', '🇺🇸', 2, 'Australia', '🇦🇺', 0, 'FT', 'SoFi Stadium', 'Inglewood'),
('2026-06-14', 'Group Stage', 'Group E', 'Germany', '🇩🇪', 7, 'Curaçao', '🇨🇼', 1, 'FT', 'Reliant Stadium', 'Houston'),
('2026-06-16', 'Group Stage', 'Group I', 'France', '🇫🇷', 3, 'Senegal', '🇸🇳', 1, 'FT', 'MetLife Stadium', 'East Rutherford'),
('2026-06-17', 'Group Stage', 'Group J', 'Argentina', '🇦🇷', 3, 'Algeria', '🇩🇿', 0, 'FT', 'Arrowhead Stadium', 'Kansas City'),
('2026-06-17', 'Group Stage', 'Group L', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4, 'Croatia', '🇭🇷', 2, 'FT', 'AT&T Stadium', 'Arlington'),
('2026-06-20', 'Group Stage', 'Group G', 'Belgium', '🇧🇪', 5, 'New Zealand', '🇳🇿', 1, 'FT', 'BC Place', 'Vancouver'),
('2026-06-27', 'Group Stage', 'Group L', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 2, 'Panama', '🇵🇦', 0, 'FT', 'MetLife Stadium', 'East Rutherford'),
('2026-06-27', 'Group Stage', 'Group J', 'Argentina', '🇦🇷', 3, 'Jordan', '🇯🇴', 1, 'FT', 'AT&T Stadium', 'Arlington'),

-- Round of 32
('2026-06-28', 'Round of 32', NULL, 'Canada', '🇨🇦', 1, 'South Africa', '🇿🇦', 0, 'FT', 'SoFi Stadium', 'Inglewood'),
('2026-06-29', 'Round of 32', NULL, 'Brazil', '🇧🇷', 2, 'Japan', '🇯🇵', 1, 'FT', 'Reliant Stadium', 'Houston'),
('2026-06-29', 'Round of 32', NULL, 'Paraguay', '🇵🇾', 1, 'Germany', '🇩🇪', 1, 'FT (P 4-3)', 'Gillette Stadium', 'Foxborough'),
('2026-06-29', 'Round of 32', NULL, 'Morocco', '🇲🇦', 1, 'Netherlands', '🇳🇱', 1, 'FT (P 3-2)', 'Estadio BBVA', 'Guadalupe'),
('2026-06-30', 'Round of 32', NULL, 'Norway', '🇳🇴', 2, 'Ivory Coast', '🇨🇮', 1, 'FT', 'AT&T Stadium', 'Arlington'),
('2026-06-30', 'Round of 32', NULL, 'France', '🇫🇷', 3, 'Sweden', '🇸🇪', 0, 'FT', 'MetLife Stadium', 'East Rutherford'),
('2026-06-30', 'Round of 32', NULL, 'Mexico', '🇲🇽', 2, 'Ecuador', '🇪🇨', 0, 'FT', 'Banorte Stadium', 'Mexico City'),
('2026-07-01', 'Round of 32', NULL, 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 2, 'DR Congo', '🇨🇩', 1, 'FT', 'Mercedes-Benz Stadium', 'Atlanta'),
('2026-07-01', 'Round of 32', NULL, 'Belgium', '🇧🇪', 3, 'Senegal', '🇸🇳', 2, 'FT (AET)', 'Lumen Field', 'Seattle'),
('2026-07-01', 'Round of 32', NULL, 'United States', '🇺🇸', 2, 'Bosnia and Herzegovina', '🇧🇦', 0, 'FT', 'Levi''s Stadium', 'Santa Clara'),
('2026-07-02', 'Round of 32', NULL, 'Spain', '🇪🇸', 3, 'Austria', '🇦🇹', 0, 'FT', 'SoFi Stadium', 'Inglewood'),
('2026-07-02', 'Round of 32', NULL, 'Portugal', '🇵🇹', 2, 'Croatia', '🇭🇷', 1, 'FT', 'BMO Field', 'Toronto'),
('2026-07-02', 'Round of 32', NULL, 'Switzerland', '🇨🇭', 2, 'Algeria', '🇩🇿', 0, 'FT', 'BC Place', 'Vancouver'),
('2026-07-03', 'Round of 32', NULL, 'Egypt', '🇪🇬', 1, 'Australia', '🇦🇺', 1, 'FT (P 4-2)', 'AT&T Stadium', 'Arlington'),
('2026-07-03', 'Round of 32', NULL, 'Argentina', '🇦🇷', 3, 'Cape Verde', '🇨🇻', 2, 'FT (AET)', 'Hard Rock Stadium', 'Miami Gardens'),
('2026-07-03', 'Round of 32', NULL, 'Colombia', '🇨🇴', 1, 'Ghana', '🇬🇭', 0, 'FT', 'Arrowhead Stadium', 'Kansas City'),

-- Round of 16
('2026-07-04', 'Round of 16', NULL, 'France', '🇫🇷', 1, 'Paraguay', '🇵🇾', 0, 'FT', 'Lincoln Financial Field', 'Philadelphia'),
('2026-07-04', 'Round of 16', NULL, 'Morocco', '🇲🇦', 3, 'Canada', '🇨🇦', 0, 'FT', 'Reliant Stadium', 'Houston'),
('2026-07-05', 'Round of 16', NULL, 'Norway', '🇳🇴', 2, 'Brazil', '🇧🇷', 1, 'FT', 'MetLife Stadium', 'East Rutherford'),
('2026-07-05', 'Round of 16', NULL, 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3, 'Mexico', '🇲🇽', 2, 'FT', 'Banorte Stadium', 'Mexico City'),
('2026-07-06', 'Round of 16', NULL, 'Spain', '🇪🇸', 1, 'Portugal', '🇵🇹', 0, 'FT', 'AT&T Stadium', 'Arlington'),
('2026-07-06', 'Round of 16', NULL, 'Belgium', '🇧🇪', 4, 'United States', '🇺🇸', 1, 'FT', 'Lumen Field', 'Seattle'),
('2026-07-07', 'Round of 16', NULL, 'Argentina', '🇦🇷', 3, 'Egypt', '🇪🇬', 2, 'FT', 'Mercedes-Benz Stadium', 'Atlanta'),
('2026-07-07', 'Round of 16', NULL, 'Switzerland', '🇨🇭', 0, 'Colombia', '🇨🇴', 0, 'FT (P 4-3)', 'BC Place', 'Vancouver'),

-- Quarter-finals
('2026-07-09', 'Quarter-finals', NULL, 'France', '🇫🇷', 2, 'Morocco', '🇲🇦', 0, 'FT', 'Gillette Stadium', 'Foxborough'),
('2026-07-10', 'Quarter-finals', NULL, 'Spain', '🇪🇸', 2, 'Belgium', '🇧🇪', 1, 'FT', 'SoFi Stadium', 'Inglewood'),
('2026-07-11', 'Quarter-finals', NULL, 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 2, 'Norway', '🇳🇴', 1, 'FT (AET)', 'Hard Rock Stadium', 'Miami Gardens'),
('2026-07-11', 'Quarter-finals', NULL, 'Argentina', '🇦🇷', 3, 'Switzerland', '🇨🇭', 1, 'FT (AET)', 'Arrowhead Stadium', 'Kansas City'),

-- Semi-finals
('2026-07-14', 'Semi-finals', NULL, 'Spain', '🇪🇸', 2, 'France', '🇫🇷', 0, 'FT', 'AT&T Stadium', 'Arlington'),
('2026-07-15', 'Semi-finals', NULL, 'Argentina', '🇦🇷', 2, 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 1, 'FT', 'Mercedes-Benz Stadium', 'Atlanta'),

-- 3rd Place Match
('2026-07-18', 'Bronze Final', NULL, 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 6, 'France', '🇫🇷', 4, 'FT', 'Hard Rock Stadium', 'Miami Gardens'),

-- World Cup Final
('2026-07-19', 'Final', NULL, 'Spain', '🇪🇸', 1, 'Argentina', '🇦🇷', 0, 'FT (AET)', 'MetLife Stadium', 'East Rutherford');
