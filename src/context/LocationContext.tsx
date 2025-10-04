import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { PermissionsAndroid } from "react-native";
import RNGetLocation from "react-native-get-location";
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

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


  const ensureLocationEnabled = async () => {
    try {
      await promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });
      console.log("✅ Location services enabled");
    } catch (err) {
      console.log("❌ User refused to enable location", err);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      const fineGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const coarseGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      return fineGranted || coarseGranted;
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
        timeout: 15000,
        maximumAge: 10000,
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
      if (ok) {
        await ensureLocationEnabled();   // 👈 Make sure GPS is ON
        startUpdates();
      } else {
        setError("Location permission denied");
      }
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
