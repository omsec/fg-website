import { UserRaw } from './user-raw';
import { User } from './user';
import { UserLanguage, UserRole } from './lookup-values';

export class UserFactory {

  static fromRaw(userRaw: UserRaw): User {
    let lastSeen: Date[] = [];
    if (userRaw.lastSeen) {
      userRaw.lastSeen.map(item => lastSeen.push(new Date(item)));
    }

    return {
      ...userRaw,
      lastSeen
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
      eMail: '',
      XBoxTag: '',
      lastSeen: []
    }
  }
}
