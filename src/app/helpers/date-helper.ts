export class DateHelper {
  static fromString(date: string | undefined): Date | undefined {
    if (date) {
      return new Date(date)
    } else {
      return undefined
    }
  }
}

export function formatDate(date: Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
