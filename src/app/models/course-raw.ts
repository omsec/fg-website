import { MetaInfoRaw } from './metainfo-raw';

export interface CourseRaw {
  id: string;
  metaInfo: MetaInfoRaw;
  visibilityCode: number;
  visibilityText?: string;
  gameCode: number;
  GameText?: string;
  typeCode: number;
  typeText?: string;
  forzaSharing: number;
  name: string;
  seriesCode: number;
  seriesText?: string;
  carClassesCode: number[];
  carClassesText?: string[];
  route?: CourseRefRaw;
}

// nested course reference
export interface CourseRefRaw {
  id: string;
  name: string;
}

// recuded structure used for lists (read-only to client, hence no nulls)
export interface CourseListItemRaw {
  id: string;
  createdTS: string;
  createdID: string;
  createdName: string;
  rating: number;
  gameCode: number;
  gameText: string;
  name: string;
  forzaSharing: number;
  seriesCode: number;
  seriesText: string;
  carClassesCode: number[];
  carClassesText: string[];
}
