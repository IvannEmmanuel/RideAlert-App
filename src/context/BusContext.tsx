// context/BusContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { getUser } from "../utils/authStorage";
import { BASE_URL } from "../config/apiConfig";

const BusContext = createContext(null);

export const BusProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [currentBusLocation, setCurrentBusLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    const connect = async () => {
      const user = await getUser();
      if (!user?.fleet_id) return;

      const ws = new WebSocket(`wss://${BASE_URL}/ws/vehicles/available/${user.fleet_id}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setBuses(data);
        } catch (err) {
          console.error("WS parse error:", err);
        }
      };

      return () => ws.close();
    };

    connect();
  }, []);

  return (
    <BusContext.Provider value={{
      buses, setBuses,
      selectedBus, setSelectedBus,
      currentBusLocation, setCurrentBusLocation,
      routeCoordinates, setRouteCoordinates
    }}>
      {children}
    </BusContext.Provider>
  );
};

export const useBus = () => useContext(BusContext);