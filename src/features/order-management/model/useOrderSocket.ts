import { useEffect, useState, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { gql } from "@apollo/client";
import { useSubscription } from "@apollo/client/react";

// GraphQL подписки
const NEW_ORDERS_SUBSCRIPTION = gql`
  subscription NewOrders {
    newOrders
  }
`;

const ORDER_STATUS_UPDATES_SUBSCRIPTION = gql`
  subscription OrderStatusUpdates($userId: ID!) {
    orderStatusUpdates(userId: $userId)
  }
`;

const DRIVER_ORDER_NOTIFICATIONS_SUBSCRIPTION = gql`
  subscription DriverOrderNotifications($driverId: ID!) {
    driverOrderNotifications(driverId: $driverId)
  }
`;

export function useOrderSubscription(role: string) {
    const [orders, setOrders] = useState<any[]>([]);
    const [status, setStatus] = useState<"Connecting..." | "Connected" | "Disconnected">("Connecting...");

    const userId = Cookies.get("id");
    const userRole = Cookies.get("role") || role;

    // Используем useMemo для стабильных значений
    const { subscription, variables } = useMemo(() => {
        let subscription = null;
        let variables = {};

        console.log("🔄 Determining subscription for:", { userRole, userId });

        if (userRole === "ROLE_DRIVER" && userId) {
            console.log("🚕 Using DRIVER_ORDER_NOTIFICATIONS_SUBSCRIPTION");
            subscription = DRIVER_ORDER_NOTIFICATIONS_SUBSCRIPTION;
            variables = { driverId: userId };
        } else if (userRole === "ROLE_USER" && userId) {
            console.log("👤 Using ORDER_STATUS_UPDATES_SUBSCRIPTION");
            subscription = ORDER_STATUS_UPDATES_SUBSCRIPTION;
            variables = { userId };
        } else if (userRole === "ROLE_DRIVER") {
            console.log("🚖 Using NEW_ORDERS_SUBSCRIPTION");
            subscription = NEW_ORDERS_SUBSCRIPTION;
        } else {
            console.log("❌ No subscription selected");
        }

        return { subscription, variables };
    }, [userRole, userId]);

    const shouldSkip = useMemo(() => {
        const skip = !subscription || (userRole === "ROLE_DRIVER" && !userId && subscription !== NEW_ORDERS_SUBSCRIPTION);
        console.log("⏭️ Should skip:", skip);
        return skip;
    }, [subscription, userRole, userId]);

    // Используем data напрямую из useSubscription
    const { data, loading, error } = useSubscription(subscription, {
        variables,
        skip: shouldSkip,
        onComplete: () => {
            console.log("🔚 Subscription completed");
            setStatus("Disconnected");
        },
        onError: (err) => {
            console.error("❌ Subscription error:", err);
            setStatus("Disconnected");
        }
    });

    // Обрабатываем данные когда они приходят через data
    useEffect(() => {
        console.log("📦 Data received from subscription:", data);

        if (!data) return;

        setStatus("Connected");

        let notificationData = null;

        // Извлекаем данные из подписки
        if (userRole === "ROLE_DRIVER" && subscription === DRIVER_ORDER_NOTIFICATIONS_SUBSCRIPTION) {
            notificationData = data.driverOrderNotifications;
            console.log("🚕 Driver notification data:", notificationData);
        } else if (userRole === "ROLE_DRIVER" && subscription === NEW_ORDERS_SUBSCRIPTION) {
            notificationData = data.newOrders;
            console.log("🚖 New orders data:", notificationData);
        } else if (userRole === "ROLE_USER") {
            notificationData = data.orderStatusUpdates;
            console.log("👤 User status update data:", notificationData);
        }

        if (notificationData) {
            // Проверяем, является ли notificationData объектом или строкой JSON
            let orderData;
            if (typeof notificationData === 'string') {
                try {
                    orderData = JSON.parse(notificationData);
                    console.log("📝 Parsed JSON string:", orderData);
                } catch (e) {
                    console.error("❌ Failed to parse JSON:", e);
                    orderData = {
                        id: `error-${Date.now()}`,
                        error: "Invalid JSON",
                        raw: notificationData
                    };
                }
            } else if (notificationData && typeof notificationData === 'object') {
                orderData = notificationData;
                console.log("📦 Using object directly:", orderData);
            } else {
                console.error("❌ Unexpected notification data type:", typeof notificationData, notificationData);
                orderData = {
                    id: `unknown-${Date.now()}`,
                    error: "Unexpected data type",
                    raw: notificationData
                };
            }

            console.log("🔄 Final order data to process:", orderData);

            setOrders(prev => {
                // Определяем ID заказа
                const orderId = orderData.id || orderData.orderId || `auto-${Date.now()}`;

                // Проверяем, есть ли уже такой заказ
                const existingIndex = prev.findIndex(o =>
                    (o.id === orderId) ||
                    (o.orderId === orderId) ||
                    (o.id === orderData.id) ||
                    (o.orderId === orderData.orderId)
                );

                console.log("📊 Order processing:", {
                    orderId,
                    exists: existingIndex >= 0,
                    existingIndex,
                    previousOrdersCount: prev.length,
                    userRole
                });

                if (existingIndex >= 0) {
                    // Обновляем существующий заказ
                    console.log("🔄 Updating existing order at index:", existingIndex);
                    const updated = [...prev];
                    updated[existingIndex] = { ...updated[existingIndex], ...orderData };
                    return updated;
                } else {
                    // Добавляем новый заказ
                    console.log("➕ Adding new order:", orderId);
                    const newOrder = {
                        ...orderData,
                        id: orderId,
                        // Добавляем timestamp для отладки
                        _receivedAt: new Date().toISOString()
                    };
                    return [...prev, newOrder];
                }
            });
        } else {
            console.log("⚠️ No notification data in subscription response");
        }
    }, [data, subscription, userRole]);

    useEffect(() => {
        console.log("🔄 Hook effect:", {
            loading,
            error: error?.message,
            data: !!data,
            userId,
            status,
            ordersCount: orders.length
        });

        if (loading && userId) {
            setStatus("Connecting...");
        } else if (error) {
            console.error("❌ Subscription error in effect:", error);
            setStatus("Disconnected");
        }

        // Очистка при размонтировании
        return () => {
            console.log("🧹 Cleaning up subscription hook");
        };
    }, [loading, error, data, userId, status]);

    console.log("📤 Hook returning:", {
        ordersCount: orders.length,
        orders,
        status,
        loading,
        error: error?.message,
        hasSubscription: !!subscription,
        userId,
        userRole
    });

    return {
        orders,
        setOrders,
        status,
        loading,
        error
    };
}