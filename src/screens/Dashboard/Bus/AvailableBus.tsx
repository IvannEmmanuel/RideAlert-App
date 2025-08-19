// AvailableBus.js
import { Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import availableBusStyle from '../../../styles/availableBus';
import { useNavigation } from '@react-navigation/native';

const AvailableBus = () => {
    const navigation = useNavigation();

    const onPressBack = () => {
        navigation.navigate('Home');
    }

    return (
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
            <View style={availableBusStyle.busRow}>
                <View style={availableBusStyle.busContainer}>
                    <Image
                        source={require('../../../images/Orotsco.jpg')}
                        style={availableBusStyle.orotscoPicture}
                    />
                    <View style={availableBusStyle.routeContainer}>
                        <Text style={availableBusStyle.leftText}>Route</Text>
                        <Text style={availableBusStyle.rightText}>Bugo-Igpit</Text>
                    </View>
                    <View style={availableBusStyle.routeContainer}>
                        <Text style={availableBusStyle.leftText}>Status</Text>
                        <Text style={availableBusStyle.statusText}>Available</Text>
                    </View>
                    <View style={availableBusStyle.routeContainer}>
                        <Text style={availableBusStyle.leftText}>ETA</Text>
                        <Text style={availableBusStyle.rightText}>3 min</Text>
                    </View>
                    <TouchableOpacity style={availableBusStyle.notifyContainer}>
                        <Text style={availableBusStyle.notifyText}>Notify Me</Text>
                    </TouchableOpacity>
                </View>

                <View style={availableBusStyle.busContainer}>
                    <Image
                        source={require('../../../images/Orotsco.jpg')}
                        style={availableBusStyle.orotscoPicture}
                    />
                    <View style={availableBusStyle.routeContainer}>
                        <Text style={availableBusStyle.leftText}>Route</Text>
                        <Text style={availableBusStyle.rightText}>Bugo-Igpit</Text>
                    </View>
                    <View style={availableBusStyle.routeContainer}>
                        <Text style={availableBusStyle.leftText}>Status</Text>
                        <Text style={availableBusStyle.statusTextOther}>Standing</Text>
                    </View>
                    <View style={availableBusStyle.routeContainer}>
                        <Text style={availableBusStyle.leftText}>ETA</Text>
                        <Text style={availableBusStyle.rightText}>3 min</Text>
                    </View>
                    <TouchableOpacity style={availableBusStyle.notifyContainer}>
                        <Text style={availableBusStyle.notifyText}>Notify Me</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AvailableBus;
