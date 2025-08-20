import { Image, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import React, { useState } from 'react';
import availableBusStyle from '../../../styles/availableBus';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const {height} = Dimensions.get('window');

const AvailableBus = () => {
    const navigation = useNavigation();
    const [isNotifyVisible, setIsNotifyVisible] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('');
    const slideAnim = useState(new Animated.Value(height))[0];

    const onPressBack = () => {
        navigation.navigate('Home');
    };

    const showNotification = (route) => {
        setSelectedRoute(route);
        setIsNotifyVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0, // Slide up to visible position
            duration: 300, // Animation duration in ms
            useNativeDriver: true, // Better performance
        }).start();
    };

    const hideNotification = () => {
        Animated.timing(slideAnim, {
            toValue: height, // Slide back down off-screen
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsNotifyVisible(false)); // Hide after animation
    };

    return (
        <>
            <View style={availableBusStyle.container}>
                {/* Top section */}
                <View style={availableBusStyle.topContainer}>
                    <TouchableOpacity onPress={onPressBack}>
                        <Image source={require('../../../images/back-arrow.png')} />
                    </TouchableOpacity>
                    <Text style={availableBusStyle.availableText}>Available Buses</Text>
                </View>

                {/* Filter */}
                <View style={availableBusStyle.filterContainer}>
                    <Text style={availableBusStyle.filterText}>All</Text>
                </View>

                {/* Bus Cards Row */}
                <View style={availableBusStyle.bussesRow}>
                    {[ // Example data for multiple bus cards
                        { route: 'Bugo-Igpit', status: 'Available', eta: '3 minutes' },
                        { route: 'Bugo-Igpit', status: 'Available', eta: '3 minutes' },
                    ].map((bus, index) => (
                        <View key={index} style={availableBusStyle.busRow}>
                            <View style={availableBusStyle.busContainer}>
                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>Route</Text>
                                    <Text style={availableBusStyle.valueText}>{bus.route}</Text>
                                </View>
                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>Status</Text>
                                    <Text style={[availableBusStyle.valueText, availableBusStyle.statusColor]}>
                                        {bus.status}
                                    </Text>
                                    <TouchableOpacity
                                        style={availableBusStyle.notifyButton}
                                        onPress={() => showNotification(bus.route)}
                                    >
                                        <Text style={availableBusStyle.notifyText}>Notify</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={availableBusStyle.rowContainer}>
                                    <Text style={availableBusStyle.labelText}>ETA</Text>
                                    <Text style={availableBusStyle.valueText}>{bus.eta}</Text>
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