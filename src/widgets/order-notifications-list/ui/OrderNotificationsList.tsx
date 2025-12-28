"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/shared/ui/button";
import { APPROVE_ORDER } from "@/features/order-management";
import { useMutation } from "@apollo/client/react";
import {useOrderSubscription} from "@/features/order-management/model/useOrderSocket";

export function OrderNotificationsList() {
    const [role, setRole] = useState(Cookies.get("role") || "");
    const { orders, setOrders, status, loading, error } = useOrderSubscription(role);
    const [approveOrder, { loading: approving }] = useMutation(APPROVE_ORDER);

    console.log(orders);

    const handleApprove = async (orderId: string) => {
        try {
            await approveOrder({
                variables: {
                    input: {
                        orderId,
                        driverId: Cookies.get("id"),
                        isApprove: true
                    }
                }
            });
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (err) {
            console.error(err);
        }
    };

    // Отображаем сообщения о состоянии подключения
    if (loading) {
        return (
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h2 className="text-lg font-bold mb-2">
                    {role === "ROLE_USER" ? "Order Status" : "New Orders"}
                </h2>
                <p className="text-xs mb-4">Подключение к серверу...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h2 className="text-lg font-bold mb-2">
                    {role === "ROLE_USER" ? "Order Status" : "New Orders"}
                </h2>
                <p className="text-xs mb-4 text-red-500">Ошибка подключения: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-lg font-bold mb-2">
                {role === "ROLE_USER" ? "Order Status" : "New Orders"}
            </h2>
            <p className="text-xs mb-4">Статус: {status}</p>

            <div className="space-y-3">
                {orders.length === 0 && <p className="text-gray-400 text-sm">Нет заказов...</p>}
                {orders.map((order) => (
                    <div key={order.id || order.orderId} className="flex items-center justify-between p-3 border rounded">
                        <div className="text-sm">
                            <p className="font-medium">От: {order.fromAddress || order.fromAddress}</p>
                            <p className="font-medium">До: {order.toAddress || order.finishAddress}</p>
                            <p className="text-xs text-gray-500">
                                Статус: {order.status || "ожидает"}
                            </p>
                            {order.progress && (
                                <p className="text-xs text-blue-500">Прогресс: {order.progress}%</p>
                            )}
                        </div>
                        {role === "ROLE_DRIVER" && order.id && (
                            <Button
                                size="sm"
                                onClick={() => handleApprove(order.id)}
                                disabled={approving}
                            >
                                {approving ? "..." : "Принять"}
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}