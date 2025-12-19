"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {client} from "@/lib/apolloClient";

export async function registerAction(prevState: any, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const isDriverRaw = formData.get("isDriver");
    const isDriver = isDriverRaw === "on";

    const cookieStore = await cookies();

    const BACKEND_URL = "http://localhost:8080/api/v1/auth/register";

    let data;

    try {
        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, isDriver }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Ошибка сервера:", errorText);

            try {
                const jsonError = JSON.parse(errorText);
                return { error: jsonError.message || "Ошибка регистрации" };
            } catch {
                return { error: "Ошибка регистрации (проверьте данные)" };
            }
        }

        data = await res.json();

    } catch (e) {
        console.error("Ошибка сети:", e);
        return { error: "Ошибка соединения с сервером" };
    }

    cookieStore.set("session_token", data.accessToken, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const cookieStore = await cookies();

    const BACKEND_URL = "http://localhost:8080/api/v1/auth/login";

    let data;

    try {
        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Ошибка сервера:", errorText);

            // Пытаемся вернуть сообщение от бэкенда или дефолтное
            try {
                const json = JSON.parse(errorText);
                return { error: json.message || "Неверный логин или пароль" };
            } catch {
                return { error: "Неверный логин или пароль" };
            }
        }

        data = await res.json();

    } catch (e) {
        console.error("Ошибка сети:", e);
        return { error: "Ошибка соединения с сервером" };
    }

    cookieStore.set("session_token", data.accessToken, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.delete("session_token");
    client.resetStore()
    redirect("/login");
}