export interface DrawerItemProps {
  title: string;
  isAddNew?: boolean;
  lang: string;
}

export interface OpenLetterCardProps {
  title: string;
  referenceTitle?: string;
  referenceUrl?: string;
  voteUrl: string;
  isExternal?: boolean;
}

export interface Tab {
  key: string;
  label: string;
}

export interface TabSwiperProps<T extends string> {
  tabs: Tab[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export interface WalletAuthProps {
  lang: string;
  onError?: (error: string) => void;
  onSuccess?: (walletAddress: string, username: string) => void;
}

export interface WalletContextProps {
  walletAddress: string | null;
  username: string | null;
  tokenBalance: string | null;
  claimableAmount: string | null;
  claimableAmountPlus: string | null;
  basicIncomeActivated: boolean;
  basicIncomePlusActivated: boolean;
  rewardCount: number;
  secureDocumentRewardCount: number;
  setWalletAddress: (address: string) => void;
  setUsername: (username: string) => void;
  fetchBasicIncomeInfo: () => Promise<void>;
  fetchBasicIncomePlusInfo: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  fetchRewardCount: () => Promise<void>;
  fetchSecureDocumentRewardCount: () => Promise<void>;
  setBasicIncomeActivated: (activated: boolean) => void;
  setBasicIncomePlusActivated: (activated: boolean) => void;
}

export interface WalletProviderProps {
  children: React.ReactNode;
}

export type TabKey =
  | "openLetters"
  | "elections"
  | "referendums";

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type EarnTabKey = "Basic income" | "Savings" | "Contribute";

export type Winner = {
  handle: string;
  engagement: number;
  postLink: string;
  place: 1 | 2 | 3;
};

export type WeeklyWinners = {
  weekOf: string;
  winners: Winner[];
};

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
