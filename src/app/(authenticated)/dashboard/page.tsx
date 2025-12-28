import { TaxiMapWidget } from "@/widgets/taxi-map";
import {OrderNotificationsList} from "@/widgets/order-notifications-list/ui/OrderNotificationsList";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-5">
            <TaxiMapWidget />
            <OrderNotificationsList />
        </div>
    );
}