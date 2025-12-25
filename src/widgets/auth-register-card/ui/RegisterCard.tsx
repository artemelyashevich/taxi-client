import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { FieldDescription } from "@/shared/ui/field"
import { RegisterForm } from "@/features/auth"

export function RegisterCard() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your email below to create your account</CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
                <div className="mt-4">
                    <FieldDescription className="text-center">
                        Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Sign in</Link>
                    </FieldDescription>
                </div>
            </CardContent>
        </Card>
    )
}