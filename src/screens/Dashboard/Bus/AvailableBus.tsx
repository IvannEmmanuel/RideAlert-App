"use client"

import { Image, Text, TouchableOpacity, View, Animated, Dimensions, AppState } from "react-native"
import { useState, useEffect, useRef, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import availableBusStyle from "../../../styles/availableBus"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import LottieView from "lottie-react-native"
import { getUser, getToken } from "../../../utils/authStorage"
import { BASE_URL } from "../../../config/apiConfig"
import { useBus } from "../../../context/BusContext"

const { height, width } = Dimensions.get("window")

const CACHE_KEY = "cached_buses_data"

const AvailableBus = () => {
  const { setSelectedBus, setBuses: setGlobalBuses, buses: globalBuses } = useBus()
  const navigation = useNavigation()
  const [isNotifyVisible, setIsNotifyVisible] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState("")
  const [buses, setLocalBuses] = useState<any[]>([])
  const slideAnim = useState(new Animated.Value(height))[0]
  const wsRef = useRef<WebSocket | null>(null)
  const [filter, setFilter] = useState<"All" | "IGPIT" | "BUGO">("All")
  const appStateRef = useRef(AppState.currentState)
  const isMountedRef = useRef(true)
  const fleetIdRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  const onPressBack = useCallback(() => {
    navigation.navigate("Home")
  }, [navigation])

  const showNotification = useCallback(
    (route: string) => {
      setSelectedRoute(route)
      setIsNotifyVisible(true)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    },
    [slideAnim],
  )

  const hideNotification = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsNotifyVisible(false))
  }, [slideAnim])

  const cacheBusesData = useCallback(async (busesData: any[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(busesData))
    } catch (error) {
      // Silently fail
    }
  }, [])

  const loadCachedBuses = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY)
      if (cached && isMountedRef.current) {
        const busesData = JSON.parse(cached)
        setLocalBuses(busesData)
        setGlobalBuses(busesData)
        setHasData(busesData.length > 0)
        return busesData
      }
    } catch (error) {
      // Silently fail
      setHasData(false)
    }
    setHasData(false)
    return null
  }, [setGlobalBuses])

  const toggleNotify = async (vehicleId: string, enable: boolean) => {
    try {
      const token = await getToken();
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${BASE_URL}/users/toggle-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notify: enable,
          vehicle_id: vehicleId
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Notify status updated:', data);
        return true;
      } else {
        const error = await response.json();
        console.error('❌ Failed to update notify status:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error toggling notify:', error);
      return false;
    }
  };

  const initWebSocket = useCallback(
    (fleetId: string) => {
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
        wsRef.current = null
      }

      const wsUrl = `${BASE_URL}/ws/vehicles/available/${fleetId}`

      setLoading(true)

      try {
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          if (isMountedRef.current) {
            setLoading(false)
          }
        }

        ws.onmessage = (event) => {
          if (!isMountedRef.current) return

          try {
            const data = JSON.parse(event.data)
            console.log("Received buses data:", data) // ADD THIS LINE
            setLocalBuses(data.vehicles || data)
            setGlobalBuses(data.vehicles || data)
            setHasData((data.vehicles || data).length > 0)
            cacheBusesData(data.vehicles || data)
          } catch (err) {
            // Silently fail
          }
        }

        ws.onerror = () => {
          if (isMountedRef.current) {
            setLoading(false)
            setHasData(false)
          }
        }

        ws.onclose = () => {
          wsRef.current = null
          if (isMountedRef.current) {
            setLoading(false)
          }
        }

        wsRef.current = ws
      } catch (error) {
        if (isMountedRef.current) {
          setLoading(false)
          setHasData(false)
        }
      }
    },
    [setGlobalBuses, cacheBusesData],
  )

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  // App state handler
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
        const cachedData = await loadCachedBuses()
        if (fleetIdRef.current) {
          initWebSocket(fleetIdRef.current)
        }
      } else if (nextAppState === "background") {
        cleanup()
      }
      appStateRef.current = nextAppState
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)
    return () => subscription.remove()
  }, [loadCachedBuses, initWebSocket, cleanup])

  // Screen focus handler
  useFocusEffect(
    useCallback(() => {
      loadCachedBuses()

      if (fleetIdRef.current && !wsRef.current) {
        initWebSocket(fleetIdRef.current)
      }

      return () => {
        // Keep connections alive when navigating away
      }
    }, [loadCachedBuses, initWebSocket]),
  )

  // Initial setup
  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      const user = await getUser()
      const fleetId = user?.fleet_id

      if (!fleetId) {
        setLoading(false)
        setHasData(false)
        return
      }

      fleetIdRef.current = fleetId

      const cachedData = await loadCachedBuses()

      // Initialize WebSocket connection
      initWebSocket(fleetId)
    }

    initialize()

    return () => {
      isMountedRef.current = false
      cleanup()
    }
  }, [loadCachedBuses, initWebSocket, cleanup])

  // Sync with global context
  useEffect(() => {
    if (globalBuses && globalBuses.length > 0) {
      const hasChanged = JSON.stringify(buses) !== JSON.stringify(globalBuses)
      if (hasChanged) {
        setLocalBuses(globalBuses)
        setHasData(globalBuses.length > 0)
      }
    }
  }, [globalBuses, buses])

  const filteredBuses = filter === "All" ? buses : buses.filter((bus) => bus.bound_for?.toUpperCase() === filter)

  const handleNotifyPress = useCallback(
    async (bus: any) => {
      if (!bus.location) {
        console.warn("This bus has no location yet.")
        return
      }

      const success = await toggleNotify(bus.id, true)

      if (success) {
        setSelectedBus(bus)
        setGlobalBuses((prev) => {
          const exists = prev.find((b) => b.id === bus.id)
          if (exists) {
            return prev.map((b) => (b.id === bus.id ? bus : b))
          }
          return [...prev, bus]
        })

        showNotification(bus.route)

        setTimeout(() => {
          hideNotification()
          navigation.navigate("Home")
        }, 2000)
      }
    },
    [toggleNotify, setSelectedBus, setGlobalBuses, showNotification, hideNotification, navigation],
  )

  return (
    <>
      <View style={availableBusStyle.container}>
        <View style={availableBusStyle.topContainer}>
          <TouchableOpacity onPress={onPressBack}>
            <Image source={require("../../../images/back-arrow.png")} />
          </TouchableOpacity>
          <Text style={availableBusStyle.availableText}>Available Buses</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[availableBusStyle.filterContainer, filter === "All" && availableBusStyle.activeFilterButton]}
            onPress={() => setFilter("All")}
          >
            <Text style={[availableBusStyle.filterText, filter === "All" && availableBusStyle.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[availableBusStyle.filterContainer, filter === "IGPIT" && availableBusStyle.activeFilterButton]}
            onPress={() => setFilter("IGPIT")}
          >
            <Text style={[availableBusStyle.filterText, filter === "IGPIT" && availableBusStyle.activeFilterText]}>
              Igpit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[availableBusStyle.filterContainer, filter === "BUGO" && availableBusStyle.activeFilterButton]}
            onPress={() => setFilter("BUGO")}
          >
            <Text style={[availableBusStyle.filterText, filter === "BUGO" && availableBusStyle.activeFilterText]}>
              Bugo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={availableBusStyle.bussesRow}>
          {loading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <LottieView
                source={require("../../../images/Loading.json")}
                autoPlay
                loop
                style={{ width: width * 0.7, height: height * 0.7 }}
              />
            </View>
          ) : !hasData && filteredBuses.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <LottieView
                source={require("../../../images/EmptyState.json")}
                autoPlay
                loop
                style={{ width: width * 0.7, height: height * 0.7 }}
              />
              <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>No buses available at the moment</Text>
            </View>
          ) : filteredBuses.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <LottieView
                source={require("../../../images/EmptyState.json")}
                autoPlay
                loop
                style={{ width: width * 0.7, height: height * 0.7 }}
              />
              <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>No {filter} buses available</Text>
            </View>
          ) : (
            filteredBuses.map((bus, index) => (
              <View key={bus.id || index} style={availableBusStyle.busRow}>
                <View style={availableBusStyle.busContainer}>
                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Route</Text>
                    <Text style={availableBusStyle.valueText}>{bus.route}</Text>
                  </View>

                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Bound For</Text>
                    <Text style={availableBusStyle.valueText}>{bus.bound_for || "N/A"}</Text>
                  </View>

                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Status</Text>
                    <Text
                      style={[
                        availableBusStyle.valueText,
                        // Check status_details FIRST
                        bus.status_details === "standing"
                          ? availableBusStyle.standbyStatus
                          : bus.status_details === "standby"
                            ? availableBusStyle.standbyStatus
                            : // Then check status
                            bus.status === "available"
                              ? availableBusStyle.availableStatus
                              : bus.status === "full"
                                ? availableBusStyle.fullStatus
                                : availableBusStyle.otherStatus,
                      ]}
                    >
                      {bus.status?.toUpperCase()} | {bus.status_details?.toUpperCase() || "N/A"}
                    </Text>
                    <TouchableOpacity
                      style={[
                        availableBusStyle.notifyButton,
                        (bus.status === "full" || !bus.location) && availableBusStyle.disabledNotifyButton,
                      ]}
                      onPress={() => handleNotifyPress(bus)}
                      disabled={bus.status === "full" || !bus.location}
                    >
                      <Text
                        style={[
                          availableBusStyle.notifyText,
                          (bus.status === "full" || !bus.location) && availableBusStyle.disabledNotifyText,
                        ]}
                      >
                        {bus.status === "full" ? "Full" : "Notify"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Available Seats</Text>
                    <Text style={availableBusStyle.valueText}>{bus.available_seats}</Text>
                  </View>
                  {/* <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Plate</Text>
                    <Text style={availableBusStyle.valueText}>{bus.plate}</Text>
                  </View> */}
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {isNotifyVisible && (
        <Animated.View style={[availableBusStyle.notifyContainer, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={hideNotification}>
            <Image source={require("../../../images/close.png")} style={availableBusStyle.closePic} />
          </TouchableOpacity>
          <LottieView
            source={require("../../../images/Notify.json")}
            autoPlay
            loop
            style={availableBusStyle.lottieContainer}
          />
          <Text style={availableBusStyle.rideText}>Ride Alert Enabled!</Text>
          <View style={availableBusStyle.puvTextContainer}>
            <Text style={availableBusStyle.puvText}>You will be notified when a </Text>
            <Text style={availableBusStyle.puvTextBold}>{selectedRoute}</Text>
            <Text style={availableBusStyle.puvText}> bus is nearby!</Text>
          </View>
        </Animated.View>
      )}
    </>
  )
}

export default AvailableBus
