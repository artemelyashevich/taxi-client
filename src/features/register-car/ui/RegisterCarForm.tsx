"use client"

import { useState, useEffect } from "react";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useLocation } from "@/shared/hook/useLocation";
import {useMutation} from "@apollo/client/react";
import {CREATE_TAXI} from "@/features/register-car/api/register-car.gql";


export function RegisterCarForm() {
    const [formData, setFormData] = useState({
        driverName: "",
        licensePlate: "",
        carNumber: "",
    });

    const { loading: locationLoading, location, getLocation } = useLocation();
    const [createTaxi, { loading, error }] = useMutation(CREATE_TAXI);

    useEffect(() => {
        getLocation();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTaxi({
            variables: {
                ...formData,
                latitude: location?.lat || 0,
                longitude: location?.lng || 0
            }
        });
    };

    if (locationLoading) return <span>Fetching your location...</span>;

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="driverName">Your name</FieldLabel>
                    <Input
                        id="driverName"
                        type="text"
                        placeholder="Your driver name"
                        onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="licensePlate">Your license</FieldLabel>
                    <Input
                        id="licensePlate"
                        type="text"
                        placeholder="Your license plate"
                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="carNumber">Car number</FieldLabel>
                    <Input
                        id="carNumber"
                        type="text"
                        onChange={(e) => setFormData({ ...formData, carNumber: e.target.value })}
                        required
                    />
                </Field>

                {error && (
                    <p className="text-sm text-red-500 font-medium text-center">
                        {error.message}
                    </p>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Registering..." : "Register"}
                </Button>
            </FieldGroup>
        </form>
    );
}