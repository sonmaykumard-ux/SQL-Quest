export type TabType = 'learn' | 'practice' | 'playground' | 'projects' | 'leaderboard' | 'profile';

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Emerald' | 'Diamond';
  rank: number;
  isCurrentUser?: boolean;
  titleBadge?: string;
  trend: 'up' | 'down' | 'same';
  cheersReceived?: number;
}

export type DailyGoalMinutes = 5 | 10 | 15 | 30;

export interface UserStats {
  xp: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date YYYY-MM-DD
  totalDaysLearned: number;
  queriesExecuted: number;
  dailyGoalMinutes: DailyGoalMinutes;
  streakFreezes: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Emerald' | 'Diamond';
  leagueRank: number;
  completedLessonIds: string[];
  completedProjectIds: string[];
  solvedChallengeIds: string[];
  unlockedAchievementIds: string[];
  inventory: string[]; // purchased theme/avatar item IDs
  activeTheme: string;
  activeAvatar: string;
  activityDates?: string[];
}

export type ExerciseType = 'mcq' | 'fill_blank' | 'write_query' | 'fix_bug';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  hint?: string;
  explanation: string;
  xpReward: number;
}

export interface McqExercise extends BaseExercise {
  type: 'mcq';
  options: string[];
  correctAnswerIndex: number;
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill_blank';
  template: string; // e.g. "SELECT department, ___(salary) FROM employees GROUP BY department;"
  blankOptions: string[];
  correctBlank: string;
}

export interface WriteQueryExercise extends BaseExercise {
  type: 'write_query';
  defaultQuery?: string;
  datasetId: string;
  targetQuery: string; // canonical reference query to test output equivalence
  validationNote?: string;
}

export interface FixBugExercise extends BaseExercise {
  type: 'fix_bug';
  buggyQuery: string;
  datasetId: string;
  targetQuery: string;
  bugDescription: string;
}

export type Exercise = McqExercise | FillBlankExercise | WriteQueryExercise | FixBugExercise;

export interface Lesson {
  id: string;
  levelId: number;
  title: string;
  description: string;
  durationMinutes: number;
  topics: string[];
  summaryMarkdown: string;
  exercises: Exercise[];
}

export interface Level {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  color: string;
  iconName: string;
  lessons: Lesson[];
}

export interface DatasetTable {
  name: string;
  columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[];
  rowCount: number;
  description: string;
}

export interface Dataset {
  id: string;
  name: string;
  category: string;
  description: string;
  initSql: string;
  tables: DatasetTable[];
}

export interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'learning' | 'queries' | 'projects';
  requiredProgress: number;
  xpBonus: number;
  coinsBonus: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  datasetId: string;
  prompt: string;
  targetQuery: string;
  hint: string;
  xp: number;
  coins: number;
}

export interface ProjectTask {
  id: string;
  taskNumber: number;
  title: string;
  businessQuestion: string;
  hint: string;
  solutionQuery: string;
  explanation: string;
}

export interface Project {
  id: string;
  number: number;
  title: string;
  category: string;
  datasetId: string;
  scenario: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedHours: string;
  tasks: ProjectTask[];
  skillsLearned: string[];
}

export interface InterviewQuestion {
  id: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced' | 'Joins' | 'Window Functions' | 'Optimization' | 'Case Studies';
  title: string;
  question: string;
  sampleDataset?: string;
  queryExample: string;
  expectedResultExplanation: string;
  commonMistakes: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'theme' | 'avatar' | 'title' | 'streak_freeze';
  costCoins: number;
  description: string;
  previewColor?: string;
  icon?: string;
}
