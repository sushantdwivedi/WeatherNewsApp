import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { fetchWeather, WeatherData } from '../api/weatherApi';
import { fetchNews, NewsArticle } from '../api/newsApi';
import { Settings, TemperatureUnit, NewsCategory } from './types';
import { getNewsCategoryByWeather } from '../utils/helpers';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  hasPermission: boolean | null;
  isRequestingPermission: boolean;
  error: string | null;
}

interface AppContextProps {
  weather: WeatherData | null;
  news: NewsArticle[];
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  loading: boolean;
  locationState: LocationState;
  refreshData: () => Promise<void>;
  requestLocationPermission: () => Promise<void>;
  retryDataLoad: () => Promise<void>;
}

const defaultSettings: Settings = {
  temperatureUnit: 'celsius',
  newsCategories: ['general', 'technology', 'business', 'health'], // Updated to valid categories
};

const initialLocationState: LocationState = {
  latitude: null,
  longitude: null,
  hasPermission: null,
  isRequestingPermission: false,
  error: null,
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationState, setLocationState] = useState<LocationState>(initialLocationState);

  // Request location permission
  const requestLocationPermission = useCallback(async () => {
    if (locationState.isRequestingPermission) return;

    setLocationState(prev => ({ ...prev, isRequestingPermission: true, error: null }));

    try {
      // First check if we already have permission
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setLocationState(prev => ({ 
          ...prev, 
          hasPermission: true, 
          isRequestingPermission: false 
        }));
        return;
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setLocationState(prev => ({ 
          ...prev, 
          hasPermission: true, 
          isRequestingPermission: false 
        }));
      } else {
        const errorMessage = status === 'denied' 
          ? 'Location permission denied. Please enable location access in settings to get weather updates.'
          : 'Location permission not granted. Weather data requires location access.';
        
        setLocationState(prev => ({
          ...prev,
          hasPermission: false,
          isRequestingPermission: false,
          error: errorMessage,
        }));

        // Show alert for denied permission
        Alert.alert(
          'Location Permission Required',
          errorMessage,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Retry', 
              onPress: () => requestLocationPermission() 
            },
            {
              text: 'Settings',
              onPress: () => {
                // On iOS, this would open settings. For cross-platform, we just retry
                requestLocationPermission();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationState(prev => ({
        ...prev,
        hasPermission: false,
        isRequestingPermission: false,
        error: 'Failed to request location permission. Please try again.',
      }));
    }
  }, [locationState.isRequestingPermission]);

  // Get current location
  const getCurrentLocation = useCallback(async (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!locationState.hasPermission) {
      console.log('No location permission, cannot get location');
      return null;
    }

    try {
      setLocationState(prev => ({ ...prev, error: null }));

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000, // 15 second timeout
        maximumAge: 300000, // Accept cached location up to 5 minutes old
      });

      const { latitude, longitude } = location.coords;
      
      setLocationState(prev => ({
        ...prev,
        latitude,
        longitude,
        error: null,
      }));

      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting current location:', error);
      let errorMessage = 'Failed to get current location. ';
      
      if (error.code === 'E_LOCATION_TIMEOUT') {
        errorMessage += 'Location request timed out. Please check your GPS settings.';
      } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
        errorMessage += 'Location services are unavailable.';
      } else {
        errorMessage += 'Please ensure location services are enabled.';
      }

      setLocationState(prev => ({
        ...prev,
        error: errorMessage,
      }));

      return null;
    }
  }, [locationState.hasPermission]);

  // Load weather and news data
  const loadData = useCallback(async (forceRefresh = false) => {
    // Don't start loading if we don't have permission and aren't requesting it
    if (locationState.hasPermission === false && !locationState.isRequestingPermission) {
      console.log('No location permission, cannot load data');
      return;
    }

    // Don't start loading if permission is still being requested
    if (locationState.isRequestingPermission) {
      console.log('Still requesting permission, waiting...');
      return;
    }

    // Don't start loading if we don't have permission yet
    if (!locationState.hasPermission) {
      console.log('No location permission yet, cannot load data');
      return;
    }

    setLoading(true);

    try {
      // Get current location
      const coordinates = await getCurrentLocation();
      
      if (!coordinates) {
        console.log('No coordinates available, cannot fetch weather');
        setLoading(false);
        return;
      }

      const { latitude, longitude } = coordinates;

      // Fetch weather data
      console.log('Fetching weather data...');
      const weatherData = await fetchWeather(latitude, longitude);
      setWeather(weatherData);

      // Determine news category based on current temperature
      const tempC = weatherData.current_weather.temperature;
      const weatherCategory = getNewsCategoryByWeather(tempC);

      // Filter news categories based on user preferences and weather
      const filteredCategories = settings.newsCategories.includes(weatherCategory)
        ? [weatherCategory]
        : settings.newsCategories;

      // Fetch news for the first matching category
      console.log('Fetching news data...');
      const newsArticles = await fetchNews(filteredCategories[0] || 'general');
      setNews(newsArticles);

      console.log('Data loading completed successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Show user-friendly error
      Alert.alert(
        'Error Loading Data',
        'Failed to load weather and news data. Please check your internet connection and try again.',
        [
          { text: 'OK' },
          { text: 'Retry', onPress: () => loadData(true) }
        ]
      );
    } finally {
      setLoading(false);
    }
  }, [locationState.hasPermission, locationState.isRequestingPermission, getCurrentLocation, settings.newsCategories]);

  // Retry data loading (useful for error states)
  const retryDataLoad = useCallback(async () => {
    if (!locationState.hasPermission) {
      await requestLocationPermission();
      return;
    }
    await loadData(true);
  }, [locationState.hasPermission, requestLocationPermission, loadData]);

  // Refresh data (for pull-to-refresh)
  const refreshData = useCallback(async () => {
    if (!locationState.hasPermission) {
      await requestLocationPermission();
      return;
    }
    await loadData(true);
  }, [locationState.hasPermission, requestLocationPermission, loadData]);

  // Initial permission check on app start
  useEffect(() => {
    const checkInitialPermission = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (status === 'granted') {
          setLocationState(prev => ({ ...prev, hasPermission: true }));
        } else {
          setLocationState(prev => ({ ...prev, hasPermission: false }));
        }
      } catch (error) {
        console.error('Error checking initial location permission:', error);
        setLocationState(prev => ({ 
          ...prev, 
          hasPermission: false,
          error: 'Failed to check location permission status.'
        }));
      }
    };

    checkInitialPermission();
  }, []);

  // Load data when permission is granted
  useEffect(() => {
    if (locationState.hasPermission === true) {
      loadData();
    }
  }, [locationState.hasPermission, loadData]);

  // Reload data when settings change (but only if we have permission)
  useEffect(() => {
    if (locationState.hasPermission === true && weather) {
      // Only reload news when settings change, keep existing weather
      const loadNewsOnly = async () => {
        try {
          setLoading(true);
          const tempC = weather.current_weather.temperature;
          const weatherCategory = getNewsCategoryByWeather(tempC);
          const filteredCategories = settings.newsCategories.includes(weatherCategory)
            ? [weatherCategory]
            : settings.newsCategories;
          
          const newsArticles = await fetchNews(filteredCategories[0] || 'general');
          setNews(newsArticles);
        } catch (error) {
          console.error('Error reloading news:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadNewsOnly();
    }
  }, [settings, weather, locationState.hasPermission]);

  const contextValue: AppContextProps = {
    weather,
    news,
    settings,
    setSettings,
    loading,
    locationState,
    refreshData,
    requestLocationPermission,
    retryDataLoad,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};