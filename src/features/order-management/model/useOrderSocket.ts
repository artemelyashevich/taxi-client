import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useOrderSocket(role: string) {
    const [orders, setOrders] = useState<any[]>([]);
    const [status, setStatus] = useState("Connecting...");

    useEffect(() => {
        const userId = Cookies.get("id");
        if (!userId) return;

        const socket = new WebSocket(`ws://localhost:8080/order-ws?userId=${userId}`);

        socket.onopen = () => setStatus("Connected");
        socket.onmessage = (event) => {
            const newOrder = JSON.parse(event.data);
            setOrders(prev => {
                if (role === "ROLE_DRIVER") {
                    if (prev.some(o => o.id === newOrder.id)) return prev;
                    return [...prev, newOrder];
                }
                return [...prev, newOrder];
            });
        };
        socket.onclose = () => setStatus("Disconnected");

        return () => socket.close();
    }, [role]);

    return { orders, setOrders, status };
}