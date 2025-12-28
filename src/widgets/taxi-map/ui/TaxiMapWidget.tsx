"use client";

import dynamic from 'next/dynamic';
import { useTaxiSocket } from "@/features/taxi-tracking";
import { Button } from "@/shared/ui/button";
import {useLocation} from "@/shared/hook/useLocation";

const TaxiLiveMap = dynamic(() => import("./TaxiLiveMap"), { ssr: false });

export function TaxiMapWidget() {
    const { location, getLocation, loading } = useLocation();
    const { taxis, status } = useTaxiSocket(location);

    return (
        <div className="flex flex-col gap-4">
            <div className="text-xs">WS Map: <span className={status === "Connected" ? "text-green-500" : "text-red-500"}>{status}</span></div>
            <div className="h-[500px] w-full relative border rounded-lg overflow-hidden">
                <TaxiLiveMap userLocation={location} taxis={taxis} />
            </div>
            <div className="flex justify-center">
                <Button onClick={getLocation} disabled={loading}>{loading ? "Locating..." : "Find Me"}</Button>
            </div>
        </div>
    );
}