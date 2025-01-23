import React, { createContext, useContext, useState } from 'react';
import { Activity, WeatherData } from '../types';

interface ActivityContextType {
  favorites: Activity[];
  weather: WeatherData | null;
  addToFavorites: (activity: Activity) => void;
  removeFromFavorites: (activityName: string) => void;
  setWeatherData: (weather: WeatherData) => void;
}

const ActivityContext = createContext<
  ActivityContextType | undefined
>(undefined);

export const ActivityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const addToFavorites = (activity: Activity) => {
    if (!favorites.some((fav) => fav.name === activity.name)) {
      setFavorites((prevFavorites) => [...prevFavorites, activity]);
    }
  };

  const removeFromFavorites = (activityName: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.name !== activityName)
    );
  };

  const setWeatherData = (weatherData: WeatherData) => {
    setWeather(weatherData);
  };

  return (
    <ActivityContext.Provider
      value={{
        favorites,
        weather,
        addToFavorites,
        removeFromFavorites,
        setWeatherData,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivityContext = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error(
      'useActivityContext must be used within an ActivityProvider'
    );
  }
  return context;
};
