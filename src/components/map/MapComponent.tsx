'use client'

import {Map, MapMarker, MapPopup, MapTileLayer, MapZoomControl} from "@/components/ui/map";
import { useEffect, useState } from "react";

interface MapComponentProps {
    location: { lat: number; lng: number } | null;
}

export default function MapComponent({ location }: MapComponentProps) {
    const defaultCenter: [number, number] = [43.6532, -79.3832];

    const mapCenter: [number, number] = location
        ? [location.lat, location.lng]
        : defaultCenter;

    return (

        <Map center={mapCenter} zoom={location ? 15 : 10}>
            <MapTileLayer/>
            <MapZoomControl/>

            {location && (
                <MapMarker position={mapCenter}>
                    <MapPopup>Вы находитесь здесь</MapPopup>
                </MapMarker>
            )}
        </Map>
    )
}