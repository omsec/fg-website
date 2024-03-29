import { Lookup } from './lookup';
import { MetaInfo } from './metainfo';

export interface Course {
  id?: string;
  metaInfo: MetaInfo;
  visibilityCode: number;
  visibilityText?: string;
  gameCode: number;
  GameText?: string;
  typeCode: number;
  typeText?: string;
  styleCode: number;
  styleText?: string;
  forzaSharing: number;
  name: string;
  seriesCode: number;
  seriesText?: string;
  carClassCodes?: Lookup[];
  description?: string;
  route?: CourseRef;
  tags?:[];
}

// nested course reference
export interface CourseRef {
  id: string;
  name: string;
}

// recuded structure used for lists (read-only to client, hence no nulls)
export interface CourseListItem {
  id: string;
  createdTS: Date;
  createdID: string;
  createdName: string;
  rating: number;
  gameCode: number;
  gameText: string;
  name: string;
  forzaSharing: number;
  seriesCode: number;
  seriesText: string;
  styleCode: number;
  styleText: string;
  carClassesCode: number[];
  carClassesText: string[];
}

// not sent to the API directly, it's used inside this app
// to pass search-criteria to the service which then converts it into http-params
export interface CourseSearch {
  searchMode: CourseSearchMode;
  gameCode: number;
  seriesCodes: number[];
  searchTerm: string;
}

export enum CourseSearchMode {
  All,
  Standard,
  Custom
}
