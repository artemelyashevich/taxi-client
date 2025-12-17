"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registerAction } from "@/app/actions/auth";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useActionState } from "react";

const initialState = {
    error: "",
};

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentProps<"div">) {

    const [state, action, isPending] = useActionState(registerAction, initialState);

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
                    <form action={action}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                </div>
                                <Input name="password" id="password" type="password" required />
                            </Field>
                            <Field>
                                <div className="flex items-center gap-2"> {/* Добавил gap */}
                                    <Input
                                        name="isDriver"
                                        id="isDriver"
                                        type="checkbox"
                                        className="w-4 h-4"
                                    />
                                    <FieldLabel htmlFor="isDriver" className="m-0">Register as driver</FieldLabel>
                                </div>
                            </Field>

                            {state?.error && (
                                <p className="text-sm text-red-500 font-medium text-center">
                                    {state.error}
                                </p>
                            )}

                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Registering..." : "Register"}
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