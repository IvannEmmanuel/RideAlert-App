import { Image, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import availableBusStyle from '../../../styles/availableBus';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { getUser } from '../../../utils/authStorage'; // assuming you store fleet_id here
import { BASE_URL } from '../../../config/apiConfig';
import { useBus } from '../../../context/BusContext';

const { height } = Dimensions.get('window');

const AvailableBus = () => {
    const { setSelectedBus, setBuses: setGlobalBuses } = useBus();
    const navigation = useNavigation();
    const [isNotifyVisible, setIsNotifyVisible] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [buses, setLocalBuses] = useState<any[]>([]); // ✅ local state
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

    useEffect(() => {
        const connectWS = async () => {
            const user = await getUser();
            const fleetId = user?.fleet_id;

            if (!fleetId) {
                console.warn('No fleet_id found for user');
                return;
            }

            // ✅ Build the full URL dynamically
            const ws = new WebSocket(`${BASE_URL}/ws/vehicles/available/${fleetId}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to vehicle WebSocket', fleetId);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("🚍 Incoming buses:", data);  // 👈 check if bound_for is there
                    setLocalBuses(data);    // ✅ update local state for this screen
                    setGlobalBuses(data);   // ✅ also sync to global context
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
                    {/* All */}
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

                    {/* Igpit */}
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

                    {/* Bugo */}
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

                                {/* ✅ Bound For */}
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
                                        onPress={() => {
                                            if (bus.location) {
                                                setSelectedBus(bus); // ✅ update global context
                                                setGlobalBuses(prev => {
                                                    const exists = prev.find(b => b.id === bus.id);
                                                    if (exists) {
                                                        return prev.map(b => (b.id === bus.id ? bus : b));
                                                    }
                                                    return [...prev, bus];
                                                });
                                                navigation.navigate('Home');  // just go back
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
                    <Text style={availableBusStyle.rideText}>Ride Alert!</Text>
                    <View style={availableBusStyle.puvTextContainer}>
                        <Text style={availableBusStyle.puvText}>A PUV of </Text>
                        <Text style={availableBusStyle.puvTextBold}>{selectedRoute}</Text>
                        <Text style={availableBusStyle.puvText}> route is already </Text>
                        <Text style={availableBusStyle.puvTextBold}>100 meters</Text>
                        <Text style={availableBusStyle.puvText}> nearby you</Text>
                    </View>
                </Animated.View>
            )}
        </>
    );
};

export default AvailableBus;
