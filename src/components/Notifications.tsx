import {useEffect, useRef, useState} from "react";
import {Property} from "csstype";
import Order = Property.Order;

export default function Notifications({userId}: {userId: string}) {
    const socketRef = useRef<WebSocket | null>(null);
    const [wsStatus, setWsStatus] = useState("Connecting...");
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/order-ws?userId=${userId}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WS: Connected");
        };

        socket.onmessage = (event) => {
            try {
                setOrders(JSON.parse(event.data));
            } catch (err) {
                console.error("WS Parse Error:", err);
            }
        };

        socket.onclose = () => setWsStatus("Disconnected");
        socket.onerror = () => setWsStatus("Error");

        return () => {
            socket.close();
        };
    }, [])
    return (<div>Hello</div>)
}