import { TrackingRaw } from './tracking-raw';

export class TrackingFactory {
  static fromRaw(trackingRaw: TrackingRaw) {
    return {
      ...trackingRaw,
      visitTS: new Date(trackingRaw.visitTS)
    }
  }
}
