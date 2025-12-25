"use client";

import { Map, MapMarker, MapPopup, MapTileLayer, MapZoomControl } from "@/shared/ui/map";

export default function TaxiLiveMap({ userLocation, taxis }: any) {
    const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [43.6532, -79.3832];
    return (
        <Map center={center} zoom={userLocation ? 15 : 10}>
            <MapTileLayer />
            <MapZoomControl />
            {userLocation && (
                <MapMarker position={[userLocation.lat, userLocation.lng]}><MapPopup>You</MapPopup></MapMarker>
            )}
            {taxis.map((taxi: any) => (
                <MapMarker key={taxi.id} position={[taxi.location.y, taxi.location.x]} icon={<div className="text-lg">🚕</div>}>
                    <MapPopup><strong>{taxi.driverName}</strong></MapPopup>
                </MapMarker>
            ))}
        </Map>
    );
}