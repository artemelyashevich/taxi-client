import { useState, useEffect } from "react";

interface Location {
    lat: number;
    lng: number;
}

export function useLocation() {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            setError("Geolocation is not supported");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
    };

    return { location, error, loading, getLocation };
}