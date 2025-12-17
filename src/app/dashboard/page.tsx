"use client"; // Важно, так как мы используем хуки

import MapComponent from "@/components/map/MapComponent";
import { Header } from "@/components/Header";
import { useLocation } from "@/hook/useLocation";
import {useQuery} from "@apollo/client/react";
import {CURRENT_USER} from "@/graphql/queries";

export default function DashboardPage() {
    const { location, getLocation, error, loading } = useLocation();
    const { data, loading: load, error: err } = useQuery(CURRENT_USER);
    if (load) return <p>Loading...</p>;
    if (err) return <p>Error: {err.message}</p>;
    return (
        <>
            <Header/>
            {data}
            <div className="h-[500px] w-full relative">
                <MapComponent location={location} />
            </div>

            <div className="p-4 flex flex-col gap-2 items-center">
                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={getLocation}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Поиск..." : (location ? "Обновить местоположение" : "Найти меня")}
                </button>

                {location && (
                    <p className="text-sm text-gray-500">
                        Координаты: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                )}
            </div>
        </>
    )
}