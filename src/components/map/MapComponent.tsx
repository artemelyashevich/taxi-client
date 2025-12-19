'use client'

import { Map, MapMarker, MapPopup, MapTileLayer, MapZoomControl } from "@/components/ui/map";

export default function MapComponent({ userLocation, taxis }: any) {
    const defaultCenter: [number, number] = [43.6532, -79.3832];
    const mapCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : defaultCenter;

    return (
        <Map center={mapCenter} zoom={userLocation ? 15 : 10}>
            <MapTileLayer />
            <MapZoomControl />

            {userLocation && (
                <MapMarker position={[userLocation.lat, userLocation.lng]}>
                    <MapPopup>You are here</MapPopup>
                </MapMarker>
            )}

            {taxis.map((taxi: any) => (
                <MapMarker
                    key={taxi.id}
                    position={[taxi.location.y, taxi.location.x]}
                    icon={
                        <div className="taxi-move-smooth">
                            <div className="flex items-center justify-center w-8 h-8 text-lg">
                                🚕
                            </div>
                        </div>
                    }
                >
                    <MapPopup>
                        <strong>{taxi.driverName}</strong>
                    </MapPopup>
                </MapMarker>
            ))}
        </Map>
    );
}