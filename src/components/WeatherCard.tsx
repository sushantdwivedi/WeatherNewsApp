// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { WeatherData } from '../api/weatherApi';
// import { colors } from '../theme/colors';
// import { celsiusToFahrenheit } from '../utils/helpers';

// interface Props {
//   weather: WeatherData;
//   unit: 'celsius' | 'fahrenheit';
// }

// const WeatherCard: React.FC<Props> = ({ weather, unit }) => {
//   const currentTempC = weather.current_weather.temperature;
//   const currentTemp =
//     unit === 'celsius' ? currentTempC : celsiusToFahrenheit(currentTempC);

//   return (
//     <View style={styles.card}>
//       <Text style={styles.title}>Current Weather</Text>
//       <Text style={styles.temp}>
//         {currentTemp.toFixed(1)}° {unit === 'celsius' ? 'C' : 'F'}
//       </Text>
//       <Text style={styles.condition}>
//         Weather Code: {weather.current_weather.weathercode}
//       </Text>

//       <Text style={[styles.title, { marginTop: 20 }]}>5-Day Forecast</Text>
//       {weather.daily.time.map((date, idx) => {
//         const maxTempC = weather.daily.temperature_2m_max[idx];
//         const minTempC = weather.daily.temperature_2m_min[idx];
//         const maxTemp =
//           unit === 'celsius' ? maxTempC : celsiusToFahrenheit(maxTempC);
//         const minTemp =
//           unit === 'celsius' ? minTempC : celsiusToFahrenheit(minTempC);

//         return (
//           <View key={date} style={styles.forecastRow}>
//             <Text style={styles.date}>{date}</Text>
//             <Text style={styles.temp}>
//               {minTemp.toFixed(0)}° / {maxTemp.toFixed(0)}° {unit === 'celsius' ? 'C' : 'F'}
//             </Text>
//           </View>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: colors.cardBackground,
//     borderRadius: 12,
//     padding: 16,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textPrimary,
//   },
//   temp: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: colors.primary,
//     marginVertical: 8,
//   },
//   condition: {
//     fontSize: 14,
//     color: colors.textSecondary,
//   },
//   forecastRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
//   date: {
//     fontSize: 14,
//     color: colors.textPrimary,
//   },
// });

// export default WeatherCard;






import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../api/weatherApi';
import { colors } from '../theme/colors';
import { celsiusToFahrenheit } from '../utils/helpers';

interface Props {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

const WeatherCard: React.FC<Props> = ({ weather, unit }) => {
  const currentTempC = weather.current_weather.temperature;
  const currentTemp =
    unit === 'celsius' ? currentTempC : celsiusToFahrenheit(currentTempC);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWeatherIcon = (weatherCode: number) => {
    // Simple weather code to emoji mapping
    if (weatherCode === 0) return '☀️';
    if (weatherCode >= 1 && weatherCode <= 3) return '⛅';
    if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
    if (weatherCode >= 51 && weatherCode <= 67) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
    if (weatherCode >= 80 && weatherCode <= 82) return '🌦️';
    if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';
    return '🌤️';
  };

  const getWeatherDescription = (weatherCode: number) => {
    if (weatherCode === 0) return 'Clear sky';
    if (weatherCode >= 1 && weatherCode <= 3) return 'Partly cloudy';
    if (weatherCode >= 45 && weatherCode <= 48) return 'Foggy';
    if (weatherCode >= 51 && weatherCode <= 67) return 'Rainy';
    if (weatherCode >= 71 && weatherCode <= 77) return 'Snowy';
    if (weatherCode >= 80 && weatherCode <= 82) return 'Rain showers';
    if (weatherCode >= 95 && weatherCode <= 99) return 'Thunderstorm';
    return 'Partly cloudy';
  };

  return (
    <View style={styles.container}>
      {/* Current Weather Card */}
      <View style={styles.currentCard}>
        <View style={styles.currentHeader}>
          <Text style={styles.currentTitle}>Current Weather</Text>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weather.current_weather.weathercode)}
          </Text>
        </View>
        
        <View style={styles.currentContent}>
          <Text style={styles.currentTemp}>
            {currentTemp.toFixed(0)}°
          </Text>
          <View style={styles.currentDetails}>
            <Text style={styles.unit}>
              {unit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
            </Text>
            <Text style={styles.condition}>
              {getWeatherDescription(weather.current_weather.weathercode)}
            </Text>
          </View>
        </View>
      </View>

      {/* 5-Day Forecast */}
      <View style={styles.forecastCard}>
        <Text style={styles.forecastTitle}>5-Day Forecast</Text>
        
        <View style={styles.forecastList}>
          {weather.daily.time.map((date, idx) => {
            const maxTempC = weather.daily.temperature_2m_max[idx];
            const minTempC = weather.daily.temperature_2m_min[idx];
            const maxTemp =
              unit === 'celsius' ? maxTempC : celsiusToFahrenheit(maxTempC);
            const minTemp =
              unit === 'celsius' ? minTempC : celsiusToFahrenheit(minTempC);

            return (
              <View key={date} style={styles.forecastRow}>
                <View style={styles.forecastLeft}>
                  <Text style={styles.forecastDate}>{formatDate(date)}</Text>
                </View>
                
                <View style={styles.forecastRight}>
                  <View style={styles.tempRange}>
                    <Text style={styles.tempHigh}>
                      {maxTemp.toFixed(0)}°
                    </Text>
                    <Text style={styles.tempLow}>
                      {minTemp.toFixed(0)}°
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  currentCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weatherIcon: {
    fontSize: 32,
  },
  currentContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  currentTemp: {
    fontSize: 72,
    fontWeight: '200',
    color: colors.primary,
    lineHeight: 72,
  },
  currentDetails: {
    alignItems: 'flex-end',
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  condition: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  forecastCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  forecastList: {
    gap: 16,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  forecastLeft: {
    flex: 1,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  forecastRight: {
    alignItems: 'flex-end',
  },
  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tempHigh: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 36,
    textAlign: 'right',
  },
  tempLow: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },
});

export default WeatherCard;