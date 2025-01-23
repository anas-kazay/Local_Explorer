import { useCallback, useState, useEffect } from "react";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  CollisionBehavior,
} from "@vis.gl/react-google-maps";

interface MapIntegrationProps {
  location: GeolocationCoordinates | null;
  destination: {
    latitude: number;
    longitude: number;
  } | null;
  destinationName?: string;
  showHeader?: boolean;
}

export default function MapIntegration({
  location,
  destination,
  destinationName,
  showHeader = true,
}: MapIntegrationProps) {
  const defaultLocation = { lat: 40.7128, lng: -74.006 }; // New York City
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [selectedMarkerType, setSelectedMarkerType] = useState<
    "location" | "destination"
  >("destination");
  const [bounds, setBounds] = useState<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center: defaultLocation,
    zoom: 15,
  });

  useEffect(() => {
    if (destination) {
      setBounds({
        center: { lat: destination.latitude, lng: destination.longitude },
        zoom: 15,
      });
    } else if (location) {
      setBounds({
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 15,
      });
    } else {
      setBounds({ center: defaultLocation, zoom: 15 });
    }
  }, [location, destination]);

  const onMarkerClick = useCallback(
    (
      marker: google.maps.marker.AdvancedMarkerElement,
      type: "location" | "destination"
    ) => {
      setSelectedMarker(marker);
      setSelectedMarkerType(type);
      setInfoWindowShown(true);
    },
    []
  );

  const handleInfowindowClose = useCallback(() => {
    setInfoWindowShown(false);
  }, []);

  const AdvancedMarkerWithRef = (props: any) => {
    const { onMarkerClick, markerType, ...markerProps } = props;
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
      <AdvancedMarker
        onClick={() => {
          if (marker) {
            onMarkerClick(marker, markerType);
          }
        }}
        ref={markerRef}
        {...markerProps}
      >
        <Pin
          background={markerType === "location" ? "#ff4444" : "#22ccff"}
          borderColor={markerType === "location" ? "#cc0000" : "#1e89a1"}
          glyphColor={markerType === "location" ? "#990000" : "#0f677a"}
        />
      </AdvancedMarker>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
      {showHeader && (
        <h2 className="text-xl font-semibold p-4">Your Location</h2>
      )}
      <div className="h-[400px] w-full">
        <APIProvider apiKey={"AIzaSyCAlCcxV3VZ1u2rQD6cMmAtTuJtxSAQZsM"}>
          <Map
            mapId={"bf51a910020fa25a"}
            style={{ width: "100%", height: "100%" }}
            defaultCenter={bounds.center}
            center={bounds.center}
            zoom={bounds.zoom}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
          >
            {location && showHeader && (
              <AdvancedMarkerWithRef
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
                onMarkerClick={onMarkerClick}
                markerType="location"
                collisionBehavior={
                  CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                }
              />
            )}

            {destination && (
              <AdvancedMarkerWithRef
                position={{
                  lat: destination.latitude,
                  lng: destination.longitude,
                }}
                onMarkerClick={onMarkerClick}
                markerType="destination"
                collisionBehavior={
                  CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                }
              />
            )}

            {infoWindowShown && selectedMarker && (
              <InfoWindow
                anchor={selectedMarker}
                pixelOffset={[0, -2]}
                onCloseClick={handleInfowindowClose}
              >
                <div>
                  <h2 className="font-bold">
                    {selectedMarkerType === "location"
                      ? "Your Location"
                      : destinationName || "Destination"}
                  </h2>
                  <p>
                    Lat:{" "}
                    {selectedMarkerType === "location"
                      ? location?.latitude.toFixed(6)
                      : destination?.latitude.toFixed(6)}
                  </p>
                  <p>
                    Lng:{" "}
                    {selectedMarkerType === "location"
                      ? location?.longitude.toFixed(6)
                      : destination?.longitude.toFixed(6)}
                  </p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
      {location && showHeader && (
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Latitude: {location.latitude.toFixed(6)}, Longitude:{" "}
            {location.longitude.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
