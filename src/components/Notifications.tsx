import {useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import {Button} from "@/components/ui/button";
import {useMutation} from "@apollo/client/react";
import {APPROVE_ORDER} from "@/graphql/queries";

export default function Notifications() {
    const socketRef = useRef<WebSocket | null>(null);
    const [wsStatus, setWsStatus] = useState("Connecting...");
    const [orders, setOrders] = useState<any[]>([]);

    const [approveOrder, {loading: approving}] = useMutation(APPROVE_ORDER);
    const [role, setRole] = useState(Cookies.get("role"));

    useEffect(() => {
        const userId = Cookies.get("id");
        if (!userId) return;

        const socket = new WebSocket(`ws://localhost:8080/order-ws?userId=${userId}`);
        socketRef.current = socket;

        socket.onopen = () => {
            setWsStatus("Connected");
            console.log("WS: Connected");
        };

        socket.onmessage = (event) => {
            try {
                const newOrder = JSON.parse(event.data);
                console.log("New order received:", newOrder);

                setOrders(prev => {
                    if (role == "ROLE_DRIVER") {
                        const isDuplicate = prev.some(order => order.id === newOrder.id);
                        if (isDuplicate) return prev;
                        return [...prev, newOrder];
                    }
                    return [...prev, newOrder]
                });
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

    const handleApprove = async (orderId: string, userId: string) => {
        try {
            await approveOrder({
                variables: {
                    input: {
                        orderId: orderId,
                        driverId: Cookies.get("id"),
                        isApprove: true
                    }
                }
            });

            setOrders(prev => prev.filter(o => o.id !== orderId));
            alert("Order approved!");
        } catch (err) {
            console.error("Approve error:", err);
            alert("Failed to approve order");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{role === "ROLE_USER" ? "Check order status" : "Available Orders"}</h1>
            <p className="mb-2 text-sm">Status: <span className="font-mono">{wsStatus}</span></p>

            <div className="space-y-3">
                {orders.length === 0 && <p className="text-muted-foreground">Waiting for new orders...</p>}

                {orders.map((order) => (
                    <div
                        key={order.id + order?.status}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
                    >
                        <div className="grid gap-1">
                            <p className="text-xs font-mono text-gray-500">ID: {order.id}</p>
                            <p><strong>From:</strong> {order.startAddress || "Current location"}</p>
                            <p><strong>To:</strong> {order.finishAddress}</p>
                            {role === "ROLE_USER" && (<p>{order.status}</p>)}
                        </div>
                        {role === "ROLE_DRIVER" && <Button
                            onClick={() => handleApprove(order.id, order.userId)}
                            disabled={approving}
                        >
                            {approving ? "Approving..." : "Approve"}
                        </Button>}
                    </div>
                ))}
            </div>
        </div>
    );
}