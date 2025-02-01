export type LeaguesApiResponse = {
  success: boolean;
  data: LeagueData[];
};

export type LeagueData = {
  leagueID: string;
  name: string;
  squarePK: string;
  contracted: boolean;
  bowlerCount: number;
  centerID: string;
  prizePK: string;
};
