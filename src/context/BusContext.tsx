// context/BusContext.tsx
import React, { createContext, useState, useContext } from "react";

const BusContext = createContext(null);

export const BusProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [currentBusLocation, setCurrentBusLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

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