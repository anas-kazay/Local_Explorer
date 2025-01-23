export interface Activity {
  id?: string;
  name: string;
  activity_to_do: string;
  reason: string;
  distance: number;
  suggestedTime: string;
  tag: string;
  position: {
    lat: number;
    lon: number;
  };
  address: string;
}

export interface WeatherData {
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
    }
  ];
  wind: {
    speed: number;
  };
  name: string;
}

export interface Preferences {
  _id: string;
  activity: string;
  placeName: string;
  latitude: number;
  longitude: number;
  address: string;
}
