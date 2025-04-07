import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat',
  standalone: true
})
export class TimeDurationPipe implements PipeTransform {
  transform(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}
