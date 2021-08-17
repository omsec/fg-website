// interface mnauell gebaut für typisierung (ermöglicht envPipe)
export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  imgUrl: string;
  releaseDate: Date;
}

const urlBase = 'https://192.168.1.10:3000';

export const environment: AppEnvironment = {
  production: true,
  apiUrl: urlBase,
  imgUrl: urlBase + '/images',
  releaseDate: new Date('2020-01-01')
};
