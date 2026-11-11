import { LeaderboardEntry, UserStats } from '../types';

export const BASE_LEAGUE_LEARNERS: Record<string, Omit<LeaderboardEntry, 'rank' | 'league' | 'isCurrentUser'>[]> = {
  Bronze: [
    { id: 'b1', name: 'Sonia_SQL', avatar: '👩‍💻', xp: 220, streak: 5, trend: 'up', titleBadge: 'Query Rookie', cheersReceived: 4 },
    { id: 'b2', name: 'Alex_DataNinja', avatar: '🥷', xp: 195, streak: 4, trend: 'same', titleBadge: 'Analyst Aspirant', cheersReceived: 2 },
    { id: 'b3', name: 'Devon_Bytes', avatar: '⚡', xp: 170, streak: 3, trend: 'up', titleBadge: 'Syntax Seeker', cheersReceived: 7 },
    { id: 'b4', name: 'Hana_Analytics', avatar: '🚀', xp: 135, streak: 2, trend: 'down', titleBadge: 'Table Explorer', cheersReceived: 1 },
    { id: 'b5', name: 'Ravi_Postgres', avatar: '📊', xp: 110, streak: 3, trend: 'same', titleBadge: 'Join Novice', cheersReceived: 3 },
    { id: 'b6', name: 'Elena_Queries', avatar: '💡', xp: 85, streak: 1, trend: 'down', titleBadge: 'Learner', cheersReceived: 0 },
    { id: 'b7', name: 'Marcus_DB', avatar: '🧑‍💼', xp: 50, streak: 2, trend: 'down', titleBadge: 'Learner', cheersReceived: 1 },
    { id: 'b8', name: 'Aiden_Select', avatar: '🔍', xp: 35, streak: 1, trend: 'same', titleBadge: 'Learner', cheersReceived: 0 },
  ],
  Silver: [
    { id: 's1', name: 'Chloe_Analytics', avatar: '🌟', xp: 680, streak: 12, trend: 'up', titleBadge: 'Filter Pro', cheersReceived: 8 },
    { id: 's2', name: 'Kenji_Sato', avatar: '🥋', xp: 610, streak: 9, trend: 'up', titleBadge: 'Subquery Scout', cheersReceived: 6 },
    { id: 's3', name: 'Zoe_Data', avatar: '🎯', xp: 540, streak: 8, trend: 'same', titleBadge: 'Aggregate Ace', cheersReceived: 5 },
    { id: 's4', name: 'Lucas_Vance', avatar: '🧭', xp: 470, streak: 6, trend: 'down', titleBadge: 'Joiner', cheersReceived: 3 },
    { id: 's5', name: 'Fatima_K', avatar: '🔬', xp: 420, streak: 7, trend: 'same', titleBadge: 'Analyst', cheersReceived: 4 },
  ],
  Gold: [
    { id: 'g1', name: 'Priya_Patel', avatar: '👑', xp: 1650, streak: 24, trend: 'up', titleBadge: 'CTE Champion', cheersReceived: 19 },
    { id: 'g2', name: 'Samantha_Wu', avatar: '🪐', xp: 1480, streak: 20, trend: 'up', titleBadge: 'Window Wizard', cheersReceived: 14 },
    { id: 'g3', name: 'Arthur_P', avatar: '🏹', xp: 1320, streak: 18, trend: 'down', titleBadge: 'Index Optimizer', cheersReceived: 11 },
    { id: 'g4', name: 'Beatriz_G', avatar: '💎', xp: 1150, streak: 15, trend: 'same', titleBadge: 'Data Architect', cheersReceived: 8 },
  ],
  Emerald: [
    { id: 'e1', name: 'Daria_Volkova', avatar: '🐉', xp: 3200, streak: 45, trend: 'up', titleBadge: 'Query Sorcerer', cheersReceived: 27 },
    { id: 'e2', name: 'Matteo_Rossi', avatar: '🏆', xp: 2950, streak: 38, trend: 'same', titleBadge: 'ETL Master', cheersReceived: 22 },
    { id: 'e3', name: 'Ananya_Sharma', avatar: '⚡', xp: 2700, streak: 32, trend: 'up', titleBadge: 'Warehousing Hero', cheersReceived: 18 },
  ],
  Diamond: [
    { id: 'd1', name: 'Grace_Hopper_Fan', avatar: '👑', xp: 6500, streak: 112, trend: 'same', titleBadge: 'Grandmaster', cheersReceived: 84 },
    { id: 'd2', name: 'Evelyn_Reed', avatar: '🌌', xp: 5800, streak: 94, trend: 'up', titleBadge: 'BigQuery Guru', cheersReceived: 62 },
    { id: 'd3', name: 'Daniel_Evans', avatar: '🦅', xp: 5200, streak: 80, trend: 'down', titleBadge: 'Data Legend', cheersReceived: 51 },
  ],
};

export function buildLeagueLeaderboard(stats: UserStats, leagueOverride?: UserStats['league']): LeaderboardEntry[] {
  const currentLeague = leagueOverride || stats.league;
  const peers = BASE_LEAGUE_LEARNERS[currentLeague] || BASE_LEAGUE_LEARNERS.Bronze;

  const userEntry: LeaderboardEntry = {
    id: 'user_current',
    name: 'You (SQL Analyst)',
    avatar: stats.inventory.includes('avatar_crown') ? '👑' : '🐲',
    xp: stats.xp,
    streak: stats.currentStreak,
    league: currentLeague,
    rank: 1,
    isCurrentUser: true,
    titleBadge: stats.inventory.includes('title_sql_wizard') ? 'Database Sorcerer' : 'Quest Explorer',
    trend: 'up',
    cheersReceived: 12,
  };

  const list: LeaderboardEntry[] = [
    userEntry,
    ...peers.map(p => ({
      ...p,
      league: currentLeague,
      isCurrentUser: false,
      rank: 1,
    })),
  ];

  // Sort descending by XP
  list.sort((a, b) => b.xp - a.xp);

  // Assign sequential ranks 1..N
  return list.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

export function getLeaguePromotionZone(rank: number, totalParticipants: number): 'promotion' | 'demotion' | 'safe' {
  if (rank <= 3) return 'promotion';
  if (rank > Math.max(3, totalParticipants - 2)) return 'demotion';
  return 'safe';
}
