"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useMutation} from "@apollo/client/react";
import {CREATE_TAXI} from "@/graphql/queries";
import {useLocation} from "@/hook/useLocation";

export function CarRegisterForm() {

    const [formData, setFormData] = useState({
        driverName: "",
        licensePlate: "",
        carNumber: "",
        latitude: 0,
        longitude: 0
    });

    const {loading: locationLoading, location, getLocation} = useLocation()

    useEffect(() => {
        getLocation()
    }, [])

    const [createTaxi, {loading, error}] = useMutation(CREATE_TAXI);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Location: " + location)
        await createTaxi({variables: {...formData, latitude: location?.lat, longitude: location?.lng}});
    };

    if (locationLoading) return <>Fetching your location...</>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register new car</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="driverName">Your name</FieldLabel>
                            <Input
                                name="driverName"
                                id="driverName"
                                type="text"
                                placeholder="Your driver name"
                                onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                                required
                            />
                        </Field>
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="licensePlate">Yout license</FieldLabel>
                            </div>
                            <Input
                                name="licensePlate"
                                id="licensePlate"
                                type="text"
                                placeholder={"Your license plate"}
                                required
                                onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                            />
                        </Field>
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="carNumber">Car number</FieldLabel>
                            </div>
                                <Input
                                    name="carNumber"
                                    id="carNumber"
                                    type="text"
                                    required
                                    onChange={(e) => setFormData({...formData, carNumber: e.target.value})}
                                />
                        </Field>

                        {error && (
                            <p className="text-sm text-red-500 font-medium text-center">
                                {error.message}
                            </p>
                        )}

                        <Field>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                            <FieldDescription className="text-center">
                                <Link href="/login">Register new car</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}