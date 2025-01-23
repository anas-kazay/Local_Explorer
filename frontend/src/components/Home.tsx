import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ActivityRecommendations from "./ActivityRecommendations";
import MapIntegration from "./MapIntegration";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useActivityContext } from "../context/AcitivityContext";
import LocalExploIcon from "../assets/Local_Explo2.png";
import { WeatherData } from "../types";

export default function Home() {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [destination, setDestination] = useState<GeolocationCoordinates | null>(
    null
  );
  const [isSliding, setIsSliding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [destinationName, setDestinationName] = useState<string>("");
  const navigate = useNavigate();

  const { weather, setWeatherData } = useActivityContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleFavoritesClick = () => {
    setIsSliding(true);
    setTimeout(() => {
      navigate("/favorites");
    }, 500); // Match this with CSS transition duration
  };

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
          fetchWeather(position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    }
  }, []);

  const fetchWeather = async (coords: GeolocationCoordinates) => {
    axios
      .post("api/api/weather", {
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
      .then((response) => {
        let data: WeatherData = response.data;
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
      });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="animate-pulse text-xl text-blue-600 font-semibold">
            Loading suggestion...
          </div>
          <div className="animate-spin h-6 w-6 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 to-white font-inter transition-transform duration-500 ${
        isSliding ? "translate-x-[-100%]" : ""
      }`}
    >
      <div className="flex justify-center mb-4">
        <img
          src={LocalExploIcon}
          alt="Local Explorer Logo"
          className="h-24 text-blue-800"
          style={{
            filter:
              "invert(27%) sepia(28%) saturate(2538%) hue-rotate(201deg) brightness(97%) contrast(90%)",
          }}
        />
      </div>
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-4">
        {isAuthenticated ? (
          <>
            <div className="w-48">
              <button
                onClick={handleFavoritesClick}
                className="w-full flex items-center justify-end"
              >
                <div className="bg-white p-3 rounded-full shadow-lg flex items-center w-14 hover:w-48 transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="ml-2 whitespace-nowrap text-gray-700 font-medium overflow-hidden">
                    Go to Favorites
                  </span>
                </div>
              </button>
            </div>
            <div className="w-48">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-end"
              >
                <div className="bg-white p-3 rounded-full shadow-lg flex items-center w-14 hover:w-48 transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="ml-2 whitespace-nowrap text-gray-700 font-medium overflow-hidden">
                    Logout
                  </span>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-full max-w-[250px]">
              <Link
                to="/login"
                className="w-full flex items-center justify-end"
              >
                <div className="bg-white p-3 rounded-full shadow-lg flex items-center w-14 hover:w-[250px] transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="ml-2 whitespace-nowrap text-gray-700 font-medium overflow-hidden">
                    Login to Your Account
                  </span>
                </div>
              </Link>
            </div>
            <div className="w-full max-w-[250px]">
              <Link
                to="/signup"
                className="w-full flex items-center justify-end"
              >
                <div className="bg-white p-3 rounded-full shadow-lg flex items-center w-14 hover:w-[250px] transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span className="ml-2 whitespace-nowrap text-gray-700 font-medium overflow-hidden">
                    Create New Account
                  </span>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="container mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            Welcome to Local Explorer
          </h1>
          <p className="text-gray-600">
            Discover amazing activities and places around you
          </p>
        </header>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Your Location & Weather
          </h2>

          <div className="space-y-4">
            {location && (
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">Location:</span>
                <span className="ml-2">
                  {location.latitude.toFixed(2)}°N,{" "}
                  {location.longitude.toFixed(2)}°E
                </span>
              </div>
            )}

            {weather && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-blue-800">
                      {weather.main.temp}°C
                    </span>
                    <span className="ml-2 text-gray-600 capitalize">
                      {weather.weather[0].description}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Wind Speed: {weather.wind.speed} m/s
                    </span>
                  </div>
                  <div className="mt-2 text-blue-700 font-medium">
                    {weather.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ActivityRecommendations
          location={location}
          weather={weather}
          setDestination={setDestination}
          setDestinationName={setDestinationName}
        />

        <div className="mb-8">
          <MapIntegration
            location={location}
            destination={destination}
            destinationName={destinationName}
          />
        </div>
      </div>
    </div>
  );
}
