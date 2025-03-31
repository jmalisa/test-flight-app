export const MONTHS: string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS: number[] = Array.from({length: 31}, (_, i) => i + 1);

export const START_YEAR = 1930;
export const END_YEAR = 2025;
export const YEARS: number[] = Array.from(
  {length: END_YEAR - START_YEAR + 1}, 
  (_, i) => START_YEAR + i
); 

export const COUNTRIES: string[] = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Canada',
  'Australia',
  'Japan',
  'Brazil',
  'India',
  'China',
  'Russia',
  'Netherlands',
  'Sweden',
  'Norway',
  'Switzerland',
  'New Zealand',
  'Singapore',
  'Croatia'
]; 