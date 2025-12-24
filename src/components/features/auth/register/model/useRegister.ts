import {useRouter} from "next/navigation";
import {useMutation} from "@apollo/client/react";
import {REGISTER_USER} from "@/components/features/auth/register/api/register.gql";
import {setAuthCookies} from "@/components/features/auth/session";

type RegisterFormData = {
    email: string;
    password: string;
    isDriver: boolean;
};

export function useRegister() {
    const router = useRouter();

    const [register, { loading, error }] = useMutation(REGISTER_USER, {
        onCompleted: (data) => {
            setAuthCookies(data.register.accessToken, data.register.refreshToken);
            router.push("/dashboard");
        },
    });

    const submit = async (formData: RegisterFormData) => {
        await register({ variables: { ...formData } });
    };

    return {
        submit,
        loading,
        error,
    };
}