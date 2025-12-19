"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useLocation } from "@/hook/useLocation";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse" />
});

export default function DashboardPage() {
    const { location, getLocation, error, loading } = useLocation();
    const [taxis, setTaxis] = useState([]);
    const [wsStatus, setWsStatus] = useState("Connecting...");

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/taxi-ws");

        socket.onopen = () => setWsStatus("Connected");
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

        return () => socket.close();
    }, []);

    return (
        <>
            <Header />

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

                <div className="mt-4 w-full max-w-md">
                    <h3 className="font-bold mb-2">Такси поблизости ({taxis.length}):</h3>
                    <div className="max-h-40 overflow-y-auto border rounded p-2">
                        {taxis.map((t: any) => (
                            <div key={t.id} className="text-sm border-b last:border-0 py-1">
                                {t.driverName} - {t.licensePlate}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}