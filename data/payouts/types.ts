export interface PartyPayout {
  id: number;
  name: string;
  leaderAddress: string;
  leaderUsername: string;
  totalWdd: string;
  totalWld: string;
  weeklyPayouts: WeeklyPartyPayout[];
}

export interface WeeklyPartyPayout {
  weekNumber: number;
  wdd: {
    amount: string;
    transactionHash: string;
  };
  wld: {
    amount: string;
    transactionHash: string;
  };
}

export interface WeeklyPayout {
  weekNumber: number;
  totalWdd: string;
  totalWld: string;
  parties: PartyPayout[];
}
