'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { useState} from "react";
import {useMutation} from "@apollo/client/react";
import {LOGIN_USER} from "@/graphql/queries"; // Если React 18 / Next 14: import { useFormState } from "react-dom"
import { useRouter } from "next/navigation";


export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {

    const [formData, setFormData] = useState({ email: "", password: "" });

    const router = useRouter();


    const [login, {loading, error}] = useMutation(LOGIN_USER, {
        onCompleted: data => {
            console.log(data);
            document.cookie = `session_token=${data.login.accessToken}`;
            document.cookie = `refresh_token=${data.login.refreshToken}`;
            router.push("/dashboard");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ variables: { ...formData } });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
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
                                    required
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </Field>

                            {error && (
                                <p className="text-sm text-red-500 font-medium text-center">
                                    {error.message}
                                </p>
                            )}

                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link href="/register">Sign up</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                        {error && <p className="text-red-500">Error: {error.message}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}