import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  private readonly months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  transform(date: string): string {
    if (!date) return '';

    try {
      const [year, month, day] = date.split('-');
      const monthName = this.months[parseInt(month, 10) - 1];
      const dayNum = parseInt(day, 10);

      return `${monthName} ${dayNum}`;
    } catch (error) {
      return date;
    }
  }
}
