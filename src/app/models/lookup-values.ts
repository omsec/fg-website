// used as constants in program code

export enum LookupTypes {
  UserRole = 'user role',
  UserLanguage = 'user language',
  Game = 'game',
  Visibility = 'visibility',
  CourseType = 'course type',
  CourseStyle = 'course style',
  Series = 'series',
  CarClass = 'car class'
}

// symbolic names of look-up values
// Codes zuweisen (generator) so muss es nicht 0, 1, ... sein
export enum UserRole {
  Guest,
  Member,
  Admin
}

export enum UserLanguage {
  English,
  German
}

export enum Game {
  FH4,
  FH5
}

export enum Visibility {
  Public,
  Friends,
  Me
}

export enum CourseType {
  Standard,
  Community
}

export enum CourseStyle {
  Circuit,
  Sprint
}

export enum Series {
  Road,
  Dirt,
  Cross,
  Street
}

export enum CarClass {
  A800,
  B700,
  C600,
  D500,
  S1900,
  S2998,
  X999,
  Open,
  Mixed
}
