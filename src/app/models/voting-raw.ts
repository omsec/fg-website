// represents a vote action
export interface VoteRaw {
  profileID: string;
  profileType: string;
  userID: string;
  userName?: string;
  voteTS: string;
  vote: number;
}

// raw & factory omitted
/*
export interface ProfileVoteRaw {
  UpVotes: number;
  DownVotes: number;
  UserVote: number;
}
*/
