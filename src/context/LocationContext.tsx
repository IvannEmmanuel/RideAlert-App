import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { PermissionsAndroid } from "react-native";
import RNGetLocation from "react-native-get-location";

interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationContextType {
  location: Location | null;
  error: string | null;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  error: null,
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRequestingRef = useRef(false);
  const lastLocationTimeRef = useRef(0);
  const lastGoodLocationRef = useRef<Location | null>(null);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to track your position",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error("Permission error:", err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    if (isRequestingRef.current) return;

    const now = Date.now();
    if (now - lastLocationTimeRef.current < 4000) return;

    isRequestingRef.current = true;
    lastLocationTimeRef.current = now;

    try {
      const pos = await RNGetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      });

      const newLoc: Location = {
        latitude: pos.latitude,
        longitude: pos.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newLoc);
      setError(null);
      lastGoodLocationRef.current = newLoc;
    } catch (err: any) {
      handleError(err);
    } finally {
      isRequestingRef.current = false;
    }
  };

  const handleError = (err: any) => {
    if (err.code === "CANCELLED") return;
    if (err.code === "TIMEOUT") {
      if (lastGoodLocationRef.current) {
        setLocation(lastGoodLocationRef.current);
      }
      return;
    }
    const errorMap: Record<string, string> = {
      UNAVAILABLE: "Location services unavailable",
      UNAUTHORIZED: "Location permission denied",
    };
    setError(errorMap[err.code] || "Failed to get location");
  };

  const startUpdates = () => {
    getCurrentLocation();
    intervalRef.current = setInterval(getCurrentLocation, 5000);
  };

  const stopUpdates = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    isRequestingRef.current = false;
  };

  useEffect(() => {
    const init = async () => {
      const ok = await requestLocationPermission();
      if (ok) startUpdates();
      else setError("Location permission denied");
    };
    init();
    return stopUpdates;
  }, []);

  return (
    <LocationContext.Provider value={{ location, error }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
