export enum BusinessDomain {
  user = 'user',
  course = 'course',
  championship = 'championship'
}

export function StringToBusinessDomain(str: string): BusinessDomain | undefined {

  switch (str) {
    case 'user': return BusinessDomain.user
    case 'course': return BusinessDomain.course
    case 'championship': return BusinessDomain.championship
    default: return undefined
  }

}
