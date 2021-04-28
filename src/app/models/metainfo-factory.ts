import { DateHelper } from '../helpers/date-helper';
import { MetaInfo } from './metainfo';
import { MetaInfoRaw } from './metainfo-raw';

export class MetainfoFactory {
  static fromRaw(metaInfoRaw: MetaInfoRaw): MetaInfo {

    return {
      ...metaInfoRaw,
      createdTS: new Date(metaInfoRaw.createdTS),
      modifiedTS: DateHelper.fromString(metaInfoRaw.modifiedTS),
      touchedTS: new Date(metaInfoRaw.touchedTS)
    }
  }

  // nur für create nötige Attribute vorgeben
  static empty(): MetaInfo {
    return {
      createdTS: undefined,
      createdID: '', // id würde eigentlich reichen
      createdName: '',
      upVotes: 0,
      downVotes: 0,
      userVote: 0
    }
  }


}


// ToDo: empty() - evtl. null erlauben für created-Props
