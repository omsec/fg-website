export interface Comment {
  id: string;
  profileId: string;
  profileType: string; // domain
  createdTS: Date;
  createdID: string; // setzt der server aus dem token
  createdName: string;
  modifiedTS?: Date;
  modifiedID?: string;
  modifiedName?: string;
  upVotes: number;
  downVotes: number;
  userVote: number;
  rating: number;
  ratingSort: number;
  statusCode: number;
  statusText?: string;
  statusTS: Date;
  statusID: string; // user who set the status
  statusName?: string;
  pinned: boolean;
  comment: string;
  replies?: Comment[];
}
