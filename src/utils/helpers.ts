// Map temperature to news category
export const getNewsCategoryByWeather = (tempC: number): string => {
  if (tempC <= 10) return 'depressing'; // cold
  if (tempC >= 25) return 'fear';       // hot
  return 'winning';                     // cool
};

// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (c: number): number => (c * 9) / 5 + 32;