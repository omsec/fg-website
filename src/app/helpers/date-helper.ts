export class DateHelper {
  static fromString(date: string | undefined): Date | undefined {
    if (date) {
      return new Date(date)
    } else {
      return undefined
    }
  }
}
