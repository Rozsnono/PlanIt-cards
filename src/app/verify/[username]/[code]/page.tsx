"use client";
import { UserContext } from "@/contexts/user.context";
import { getUser } from "@/functions/user.function";
import { AuthService } from "@/services/auth.service";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function VerifyPage() {

    const router = useRouter();
    const { username, code } = useParams();
    const authService = new AuthService('');
    const { setUser } = useContext(UserContext);

    function verifyEmail() {
        const uname = Buffer.from(username as string, 'hex').toString('utf-8');
        authService.Validate(uname as string, code as string).then((res) => {
            if (res.token) {
                setUser(getUser());
                router.replace('/login');
                router.refresh();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        if (username && code) {
            verifyEmail();
        }
    }, [username, code]);


    return (
        <main className="w-full rounded-md p-3 min-h-screen text-zinc-200 relative gap-2">
            <div className="flex justify-between items-center pb-1">
                <div className="text-xl p-2 flex gap-2 items-center">
                    Email verification
                </div>
            </div>
            <hr />
            <div className={`w-full flex flex-col gap-10 grid-cols-4 justify-center items-center h-full pt-16`}>
                <div className="flex flex-col justify-center text-center gap-2">
                    <h1 className="text-4xl">Congratulation!</h1>
                    <p className="text-lg">Your email has been verified successfully.</p>
                </div>
            </div>
        </main>
    );
}