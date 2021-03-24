import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'forzashare'
})
export class ForzasharePipe implements PipeTransform {

  transform(value: number): string {
    if (!value) { return ''; }
    if (value <= 0) { return ''; }

    const str = value.toString();
    return `${str.substr(0, 3)} ${str.substr(3, 3)} ${str.substr(6, 3)}`;
  }

}
