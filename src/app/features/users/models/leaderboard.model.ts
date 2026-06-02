export interface LeaderboardEntry {
  rank: number;
  userId: number;
  code: string;
  firstName: string;
  lastName: string;
  userName: string;
  avatarUrl: string | null;
  totalStars: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}
