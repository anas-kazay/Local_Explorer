import React, { useEffect, useState } from "react";
import axiosInstance from "../api";
import { Activity, Preferences } from "../types";
import { useNavigate } from "react-router-dom";
import MapIntegration from "./MapIntegration";

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

const FavoriteActivities: React.FC = () => {
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get("/preferences");
        // Transform preferences into Activity format
        const activities: Activity[] = response.data.preferences.map(
          (pref: Preferences) => ({
            id: pref._id,
            name: pref.activity,
            tag: pref.placeName,
            position: {
              lat: pref.latitude,
              lon: pref.longitude,
            },
            address: pref.address,
          })
        );
        setFavorites(activities);
        setLoading(false);
      } catch (err) {
        setError("Failed to load favorite activities");
        setLoading(false);
      }
    };
    fetchFavorites();

    const handleSwipe = (event: TouchEvent) => {
      if (event.changedTouches[0].clientX < 50) {
        handleHomeClick();
      }
    };

    window.addEventListener("touchend", handleSwipe);

    return () => {
      window.removeEventListener("touchend", handleSwipe);
    };
  }, [navigate]);

  const handleHomeClick = () => {
    setIsSliding(true);
    setTimeout(() => {
      navigate("/");
    }, 500); // Match this with CSS transition duration
  };

  const handleRemoveClick = (activity: Activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      await axiosInstance.delete(`/preferences/${activityToDelete.id}`);
      setFavorites(favorites.filter((fav) => fav.id !== activityToDelete.id));
      setShowDeleteModal(false);
      setActivityToDelete(null);
    } catch (err) {
      setError("Failed to remove activity");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const handleMapClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowMapModal(true);
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
    setSelectedActivity(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`transition-transform duration-500 ${
        isSliding ? "translate-x-[100%]" : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove " {activityToDelete?.tag}" from
              your favorites?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showMapModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {formatTag(selectedActivity.tag)}
              </h3>
              <button
                onClick={handleCloseMapModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full">
              <MapIntegration
                location={location}
                destination={{
                  latitude: selectedActivity.position.lat,
                  longitude: selectedActivity.position.lon,
                }}
                destinationName={formatTag(selectedActivity.tag)}
                showHeader={false}
              />
            </div>
          </div>
        </div>
      )}

      <div className="fixed left-4 top-4 z-50">
        <button
          onClick={handleHomeClick}
          className="relative flex items-center"
        >
          <div className="bg-white p-3 rounded-full shadow-lg flex items-center w-14 hover:w-48 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-indigo-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="ml-2 whitespace-nowrap text-gray-700 font-medium overflow-hidden">
              Back to Home
            </span>
          </div>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600">
            <h2 className="text-3xl font-bold text-white text-center">
              Your Favorite Places
            </h2>
          </div>

          {favorites.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-xl font-light">
                No favorite places added yet.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {favorites.map((activity) => (
                <li
                  key={activity.name}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-indigo-600">
                        {formatTag(activity.tag)}
                      </h3>
                      <p className="text-lg text-gray-600 font-medium">
                        {activity.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.address}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMapClick(activity)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveClick(activity)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteActivities;
