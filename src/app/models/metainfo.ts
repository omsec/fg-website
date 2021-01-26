export interface MetaInfo {
  createdTS?: Date;
  createdID?: string; // userId of creator
  createdName?: string; // user name
  modifiedTS?: Date;
  modifiedID?: string;
  modifiedName?: string;
  rating?: number;
  touchedTS?: Date;
  recVer?: number;
}
