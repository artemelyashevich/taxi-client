'use client'

import {logoutAction} from "@/actions/auth";
import {Button} from "@/components/ui/button";
import {useQuery} from "@apollo/client/react";
import {CURRENT_USER} from "@/graphql/queries";
import Link from "next/link";
import {useEffect} from "react";
import Notifications from "@/components/Notifications";

export function Header() {
    const { data, loading: load, error: err } = useQuery(CURRENT_USER);
    if (load) return <p>Загрузка профиля...</p>;
    if (err) return <p>Ошибка: {err.message}</p>;
    const user = data?.findCurrentUser;

    return (
        <header className="py-5 flex items-center justify-between">
            <Link href={"/dashboard"}>Home</Link>
            <form action={logoutAction}>
                <Button className="btn btn-lg btn-primary" type={"submit"}>Logout</Button>
            </form>
            {
                user?.role === 'ROLE_DRIVER' && <><Link href={"/taxi"}>
                 Register new car
                </Link>
                <Notifications userId={user?.id} /></>
            }
            {
                user?.role === 'ROLE_USER' && <Link href={"/order"}>
                    Place order
                </Link>
            }
            <div>
                <p>{user?.role}</p>
                <p className="mb-2">Вы вошли как: <strong>{user?.email}</strong></p>
            </div>
        </header>
    )
}