export interface UserRaw {
  id: string,
  loginName: string,
  password: string, // weglassen hier? -createUser!
  roleCode: number,
  roleText?: string,
  languageCode: number,
  languageText?: string,
  eMailAddress: string,
  xBoxTag?: string,
  lastSeenTS: string
}
