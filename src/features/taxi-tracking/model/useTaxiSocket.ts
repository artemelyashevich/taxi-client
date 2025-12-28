import { useEffect, useState, useRef } from "react";

export function useTaxiSocket(userLocation: { lat: number; lng: number } | null) {
    const [taxis, setTaxis] = useState([]);
    const [status, setStatus] = useState("Connecting...");
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/taxi-ws");
        socketRef.current = socket;

        socket.onopen = () => setStatus("Connected");
        socket.onmessage = (e) => setTaxis(JSON.parse(e.data));
        socket.onclose = () => setStatus("Disconnected");
        socket.onerror = () => setStatus("Error");

        return () => socket.close();
    }, []);

    useEffect(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN && userLocation) {
            socketRef.current.send(JSON.stringify({
                latitude: userLocation.lat,
                longitude: userLocation.lng
            }));
        }
    }, [userLocation]);

    return { taxis, status };
}