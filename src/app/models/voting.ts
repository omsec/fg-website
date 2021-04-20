export enum VoteAction {
  notVoted = 0,
  negative = -1,
  positive = 1
}

// represents a vote action
export interface Vote {
  profileID: string;
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
