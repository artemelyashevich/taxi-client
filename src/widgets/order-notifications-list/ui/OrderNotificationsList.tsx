"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/shared/ui/button";
import { useOrderSocket, APPROVE_ORDER } from "@/features/order-management";
import {useMutation} from "@apollo/client/react";

export function OrderNotificationsList() {
    const [role, setRole] = useState(Cookies.get("role") || "");
    const { orders, setOrders, status } = useOrderSocket(role);
    const [approveOrder, { loading: approving }] = useMutation(APPROVE_ORDER);

    const handleApprove = async (orderId: string) => {
        try {
            await approveOrder({
                variables: {
                    input: { orderId, driverId: Cookies.get("id"), isApprove: true }
                }
            });
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-lg font-bold mb-2">
                {role === "ROLE_USER" ? "Order Status" : "New Orders"}
            </h2>
            <p className="text-xs mb-4">Socket: {status}</p>

            <div className="space-y-3">
                {orders.length === 0 && <p className="text-gray-400 text-sm">No orders yet...</p>}
                {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="text-sm">
                            <p className="font-medium">To: {order.finishAddress}</p>
                            <p className="text-xs text-gray-500">Status: {order.status}</p>
                        </div>
                        {role === "ROLE_DRIVER" && (
                            <Button size="sm" onClick={() => handleApprove(order.id)} disabled={approving}>
                                {approving ? "..." : "Approve"}
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}