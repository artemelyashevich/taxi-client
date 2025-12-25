"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { REGISTER_USER } from "../api/auth.gql"
import { setAuthCookies } from "../lib/session"
import {useMutation} from "@apollo/client/react";

export function RegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "", isDriver: false })

    const [register, { loading, error }] = useMutation(REGISTER_USER, {
        onCompleted: (data) => {
            setAuthCookies(data.register.accessToken, data.register.refreshToken)
            router.push("/dashboard")
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await register({ variables: formData })
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="reg-email">Email</FieldLabel>
                    <Input
                        id="reg-email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="reg-password">Password</FieldLabel>
                    <Input
                        id="reg-password"
                        type="password"
                        required
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </Field>
                <Field className="flex flex-row justify-center">
                    <FieldLabel htmlFor="isDriver" className="mb-0">Register as driver</FieldLabel>
                    <Input
                        id="isDriver"
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={(e) => setFormData({ ...formData, isDriver: e.target.checked })}
                    />
                </Field>
                {error && <p className="text-sm text-red-500 text-center">{error.message}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Registering..." : "Register"}
                </Button>
            </FieldGroup>
        </form>
    )
}