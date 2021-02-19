export interface User {
  id: string,
  loginName: string,
  password: string, // weglassen hier? -createUser!
  roleCode: number,
  roleText?: string,
  languageCode: number,
  languageText?: string,
  eMail: string,
  XBoxTag?: string,
  lastSeen: Date[]
}
