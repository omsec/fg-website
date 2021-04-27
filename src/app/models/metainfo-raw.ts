export interface MetaInfoRaw {
  createdTS: string;
  createdID: string; // userId of creator
  createdName: string; // user name
  modifiedTS?: string;
  modifiedID?: string;
  modifiedName?: string;
  rating: number;
  ratingSort: number;
  upVotes: number;
  downVotes: number;
  touchedTS: string;
  recVer: number;
}


// ToDO: SmallHeader
