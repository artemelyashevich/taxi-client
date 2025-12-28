"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { LOGIN_USER } from "../api/auth.gql"
import { setAuthCookies } from "../lib/session"
import {useMutation} from "@apollo/client/react";

export function LoginForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "" })

    const [login, { loading, error }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            setAuthCookies(data.login.accessToken, data.login.refreshToken)
            router.push("/dashboard")
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await login({ variables: formData })
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        required
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </Field>
                {error && <p className="text-sm text-red-500 text-center">{error.message}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </FieldGroup>
        </form>
    )
}