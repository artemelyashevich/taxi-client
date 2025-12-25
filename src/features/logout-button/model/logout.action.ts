"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {client} from "@/shared/lib/apolloClient";

export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.delete("session_token");
    cookieStore.delete("refresh_token")
    client.resetStore()
    redirect("/login");
}