import { CourseRaw, CourseListItemRaw } from './course-raw';
import { Course, CourseListItem } from './course';
import { MetainfoFactory } from './metainfo-factory';
import { CarClass, CourseType, Game, LookupTypes, Series, Visibility } from './lookup-values';
import { LookupService } from '../services/lookup.service';

export class CourseFactory {
  static fromRaw(courseRaw: CourseRaw): Course {
      return {
        ...courseRaw,
        metaInfo: MetainfoFactory.fromRaw(courseRaw.metaInfo)
      }
  }

  // für create-notwendige
  // ToDO: lookup service injdecten?
  static empty(lookupService: LookupService): Course {
    return {
      metaInfo: MetainfoFactory.empty(),
      visibilityCode: lookupService.getDefault(LookupTypes.Visibility),
      gameCode: lookupService.getDefault(LookupTypes.Game),
      typeCode: lookupService.getDefault(LookupTypes.CourseType),
      forzaSharing: 100000000,
      name: '',
      seriesCode: lookupService.getDefault(LookupTypes.Series),
      //carClassesCode: Array.from([lookupService.getDefault(LookupTypes.CarClass)]) // setzt das erste elemente, wenn kein def vorhanden
      carClassesCode: Array.from([]) // kein def
    }
  }

}

// recuded structure used for lists (read-only to client, hence no nulls)
export class CourseListItemFactory {
  static fromRaw(courseListItem: CourseListItemRaw): CourseListItem {
    return {
      ...courseListItem,
      createdTS: new Date(courseListItem.createdTS)
    }
  }

}
