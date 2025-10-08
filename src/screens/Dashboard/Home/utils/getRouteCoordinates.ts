const getRouteCoordinates = async (start: any, end: any) => {
    try {
        console.log('Fetching route from:', start, 'to:', end);

        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('OSRM Response:', data);

        if (data.routes && data.routes.length > 0) {
            const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => ({
                latitude: coord[1],  // OSRM returns [lng, lat], we need [lat, lng]
                longitude: coord[0]
            }));
            console.log('Route coordinates count:', coordinates.length);
            return coordinates;
        } else {
            console.log('No routes found');
            return [];
        }
    } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback to straight line if routing fails
        return [
            { latitude: start.latitude, longitude: start.longitude },
            { latitude: end.latitude, longitude: end.longitude }
        ];
    }
};

export default getRouteCoordinates;