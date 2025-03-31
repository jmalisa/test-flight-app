export interface PriceRange {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
}

export interface StopOption {
  label: string;
  value: number
  checked: boolean;
}

export type SortOption = {
  label: string;
  key: 'price' | 'departure_time' | 'duration_minutes';
  direction: 'asc' | 'desc';
}; 