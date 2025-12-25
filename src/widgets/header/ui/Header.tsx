'use client'

import {useQuery} from "@apollo/client/react";
import Link from "next/link";
import {LogoutButton} from "@/features/logout-button";
import {CURRENT_USER} from "@/widgets/header/api/current-user.gql";

export function Header() {
    const { data, loading: load, error: err } = useQuery(CURRENT_USER);
    if (load) return <p>Загрузка профиля...</p>;
    if (err) return <p>Ошибка: {err.message}</p>;
    const user = data?.findCurrentUser;

    if (user != null) {
        // eslint-disable-next-line react-hooks/immutability
        document.cookie = `role=${user?.role}`;
        // eslint-disable-next-line react-hooks/immutability
        document.cookie = `id=${user?.id}`;
    }

    return (
        <header className="py-5 flex items-center justify-between">
            <Link href={"/dashboard"}>Home</Link>
            <LogoutButton />
            {
                user?.role === 'ROLE_DRIVER' ? <><Link href={"/taxi"}>
                    Register new car
                </Link>
                </> : <Link href={"/order"}>Place order</Link>
            }

            <div>
                <p>{user?.role}</p>
                <p className="mb-2">Вы вошли как: <strong>{user?.email}</strong></p>
            </div>
        </header>
    )
}