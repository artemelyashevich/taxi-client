import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { FieldDescription } from "@/shared/ui/field"
import { LoginForm } from "@/features/auth"

export function LoginCard() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Login to account</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
                <div className="mt-4">
                    <FieldDescription className="text-center">
                        Don&apos;t have an account? <Link href="/register" className="text-blue-500 hover:underline">Sign up</Link>
                    </FieldDescription>
                </div>
            </CardContent>
        </Card>
    )
}