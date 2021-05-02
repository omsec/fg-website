import { BusinessDomain } from '../shared/business-domain';

export enum VoteAction {
  notVoted = 0,
  negative = -1,
  positive = 1
}

// represents a vote action
export interface Vote {
  profileID: string;
  profileType: string; //BusinessDomain;
  userID: string;
  userName?: string;
  voteTS?: Date;
  vote: VoteAction;
}

export interface ProfileVotes {
  upVotes: number;
  downVotes: number;
  userVote: VoteAction;
}
