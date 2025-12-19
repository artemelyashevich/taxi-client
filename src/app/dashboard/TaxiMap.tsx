"use client";

import { useEffect, useState } from "react";

export default function TaxiMap() {
    const [taxis, setTaxis] = useState([]);
    const [status, setStatus] = useState("Connecting...");

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/taxi-ws");

        socket.onopen = () => {
            setStatus("Connected");
            console.log("WebSocket Connected");
        };

        socket.onmessage = (event) => {
            try {
                console.log("Event", event.data);
                const data = JSON.parse(event.data);
                setTaxis(data);
            } catch (err) {
                console.error("Ошибка парсинга данных такси:", err);
            }
        };

        socket.onerror = (error) => {
            setStatus("Error");
            console.error("WebSocket Error:", error);
        };

        socket.onclose = () => {
            setStatus("Disconnected");
            console.log("WebSocket Closed");
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="p-4">
            <div className="mb-4">
                Статус: <span className={status === "Connected" ? "text-green-500" : "text-red-500"}>{status}</span>
            </div>

            <div className="grid gap-2">
                {
                    taxis.map((taxi: any) => (
                    <div key={taxi.id} className="border p-2 rounded shadow-sm">
                        <strong>{taxi.driverName}</strong> ({taxi.licensePlate}) <br />
                        Координаты: {taxi.location.x.toFixed(4)}, {taxi.location.y.toFixed(4)}
                    </div>
                ))}
                {taxis.length === 0 && <p>Такси на карте пока нет...</p>}
            </div>
        </div>
    );
}