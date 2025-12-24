"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { BOOK_CAR } from "@/graphql/queries";
import { useLocation } from "@/hook/useLocation";
import { MapPin, Navigation } from "lucide-react";

export function OrderTaxiForm() {
    const [formData, setFormData] = useState({
        passengerName: "",
        destinationAddress: "",
        note: ""
    });

    const { loading: locationLoading, location, getLocation } = useLocation();

    useEffect(() => {
        getLocation();
    }, []);

    const [bookTaxi, { loading, error, data }] = useMutation(BOOK_CAR);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!location) {
            alert("Location not found");
            return;
        }

        await bookTaxi({
            variables: {
                input: {
                    finishAddress: formData.destinationAddress,
                    startLocation: {
                        x: location.lng,
                        y: location.lat
                    }
                }
            }
        });
    };
    if (locationLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-sm text-muted-foreground animate-pulse">
                    Pinpointing your current location...
                </p>
            </div>
        );
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Order a Taxi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Pickup Location</FieldLabel>
                            <div className="flex items-center gap-2 p-2 border rounded-md bg-slate-50">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className="text-sm">
                                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Location not found"}
                                </span>
                            </div>
                            <FieldDescription>Your current position is detected automatically.</FieldDescription>
                        </Field>

                        {/* Passenger Name */}
                        <Field>
                            <FieldLabel htmlFor="passengerName">Passenger Name</FieldLabel>
                            <Input
                                name="passengerName"
                                id="passengerName"
                                type="text"
                                placeholder="Who is riding?"
                                onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                                required
                            />
                        </Field>

                        {/* Destination */}
                        <Field>
                            <FieldLabel htmlFor="destinationAddress">Destination Address</FieldLabel>
                            <Input
                                name="destinationAddress"
                                id="destinationAddress"
                                type="text"
                                placeholder="Where are you going?"
                                required
                                onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="note">Note for Driver (Optional)</FieldLabel>
                            <Input
                                name="note"
                                id="note"
                                placeholder="Gate code, landmark, etc."
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </Field>

                        {error && (
                            <p className="text-sm text-red-500 font-medium text-center">
                                {error.message}
                            </p>
                        )}

                        {data && (
                            <p className="text-sm text-green-600 font-medium text-center">
                                Taxi ordered successfully! Looking for a driver...
                            </p>
                        )}

                        <Field>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !location}
                            >
                                {loading ? "Processing Order..." : "Order Now"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}