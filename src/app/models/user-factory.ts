import { UserRaw } from './user-raw';
import { User } from './user';
import { stringify } from '@angular/compiler/src/util';
import { UserLanguage, UserRole } from './lookup-values';

export class UserFactory {

  static fromRaw(userRaw: UserRaw): User {
    return {
      ...userRaw,
      lastSeenTS: new Date(userRaw.lastSeenTS)
    };
  }

  static empty(): User {
    return {
      id: '',
      loginName: '',
      password: '',
      roleCode: UserRole.Guest,
      roleText: '',
      languageCode: UserLanguage.English,
      languageText: '',
      eMailAddress: '',
      xBoxTag: '',
      lastSeenTS: new Date()
    }
  }
}
