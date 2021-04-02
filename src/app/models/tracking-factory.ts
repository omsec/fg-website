import { TrackingRaw } from './tracking-raw';

export class TrackingFactory {
  static fromRaw(trackingRaw: TrackingRaw) {
    let usr = trackingRaw.userName
    if (usr == '') {
      usr = '(anonymous)' // i18n
    }
    return {
      ...trackingRaw,
      visitTS: new Date(trackingRaw.visitTS),
      userName: usr
    }
  }
}
