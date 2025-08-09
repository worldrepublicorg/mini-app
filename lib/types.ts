export interface DrawerItemProps {
  title: string;
  isAddNew?: boolean;
  lang: string;
}

export interface PartySkeletonCardProps {
  showPendingNote?: boolean;
  dictionary?: any;
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
  tabIndicators?: Record<T, boolean>;
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

export interface Party {
  id: number;
  name: string;
  shortName: string;
  description: string;
  officialLink: string;
  founder: string;
  leader: string;
  memberCount: number;
  documentVerifiedMemberCount: number;
  verifiedMemberCount: number;
  creationTime: number;
  active: boolean;
  status: number;
  isUserMember?: boolean;
  isUserLeader?: boolean;
}

export interface PartyDetail extends Party {
  currentLeader?: string;
  members?: { address: string }[];
  bannedMembers?: { address: string }[];
}

export interface PartiesContextType {
  activeParties: Party[];
  pendingParties: Party[];
  parties: Party[];
  activeLoading: boolean;
  pendingLoading: boolean;
  userPartyId: number;
  userPartyData: Party | null;
  fetchActiveParties: () => Promise<void>;
  fetchPendingParties: () => Promise<void>;
  fetchPartyById: (id: number) => Promise<Party | null>;
  setUserPartyId: (id: number) => void;
  setParties: (parties: Party[] | ((prevParties: Party[]) => Party[])) => void;
  getOptimisticPartyId: () => number;
  storeUserParty: (party: Party | null) => void;
  shuffledActiveParties: Party[];
}

export interface CreatePartyForm {
  name: string;
  shortName: string;
  description: string;
  officialLink: string;
}

export interface PoliticalPartyListProps {
  lang: string;
}

export enum PartyStatus {
  PENDING = 0,
  ACTIVE = 1,
  INACTIVE = 2,
}

export type TabKey =
  | "polls"
  | "openLetters"
  | "elections"
  | "referendums"
  | "politicalParties";

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type EarnTabKey = "Basic income" | "Savings" | "Contribute" | "Invite";

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

export interface WeeklyPayout {
  weekNumber: number;
  totalWdd: string;
  totalWld: string;
  parties: PartyPayout[];
}
