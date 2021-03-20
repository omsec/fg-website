// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// interface mnauell gebaut für typisierung (ermöglicht envPipe)
export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  imgUrl: string;
  releaseDate: Date;
}

const urlBase = 'http://localhost:3000';

export const environment: AppEnvironment = {
  production: false,
  apiUrl: urlBase,
  imgUrl: urlBase + '/images',
  releaseDate: new Date('2020-01-01')
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
