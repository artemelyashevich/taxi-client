"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/Header";
import { useLocation } from "@/hook/useLocation";
import dynamic from 'next/dynamic';
import { CURRENT_USER } from "@/graphql/queries";
import {useQuery} from "@apollo/client/react";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse" />
});

export default function DashboardPage() {
    const { location, getLocation, error, loading } = useLocation();
    const [taxis, setTaxis] = useState([]);
    const [wsStatus, setWsStatus] = useState("Connecting...");

    const socketRef = useRef<WebSocket | null>(null);

    const sendLocation = (lat: number, lng: number) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({ latitude:lat, longitude: lng });
            socketRef.current.send(payload);
            console.log("WS: Sent location", payload);
        }
    };

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/taxi-ws");
        socketRef.current = socket;

        socket.onopen = () => {
            setWsStatus("Connected");
            console.log("WS: Connected");

            if (location) {
                sendLocation(location.lat, location.lng);
            }
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setTaxis(data);
            } catch (err) {
                console.error("WS Parse Error:", err);
            }
        };

        socket.onclose = () => setWsStatus("Disconnected");
        socket.onerror = () => setWsStatus("Error");

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        if (wsStatus === "Connected" && location) {
            sendLocation(location.lat, location.lng);
        }
    }, [location, wsStatus]);

    return (
        <div>

            <div className="absolute top-20 right-4 z-[1000] bg-white p-2 rounded shadow text-xs">
                WS: <span className={wsStatus === "Connected" ? "text-green-600" : "text-red-600"}>{wsStatus}</span>
            </div>

            <div className="h-[500px] w-full relative">
                <MapComponent userLocation={location} taxis={taxis} />
            </div>

            <div className="p-4 flex flex-col gap-2 items-center">
                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={getLocation}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Поиск..." : (location ? "Обновить местоположение" : "Найти меня")}
                </button>

                {/* Список такси для отладки */}
                <div className="mt-4 w-full max-w-md">
                    <h3 className="font-bold mb-2 text-center">Такси в эфире: {taxis.length}</h3>
                </div>
            </div>
        </div>
    );
}