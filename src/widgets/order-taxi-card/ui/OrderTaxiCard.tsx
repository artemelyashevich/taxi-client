import { Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { OrderTaxiForm } from "@/features/order-taxi";

export function OrderTaxiCard() {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Order a Taxi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <OrderTaxiForm />
            </CardContent>
        </Card>
    );
}