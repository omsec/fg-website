export interface MetaInfo {
  createdTS?: Date;
  createdID?: string; // userId of creator
  createdName?: string; // user name
  modifiedTS?: Date;
  modifiedID?: string;
  modifiedName?: string;
  rating?: number;
  ratingSort?: number;
  upVotes: number;
  userVote: number;
  downVotes: number;
  touchedTS?: Date;
  recVer?: number;
}
