export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type NewsCategory = 'depressing' | 'fear' | 'winning' | 'happiness' | string;

export interface Settings {
  temperatureUnit: TemperatureUnit;
  newsCategories: NewsCategory[];
}