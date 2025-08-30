"use client";

import Loader from "@/components/loader.component";
import { UserContext } from "@/contexts/user.context";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./global.scss";

export default function Layout({ children }: { children: React.ReactNode }) {

    const { user } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (user && !user.auth.includes('ADMIN')) {
            router.replace("/");
        }
    }, [user, router]);

    return (
        <main className="w-full p-3 text-zinc-200 relative gap-2 ">
            {
                !user || typeof window === 'undefined' ?
                    <Loader />
                    :
                    <div className="flex w-full gap-4 min-h-screen relative">
                        <div className="w-full p-4 ">
                            <div className="w-full overflow-y-auto py-3">
                                {children}
                            </div>
                        </div>
                    </div>
            }
        </main>
    )
}