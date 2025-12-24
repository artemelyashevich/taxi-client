'use client'

import { useMutation } from "@apollo/client/react"
import { useRouter } from "next/navigation"
import { LOGIN_USER } from "../api/login.gql"
import {setAuthCookies} from "@/components/features/auth/session";

type LoginVars = { email: string; password: string }

export function useLogin() {
    const router = useRouter()

    const [login, { loading, error }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            setAuthCookies(data.login.accessToken, data.login.refreshToken)
            router.push("/dashboard")
        },
    })

    const submit = async (vars: LoginVars) => {
        await login({ variables: vars })
    }

    return { submit, loading, error }
}
