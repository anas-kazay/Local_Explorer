import { useState } from "react";
import axiosInstance from "../api";
import { Activity } from "../types";
import { useActivityContext } from "../context/AcitivityContext";
import { useNavigate } from "react-router-dom";

interface ActivityRecommendationsProps {
  location: GeolocationCoordinates | null;
  weather: any;
  setDestination: React.Dispatch<
    React.SetStateAction<GeolocationCoordinates | null>
  >;
  setDestinationName: React.Dispatch<React.SetStateAction<string>>;
  onGetSuggestion?: () => void;
}

const getSuggestion = async (
  latitude: number,
  longitude: number
): Promise<Activity> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post(
      "/suggestion",
      {
        latitude: latitude,
        longitude: longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.suggestion; // Adjusted to match the new response structure
  } catch (error) {
    console.error("Error getting suggestion:", error);
    throw error;
  }
};

const formatTag = (tag: string): string => {
  const tagMap: { [key: string]: string } = {
    cafe: "Café",
    restaurant: "Restaurant",
    "natural:beach": "Beach",
    pub: "Pub",
    cinema: "Cinema",
    gym: "Gym",
    place_of_worship: "Place of Worship",
    park: "Park",
    stadium: "Stadium",
  };

  return (
    tagMap[tag] ||
    tag
      .split(":")
      .pop()
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    tag
  );
};

const ActivityCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-xl">
    {children}
  </div>
);

const LoadingCard = () => (
  <div className="h-[400px] flex justify-center items-center">
    <div className="flex items-center gap-3">
      <div className="animate-pulse text-xl text-blue-600 font-semibold">
        Loading suggestion...
      </div>
      <div className="animate-spin h-6 w-6 border-4 border-blue-600 rounded-full border-t-transparent"></div>
    </div>
  </div>
);

export default function ActivityRecommendations({
  location,
  setDestination,
  weather,
  setDestinationName,
}: ActivityRecommendationsProps) {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { addToFavorites, favorites } = useActivityContext();
  const navigate = useNavigate();
  const [isSliding, setIsSliding] = useState(false);
  const [showNewCard, setShowNewCard] = useState(false);

  const fetchNewSuggestion = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSliding(true);
    setShowNewCard(true);

    setTimeout(async () => {
      setLoading(true);
      setIsSliding(false);

      try {
        const lo = location?.latitude ?? 0;
        const la = location?.longitude ?? 0;
        const suggestion = await getSuggestion(lo, la);
        setCurrentActivity(suggestion);
        setDestination({
          latitude: suggestion.position.lat,
          longitude: suggestion.position.lon,
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        } as GeolocationCoordinates);
        setDestinationName(suggestion.name);
      } catch (error) {
        console.error("Failed to fetch suggestion:", error);
      } finally {
        setLoading(false);
        setShowNewCard(false);
      }
    }, 500);
  };

  const handleAddToFavorites = async () => {
    if (!currentActivity?.name || !currentActivity.tag) return;
    const preference = {
      weatherData: weather,
      activity: currentActivity.activity_to_do,
      placeName: currentActivity.name + " (" + currentActivity.tag + ")",
      latitude: location?.latitude,
      longitude: location?.longitude,
      address: currentActivity.address,
    };
    if (currentActivity) {
      try {
        await axiosInstance.post("/preferences", preference);
        addToFavorites(currentActivity);
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000); // Hide after 3 seconds
      } catch (error) {
        console.error("Failed to add to favorites:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="relative">
        <ActivityCard>
          <LoadingCard />
        </ActivityCard>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="flex justify-center items-center h-32">
        <button
          onClick={fetchNewSuggestion}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Get Activity Suggestion
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {showSuccessPopup && (
        <div
          className="absolute top-0 left-0 right-0 z-50 bg-green-500 text-white p-4 rounded-t-xl text-center transform transition-all duration-300 animate-slideDown"
          style={{
            animation:
              "slideDown 0.3s ease-out, fadeOut 0.3s ease-in forwards 2.7s",
          }}
        >
          Activity added to favorites!
        </div>
      )}

      <div className="relative">
        {/* Main card */}
        <div
          className={`transform transition-all duration-500 ease-in-out ${
            isSliding
              ? "translate-x-full opacity-0 scale-95"
              : "translate-x-0 opacity-100 scale-100"
          }`}
        >
          <ActivityCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Suggested Activity
              </h2>
              <span className="text-sm text-gray-500">
                {favorites.length} activities saved
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {currentActivity.name} ({formatTag(currentActivity.tag)})
                </h3>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {currentActivity.activity_to_do}
                </p>
                <p className="text-gray-600 italic">{currentActivity.reason}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-medium text-gray-700">
                      {currentActivity.distance} km away
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Hours</p>
                    <p className="font-medium text-gray-700">
                      {currentActivity.suggestedTime}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-700">
                    {currentActivity.address}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6 gap-4">
                <button
                  onClick={handleAddToFavorites}
                  className="flex-1 bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Add to Favorites
                </button>
                <button
                  onClick={fetchNewSuggestion}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Skip & Get New Suggestion
                </button>
              </div>
            </div>
          </ActivityCard>
        </div>

        {/* Loading card (appears during transition) */}
        <div
          className={`absolute top-0 left-0 w-full transform transition-all duration-500 ease-in-out ${
            showNewCard
              ? "translate-x-0 opacity-100 scale-100"
              : "-translate-x-full opacity-0 scale-95"
          }`}
        >
          <ActivityCard>
            <LoadingCard />
          </ActivityCard>
        </div>
      </div>
    </div>
  );
}
