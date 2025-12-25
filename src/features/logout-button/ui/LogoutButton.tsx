"use client";

import { Button } from "@/shared/ui/button";
import { logoutAction } from "../model/logout.action";

export function LogoutButton() {
    return (
        <form action={logoutAction}>
            <Button className="cursor-pointer" type="submit" variant="destructive">
                Logout
            </Button>
        </form>
    )
}
