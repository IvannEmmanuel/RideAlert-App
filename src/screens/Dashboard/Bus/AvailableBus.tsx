import { Image, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import availableBusStyle from '../../../styles/availableBus';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { getUser, getToken } from '../../../utils/authStorage';
import { BASE_URL } from '../../../config/apiConfig';
import { useBus } from '../../../context/BusContext';

const { height } = Dimensions.get('window');

const AvailableBus = () => {
    const { setSelectedBus, setBuses: setGlobalBuses } = useBus();
    const navigation = useNavigation();
    const [isNotifyVisible, setIsNotifyVisible] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [buses, setLocalBuses] = useState<any[]>([]);
    const slideAnim = useState(new Animated.Value(height))[0];
    const wsRef = useRef<WebSocket | null>(null);
    const [filter, setFilter] = useState<'All' | 'IGPIT' | 'BUGO'>('All');

    const onPressBack = () => {
        navigation.navigate('Home');
    };

    const showNotification = (route: string) => {
        setSelectedRoute(route);
        setIsNotifyVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideNotification = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsNotifyVisible(false));
    };

    // ✅ Function to toggle notify status
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

    useEffect(() => {
        const connectWS = async () => {
            const user = await getUser();
            const fleetId = user?.fleet_id;

            if (!fleetId) {
                console.warn('No fleet_id found for user');
                return;
            }

            const ws = new WebSocket(`${BASE_URL}/ws/vehicles/available/${fleetId}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to vehicle WebSocket', fleetId);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("🚍 Incoming buses:", data);
                    setLocalBuses(data);
                    setGlobalBuses(data);
                } catch (err) {
                    console.error('Error parsing WS message', err);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error', error);
            };

            ws.onclose = () => {
                console.log('Vehicle WebSocket closed');
            };
        };

        connectWS();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const filteredBuses = filter === 'All'
        ? buses
        : buses.filter(bus => bus.bound_for?.toUpperCase() === filter);

    return (
        <>
            <View style={availableBusStyle.container}>
                <View style={availableBusStyle.topContainer}>
                    <TouchableOpacity onPress={onPressBack}>
                        <Image source={require('../../../images/back-arrow.png')} />
                    </TouchableOpacity>
                    <Text style={availableBusStyle.availableText}>Available Buses</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={[
                            availableBusStyle.filterContainer,
                            filter === 'All' && availableBusStyle.activeFilterButton
                        ]}
                        onPress={() => setFilter('All')}
                    >
                        <Text
                            style={[
                                availableBusStyle.filterText,
                                filter === 'All' && availableBusStyle.activeFilterText
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            availableBusStyle.filterContainer,
                            filter === 'IGPIT' && availableBusStyle.activeFilterButton
                        ]}
                        onPress={() => setFilter('IGPIT')}
                    >
                        <Text
                            style={[
                                availableBusStyle.filterText,
                                filter === 'IGPIT' && availableBusStyle.activeFilterText
                            ]}
                        >
                            Igpit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            availableBusStyle.filterContainer,
                            filter === 'BUGO' && availableBusStyle.activeFilterButton
                        ]}
                        onPress={() => setFilter('BUGO')}
                    >
                        <Text
                            style={[
                                availableBusStyle.filterText,
                                filter === 'BUGO' && availableBusStyle.activeFilterText
                            ]}
                        >
                            Bugo
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={availableBusStyle.bussesRow}>
                    {filteredBuses.map((bus, index) => (
                        <View key={bus.id || index} style={availableBusStyle.busRow}>
                            <View style={availableBusStyle.busContainer}>
                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>Route</Text>
                                    <Text style={availableBusStyle.valueText}>{bus.route}</Text>
                                </View>

                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>Bound For</Text>
                                    <Text style={availableBusStyle.valueText}>{bus.bound_for || 'N/A'}</Text>
                                </View>

                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>Status</Text>
                                    <Text style={[
                                        availableBusStyle.valueText,
                                        availableBusStyle.statusColor
                                    ]}>
                                        {bus.status}
                                    </Text>
                                    <TouchableOpacity
                                        style={availableBusStyle.notifyButton}
                                        onPress={async () => {
                                            if (bus.location) {
                                                // ✅ Enable notifications for this vehicle
                                                const success = await toggleNotify(bus.id, true);
                                                
                                                if (success) {
                                                    setSelectedBus(bus);
                                                    setGlobalBuses(prev => {
                                                        const exists = prev.find(b => b.id === bus.id);
                                                        if (exists) {
                                                            return prev.map(b => (b.id === bus.id ? bus : b));
                                                        }
                                                        return [...prev, bus];
                                                    });
                                                    
                                                    // Show confirmation animation
                                                    showNotification(bus.route);
                                                    
                                                    // Navigate back after 2 seconds
                                                    setTimeout(() => {
                                                        hideNotification();
                                                        navigation.navigate('Home');
                                                    }, 2000);
                                                } else {
                                                    console.error('Failed to enable notifications');
                                                }
                                            } else {
                                                console.warn("This bus has no location yet.");
                                            }
                                        }}
                                    >
                                        <Text style={availableBusStyle.notifyText}>Notify</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>Available Seats</Text>
                                    <Text style={availableBusStyle.valueText}>{bus.available_seats}</Text>
                                </View>
                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>Plate</Text>
                                    <Text style={availableBusStyle.valueText}>{bus.plate}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {isNotifyVisible && (
                <Animated.View
                    style={[
                        availableBusStyle.notifyContainer,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <TouchableOpacity onPress={hideNotification}>
                        <Image
                            source={require('../../../images/close.png')}
                            style={availableBusStyle.closePic}
                        />
                    </TouchableOpacity>
                    <LottieView
                        source={require('../../../images/Notify.json')}
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
    );
};

export default AvailableBus;