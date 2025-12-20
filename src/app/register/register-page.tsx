"use client";

import {cn} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useActionState, useState} from "react";
import {useMutation} from "@apollo/client/react";
import {LOGIN_USER, REGISTER_USER} from "@/graphql/queries";
import {useRouter} from "next/navigation";

const initialState = {
    error: "",
};

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentProps<"div">) {

    const router = useRouter();
    const [formData, setFormData] = useState({email: "", password: "", isDriver: false});


    const [register, {loading, error}] = useMutation(REGISTER_USER, {
        onCompleted: data => {
            console.log(data);
            document.cookie = `session_token=${data.register.accessToken}`;
            document.cookie = `refresh_token=${data.register.refreshToken}`;
            router.push("/dashboard");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register({variables: {...formData}});
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Register to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                </div>
                                <Input
                                    name="password"
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center gap-2"> {/* Добавил gap */}
                                    <Input
                                        name="isDriver"
                                        id="isDriver"
                                        type="checkbox"
                                        className="w-4 h-4"
                                        onChange={(e) => setFormData({...formData, isDriver: e.target.value === 'on' ? true : false})}
                                    />
                                    <FieldLabel htmlFor="isDriver" className="m-0">Register as driver</FieldLabel>
                                </div>
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
                                    Already registered here? <Link href="/login">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}