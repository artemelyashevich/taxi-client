import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { FieldDescription } from "@/shared/ui/field";
import { RegisterCarForm } from "@/features/register-car";

export function CarRegistrationCard() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Register new car</CardTitle>
            </CardHeader>
            <CardContent>
                <RegisterCarForm />
                <div className="mt-4">
                    <FieldDescription className="text-center">
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Already have a car? Login
                        </Link>
                    </FieldDescription>
                </div>
            </CardContent>
        </Card>
    );
}