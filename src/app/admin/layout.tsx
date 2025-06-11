"use client";

import Loader from "@/components/loader.component";
import { UserContext } from "@/contexts/user.context";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {

    const { user } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (user && !user.auth.includes('ADMIN')) {
            router.replace("/");
        }
    }, [user, router]);

    return (
        <main>
            {
                !user || typeof window === 'undefined' ?
                    <Loader />
                    :
                    children
            }
        </main>
    )
}