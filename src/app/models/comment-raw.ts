export interface CommentRaw {
  id: string;
  profileId: string;
  profileType: string; // domain
  createdTS: string;
  createdID: string;
  createdName: string;
  modifiedTS?: string;
  modifiedID?: string;
  modifiedName?: string;
  upVotes: number;
  downVotes: number;
  userVote: number;
  rating: number;
  ratingSort: number;
  statusCode: number;
  statusText: string;
  statusTS: string;
  statusID: string; // user who set the status
  statusName: string;
  pinned: boolean;
  comment: string;
  replies: CommentRaw[];
}
