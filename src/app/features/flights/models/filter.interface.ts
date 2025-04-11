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

// Using a const enum for better performance and type safety
export const enum SortKeys {
  Price = 'price',
  Departure = 'departure',
  Duration = 'duration',
  Arrival = 'arrival',
  Airline = 'airline'
}

// Type for the sort option keys
export type SortOptionKey = `${SortKeys}`;

export type SortOption = {
  label: string;
  key: SortOptionKey;
  direction: 'asc' | 'desc';
};

// Add these constants to your filter.interface.ts
export const DEFAULT_SORT: SortOption = {
  label: 'Price (ascending)',
  key: SortKeys.Price,
  direction: 'asc'
} as const;

export const DEFAULT_PRICE_RANGE: PriceRange = {
  min: 0,
  max: 10000,
  currentMin: 0,
  currentMax: 10000
};

export interface FilterChangeEvent {
  sort: SortOption;
  priceRange: PriceRange;
  stops: number[];
} 