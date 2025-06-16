"use client";

import Loader from "@/components/loader.component";
import { UserContext } from "@/contexts/user.context";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/sidebar";
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
                        <div className="hidden md:block h-fit">
                            <Sidebar />
                        </div>

                        <div className="w-full p-4 ">
                            <div className="flex justify-between items-center pb-1">
                                <div className="text-xl p-2 flex gap-2 items-center">
                                    Admin Dashboard
                                </div>
                            </div>
                            <hr />
                            <div className="w-full 2xl:max-h-[82vh] max-h-[85vh] h-full overflow-y-scroll py-3">
                                {children}
                            </div>
                        </div>
                    </div>
            }
        </main>
    )
}