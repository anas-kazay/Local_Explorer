export type Weather_Type = {
  temp: number;
  description: string;
  windSpeed: number;
  name: string;
};

export type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export interface Activity {
  id: string;
  name: string;
  distance: number;
  tag: string;
  reason: string;
  position: {
    lat: number;
    lon: number;
  };
  suggestedTime: string;
  activity_to_do: string;
}

type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy';
type Temperature = 'cold' | 'hot' | 'medium';
type TimeOfDay =
  | 'morning'
  | 'noon'
  | 'evening'
  | 'night'
  | 'after midnight';

export interface Preferences {
  _id: string;
  weather: Weather;
  temperature: Temperature;
  activity: string;
  time: TimeOfDay;
  placeName: string;
  latitude: number;
  longitude: number;
  createdAt?: Date; // Added by mongoose timestamps
  updatedAt?: Date; // Added by mongoose timestamps
}
