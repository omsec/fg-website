import { CourseRaw, CourseListItemRaw } from './course-raw';
import { Course, CourseListItem } from './course';
import { MetainfoFactory } from './metainfo-factory';
import { CarClass, CourseType, Game, Series, Visibility } from './lookup-values';

export class CourseFactory {
  static fromRaw(courseRaw: CourseRaw): Course {
    if (courseRaw) {
      return {
        ...courseRaw,
        metaInfo: MetainfoFactory.fromRaw(courseRaw.metaInfo)
      }
    } else {
      throw('null received')
    }
  }

  // für create-notwendige
  static empty(): Course {
    return {
      metaInfo: MetainfoFactory.empty(),
      visibilityCode: Visibility.Public,
      gameCode: Game.FH4,
      typeCode: CourseType.Community,
      forzaSharing: 100000000,
      name: '',
      seriesCode: Series.Road,
      carClassCode: CarClass.Open
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
